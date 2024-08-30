"use client";

import { useEffect, useState } from "react";
import AddCheckList from "./AddCheckList";
import { getAllProfiles, SupabaseProfile } from "@/actions/profile";

export default function AddProxyPage() {
  const adminPw = process.env.NEXT_PUBLIC_ADMIN_PASSWORD as string;
  const [inputValue, setInputValue] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [profiles, setProfiles] = useState<SupabaseProfile[]>();

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
      const allProfiles = await getAllProfiles();
      if (allProfiles) {
        setProfiles(allProfiles);
      }
    }

    fetchProfiles();

    const intervalId = setInterval(fetchProfiles, 30000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <section>
      {isAuthorized ? (
        <div>
          {profiles?.map((profile) => (
            <ul key={profile.id} className="border-zinc-500 border-b-2">
              <li>회원 ID: {profile.id}</li>
              <li>
                {profile.full_name}, {profile.email}
              </li>
            </ul>
          ))}

          <AddCheckList />
        </div>
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
