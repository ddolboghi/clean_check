"use server";

import { supabaseClient } from "@/lib/getSupabaseClient";
import { createClient } from "@/utils/supabase/server";
import { Folder } from "@/utils/types";

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

    console.log("[getSimpleFolders] success.");
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

    console.log("[insertFolder] Success.");
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

    console.log("[addRoutineToFolder] Success.");
    return true;
  } catch (e) {
    console.error("[addRoutineToFolder] Error:", e);
    return false;
  }
};
