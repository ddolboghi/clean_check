"use client";

import { useState } from "react";
import { postWeeklyCheckList } from "@/services/postWeeklyCheckList";

export default function AddCheckList() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleButtonClick = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await postWeeklyCheckList(); // 체크리스트 생성 함수 호출
      setSuccess("체크리스트가 성공적으로 생성되었습니다.");
    } catch (err) {
      setError("체크리스트 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleButtonClick} disabled={loading}>
        {loading ? "생성 중..." : "체크리스트 생성"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
}
