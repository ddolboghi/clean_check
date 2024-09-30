"use client";

import { useState } from "react";
import AddIcon from "../icons/AddIcon";
import AddIconColor from "../icons/AddIconColor";
import { createClient } from "@/utils/supabase/client";
import { addMainRoutine } from "@/actions/routine";
import { countAddingYoutubeRoutine } from "@/actions/userActions";

type YoutubeRoutinesProps = {
  videoId: string;
  routines: { [key: number]: string };
};

export default function YoutubeRoutines({
  videoId,
  routines,
}: YoutubeRoutinesProps) {
  const initialAddedState = Object.keys(routines).reduce((acc, key) => {
    acc[Number(key)] = false;
    return acc;
  }, {} as { [key: number]: boolean });
  const [isAdded, setIsAdded] = useState<{ [key: number]: boolean }>(
    initialAddedState
  );

  const addContent = async (routineId: string, content: string) => {
    let updatedIsAdded = { ...isAdded };
    updatedIsAdded[Number(routineId)] = true;
    setIsAdded(updatedIsAdded);

    const {
      data: { user },
    } = await createClient().auth.getUser();

    if (!user) throw new Error("Not allowed access.");
    const response = await addMainRoutine(content, user.id);
    await countAddingYoutubeRoutine(user, videoId, {
      [Number(routineId)]: content,
    });

    if (!response) throw new Error("Bad request.");
  };

  return (
    <section>
      <h1 className="text-[13px] text-[#6AC7D7] font-semibold mb-2">Routine</h1>
      {Object.entries(routines).map(([routineId, content]) => (
        <div
          key={routineId}
          className="flex flex-row items-center justify-between text-[12px] text-[#626262] py-1"
        >
          <p>{content}</p>
          <button onClick={() => addContent(routineId, content)}>
            {isAdded[Number(routineId)] ? <AddIcon /> : <AddIconColor />}
          </button>
        </div>
      ))}
    </section>
  );
}
