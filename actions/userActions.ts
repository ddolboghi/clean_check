"use server";

import { supabaseClient } from "@/lib/getSupabaseClient";
import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";

type UserTracking = {
  id: number;
  member_id: string;
  member_name: string;
  main_page_access_count: number;
  search_history: string[];
  youtube_routine_add_count: { [key: string]: { [key: number]: string } };
};

export const getUserTracking = async (memberId: string) => {
  try {
    const { data, error } = await supabaseClient
      .from("user_tracking")
      .select("*")
      .eq("member_id", memberId)
      .single<UserTracking>();

    if (error) throw error;
    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const countAeccessMainPage = async (user: User) => {
  try {
    const memberName =
      user.user_metadata["full_name"] ||
      user.user_metadata["name"] ||
      user.user_metadata["preferred_username"] ||
      user.user_metadata["user_name"];

    const userTracking = await getUserTracking(user.id);

    if (!userTracking) {
      const { error } = await supabaseClient.from("user_tracking").insert([
        {
          member_id: user.id,
          member_name: memberName,
          main_page_access_count: 1,
        },
      ]);

      if (error) throw error;
      return true;
    }

    const { error } = await supabaseClient
      .from("user_tracking")
      .update({
        main_page_access_count: userTracking.main_page_access_count + 1,
      })
      .eq("member_id", user.id);

    if (error) throw error;
    return true;
  } catch (e) {
    console.error("[countAeccessMainPage] Error: ", e);
    return false;
  }
};

export const saveSearchHistory = async (searchWord: string) => {
  try {
    const {
      data: { user },
    } = await createClient().auth.getUser();

    if (!user) throw new Error("User not exist.");

    const memberName =
      user.user_metadata["full_name"] ||
      user.user_metadata["name"] ||
      user.user_metadata["preferred_username"] ||
      user.user_metadata["user_name"];

    const userTracking = await getUserTracking(user.id);

    if (!userTracking) {
      const { error } = await supabaseClient.from("user_tracking").insert([
        {
          member_id: user.id,
          member_name: memberName,
          search_history: [searchWord],
        },
      ]);

      if (error) throw error;
      return true;
    }

    const updatedSearchHistory = userTracking.search_history
      ? [...userTracking.search_history, searchWord]
      : [searchWord];
    const { error } = await supabaseClient
      .from("user_tracking")
      .update({
        search_history: updatedSearchHistory,
      })
      .eq("member_id", user.id);

    if (error) throw error;
    return true;
  } catch (e) {
    console.error("[saveSearchHistory] Error: ", e);
    return false;
  }
};

export const countAddingYoutubeRoutine = async (
  user: User,
  videoId: string,
  routines: { [key: number]: string }
) => {
  try {
    const memberName =
      user.user_metadata["full_name"] ||
      user.user_metadata["name"] ||
      user.user_metadata["preferred_username"] ||
      user.user_metadata["user_name"];

    const userTracking = await getUserTracking(user.id);

    if (!userTracking) {
      const { error } = await supabaseClient.from("user_tracking").insert([
        {
          member_id: user.id,
          member_name: memberName,
          youtube_routine_add_count: { [videoId]: routines },
        },
      ]);

      if (error) throw error;
      return true;
    }

    const updatedYoutubeRoutineAddCount = {
      ...userTracking.youtube_routine_add_count,
    };

    if (videoId in updatedYoutubeRoutineAddCount) {
      updatedYoutubeRoutineAddCount[videoId] = {
        ...updatedYoutubeRoutineAddCount[videoId],
        ...routines,
      };
    } else {
      updatedYoutubeRoutineAddCount[videoId] = routines;
    }

    const { error } = await supabaseClient
      .from("user_tracking")
      .update({
        youtube_routine_add_count: updatedYoutubeRoutineAddCount,
      })
      .eq("member_id", user.id);

    if (error) throw error;
    return true;
  } catch (e) {
    console.error("[countAddingYoutubeRoutine] Error: ", e);
    return false;
  }
};
