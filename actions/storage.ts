"use server";

import { supabaseClient } from "@/lib/getSupabaseClient";
import { createClient } from "@/utils/supabase/server";
import { Folder, FolderWithRoutines, MainRoutine } from "@/utils/types";

type SimpleFolder = {
  id: number;
  name: string;
  routine_ids: number[];
};

export const getSimpleFolders = async () => {
  try {
    const {
      data: { user },
    } = await createClient().auth.getUser();

    if (!user) throw new Error("Not allowed access.");

    const { data, error } = await supabaseClient
      .from("storage")
      .select("*")
      .eq("member_id", user.id)
      .eq("is_deleted", false)
      .order("created_at", { ascending: true })
      .returns<SimpleFolder[]>();

    if (error) throw error;
    if (!data) throw new Error("Storage not exist.");

    const folders: Folder[] = data.map((folder) => {
      return {
        id: folder.id,
        name: folder.name,
        numberOfRoutines: folder.routine_ids.length,
      };
    });

    return folders;
  } catch (e) {
    console.error("[getSimpleFolders] Error:", e);
    return null;
  }
};

export const insertFolder = async (name: string) => {
  try {
    const {
      data: { user },
    } = await createClient().auth.getUser();

    if (!user) throw new Error("Not allowed access.");

    const { error } = await supabaseClient.from("storage").insert([
      {
        member_id: user.id,
        name: name,
        routine_ids: [],
      },
    ]);

    if (error) throw error;

    return true;
  } catch (e) {
    console.error("[insertFolder] Error:", e);
    return false;
  }
};

export const addRoutineToFolder = async (
  folderId: number,
  routineId: number
) => {
  try {
    const {
      data: { user },
    } = await createClient().auth.getUser();

    if (!user) throw new Error("Not allowed access.");

    const { error: routineUpdateError } = await supabaseClient
      .from("routine")
      .update({
        is_main: false,
      })
      .eq("id", routineId)
      .eq("member_id", user.id);

    if (routineUpdateError) throw routineUpdateError;

    const { data, error: storageSelectError } = await supabaseClient
      .from("storage")
      .select("*")
      .eq("id", folderId)
      .eq("member_id", user.id)
      .eq("is_deleted", false)
      .returns<SimpleFolder[]>();

    if (storageSelectError) throw storageSelectError;
    if (!data) throw new Error("Storage not exist.");

    let updatedRoutineIds = [...data[0].routine_ids, routineId];

    const { error: storageUpdateError } = await supabaseClient
      .from("storage")
      .update({
        routine_ids: updatedRoutineIds,
      })
      .eq("id", folderId)
      .eq("member_id", user.id);

    if (storageUpdateError) throw storageUpdateError;

    return true;
  } catch (e) {
    console.error("[addRoutineToFolder] Error:", e);
    return false;
  }
};

export const getFolders = async () => {
  try {
    const {
      data: { user },
    } = await createClient().auth.getUser();

    if (!user) throw new Error("Not allowed access.");

    const { data: storageData, error: selectStorageError } =
      await supabaseClient
        .from("storage")
        .select("*")
        .eq("member_id", user.id)
        .eq("is_deleted", false)
        .order("created_at", { ascending: true })
        .returns<SimpleFolder[]>();

    if (selectStorageError) throw selectStorageError;
    if (!storageData) throw new Error("Storage is null");

    let folders: FolderWithRoutines[] = [];

    for (const storage of storageData) {
      const { data: routineData, error: selectRoutineError } =
        await supabaseClient
          .from("routine")
          .select("*")
          .in("id", storage.routine_ids)
          .eq("is_deleted", false)
          .order("created_at", { ascending: true })
          .returns<MainRoutine[]>();

      if (selectRoutineError) throw selectRoutineError;
      if (!routineData)
        throw new Error(`routin id ${storage.id} is not exist.`);

      folders.push({
        id: storage.id,
        name: storage.name,
        numberOfRoutines: storage.routine_ids.length,
        routines: routineData,
      });
    }

    return folders;
  } catch (e) {
    console.error("[getFolders] Error:", e);
    return null;
  }
};

export const getRoutinesByFolderId = async (folderId: number) => {
  try {
    const {
      data: { user },
    } = await createClient().auth.getUser();

    if (!user) throw new Error("Not allowed access.");

    const { data: storageData, error: selectStorageError } =
      await supabaseClient
        .from("storage")
        .select("*")
        .eq("id", folderId)
        .eq("member_id", user.id)
        .eq("is_deleted", false)
        .single<SimpleFolder>();

    if (selectStorageError) throw selectStorageError;
    if (!storageData) throw new Error("Storage is null.");

    const { data: routineData, error: selectRoutineError } =
      await supabaseClient
        .from("routine")
        .select("*")
        .in("id", storageData.routine_ids)
        .eq("member_id", user.id)
        .eq("is_deleted", false)
        .returns<MainRoutine[]>();

    if (selectRoutineError) throw selectRoutineError;
    if (!routineData) throw new Error("Routine is null.");

    return routineData;
  } catch (e) {
    console.error("[getRoutinesByFolderId] Error:", e);
    return null;
  }
};

export const moveRoutineToMain = async (
  folderId: number,
  routineId: number,
  updatedRoutines: MainRoutine[]
) => {
  const routineIds = updatedRoutines.map((routine) => routine.id);
  try {
    const {
      data: { user },
    } = await createClient().auth.getUser();

    if (!user) throw new Error("Not allowed access.");

    const { error: updateStorageError } = await supabaseClient
      .from("storage")
      .update({
        routine_ids: routineIds,
      })
      .eq("id", folderId)
      .eq("member_id", user.id)
      .eq("is_deleted", false);

    if (updateStorageError) throw updateStorageError;

    const { error: updateRoutineError } = await supabaseClient
      .from("routine")
      .update({
        is_main: true,
      })
      .eq("id", routineId)
      .eq("member_id", user.id)
      .eq("is_deleted", false);

    if (updateRoutineError) throw updateRoutineError;
    return true;
  } catch (e) {
    console.error("[moveRoutineToMain] Error:", e);
    return false;
  }
};

export const deleteFolder = async (folderId: number) => {
  try {
    const {
      data: { user },
    } = await createClient().auth.getUser();

    if (!user) throw new Error("Not allowed access.");

    const { error } = await supabaseClient
      .from("storage")
      .update({ is_deleted: true })
      .eq("id", folderId)
      .eq("member_id", user.id)
      .eq("is_deleted", false);

    if (error) throw error;
    return true;
  } catch (e) {
    console.error("[deleteFolder] Error: ", e);
    return false;
  }
};

export const updateFolderName = async (
  folderId: number,
  updatedName: string
) => {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  if (!user) throw new Error("Not allowed access.");

  try {
    const { error } = await supabaseClient
      .from("storage")
      .update({ name: updatedName })
      .eq("id", folderId)
      .eq("member_id", user.id)
      .eq("is_deleted", false);

    if (error) throw error;
    return true;
  } catch (e) {
    console.error("[updateFolderName] Error: ", e);
    return false;
  }
};
