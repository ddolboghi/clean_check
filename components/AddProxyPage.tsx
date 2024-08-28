"use client";

import { useState } from "react";
import AddCheckList from "./AddCheckList";

export default function AddProxyPage() {
  const adminPw = process.env.NEXT_PUBLIC_ADMIN_PASSWORD as string;
  const [inputValue, setInputValue] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

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

  return (
    <section>
      {isAuthorized ? (
        <AddCheckList />
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
