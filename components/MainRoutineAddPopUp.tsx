"use client";

import "@/style/popUpAnimation.css";
import { addMainRoutine } from "@/actions/routine";
import { ROUTINE_MAX_LENGTH } from "@/utils/constant";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

type MainRoutineAddPopUpProps = {
  handleBtn: (content?: string) => void;
};

export default function MainRoutineAddPopUp({
  handleBtn,
}: MainRoutineAddPopUpProps) {
  const [content, setContent] = useState<string>();

  const handleSaveContent = async () => {
    const {
      data: { user },
    } = await createClient().auth.getUser();

    if (!user || !content) throw new Error("Bad request.");
    handleBtn(content);
    const response = await addMainRoutine(content, user.id);
    if (!response) throw new Error("Bad request.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="transform transition-transform duration-300 scale-100 opacity-100">
        <div className="flex flex-col items-center justify-between px-6 bg-[#F6F9F9] text-sm font-semibold tracking-tight w-[330px] h-[260px] rounded-3xl transition-transform duration-300 ease-in-out animate-up">
          <h1 className="text-[20px] font-semibold text-[#698388] w-full pt-[30px]">
            루틴 추가
          </h1>
          <div className="px-[19px] flex items-center justify-between bg-white rounded-[15px] w-full h-[46px]">
            <input
              placeholder="루틴을 입력해주세요."
              className="pr-2 outline-none placeholder:#B6B6B6 placeholder:text-[13px] placeholder:font-medium"
              onChange={(e) => setContent(e.target.value)}
              maxLength={ROUTINE_MAX_LENGTH}
            />
            <span className="text-[#D7D7D7] text-[12px]">
              {content?.length}/{ROUTINE_MAX_LENGTH}
            </span>
          </div>
          <div className="flex justify-end w-full pb-6">
            <button
              className="h-[32px] w-[63px] text-[12px] font-medium leading-loose text-center text-[#698388] rounded-full"
              onClick={() => handleBtn()}
            >
              취소
            </button>
            <button
              className={`${
                content && content.length > 0 ? "bg-[#6AC7D7]" : "bg-[#C9DDE1]"
              } h-[32px] w-[63px] text-[12px] font-medium leading-loose text-center text-white rounded-full`}
              onClick={handleSaveContent}
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
