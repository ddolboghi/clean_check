"use client";

import { useEffect, useState } from "react";
import AddCheckList from "./AddCheckList";
import { getAllProfiles, SupabaseProfile } from "@/actions/profile";
import { Todo } from "@/utils/types";
import { getAllRecentTodoListEachMember } from "@/actions/addCheckList";

export default function AddProxyPage() {
  const adminPw = process.env.NEXT_PUBLIC_ADMIN_PASSWORD as string;
  const [inputValue, setInputValue] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [profiles, setProfiles] = useState<SupabaseProfile[]>([]);
  const [todosMap, setTodosMap] = useState<{ [key: string]: Todo[] }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue === adminPw) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  };

  useEffect(() => {
    async function fetchProfiles() {
      if (isAuthorized) {
        const allProfiles = await getAllProfiles();
        const checkLists = await getAllRecentTodoListEachMember();
        //todo: checkLists 원소마다 profile.id랑 같은 원소의 데이터 넣기
        console.log(checkLists);
        if (allProfiles && checkLists) {
          setProfiles(allProfiles);
          const initialTodosMap = Object.fromEntries(
            allProfiles.map((profile) => [
              profile.id,
              [{ topic: "", todoId: 1, todo: "", days: {} }],
            ])
          );
          setTodosMap(initialTodosMap);
        }
      }
    }

    fetchProfiles();

    const intervalId = setInterval(fetchProfiles, 30000);
    return () => clearInterval(intervalId);
  }, [isAuthorized]);

  return (
    <section>
      {isAuthorized ? (
        <AddCheckList profiles={profiles} initialTodosMap={todosMap} />
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            className="border-solid border-2"
            type="password"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="비밀번호 입력"
          />
          <button type="submit">확인</button>
        </form>
      )}
    </section>
  );
}
