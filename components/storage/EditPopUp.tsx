"use client";

import { updateFolderName } from "@/actions/storage";
import { ROUTINE_MAX_LENGTH } from "@/utils/constant";
import { useState } from "react";

type EditPopUpProps = {
  folderId: number;
  name: string;
  handleEditBtn: (updatedContent?: string) => void;
  setOffset: (value: React.SetStateAction<number>) => void;
};

export default function EditPopUp({
  folderId,
  name,
  handleEditBtn,
  setOffset,
}: EditPopUpProps) {
  const [editedName, setEditedName] = useState<string>(name);

  const handleCancleBtn = () => {
    handleEditBtn();
    setOffset(0);
  };

  const handleUpdateContent = async () => {
    handleEditBtn(editedName);
    setOffset(0);
    if (name !== editedName) {
      const response = await updateFolderName(folderId, editedName);
      if (!response) throw new Error("Bad request");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="m-5 flex flex-col justify-between items-center p-5 bg-[#F6F9F9] min-w-[200px] w-[364px] rounded-[23px] h-[181px]">
        <h1 className="text-[20px] font-semibold text-[#698388] w-full">
          폴더명 수정
        </h1>
        <div className="px-[19px] flex items-center justify-between bg-white rounded-[15px] w-full h-[46px]">
          <input
            value={editedName}
            placeholder={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="pr-2 outline-none placeholder:#B6B6B6 placeholder:text-[13px] placeholder:font-medium"
            maxLength={ROUTINE_MAX_LENGTH}
          />
          <span className="text-[#D7D7D7] text-[12px]">
            {name.length}/{ROUTINE_MAX_LENGTH}
          </span>
        </div>
        <div className="flex justify-end w-full">
          <button
            className="h-[32px] w-[63px] text-[12px] font-medium leading-loose text-center text-[#698388] rounded-full"
            onClick={handleCancleBtn}
          >
            취소
          </button>
          <button
            className={`${
              editedName.length > 0 ? "bg-[#6AC7D7]" : "bg-[#C9DDE1]"
            } h-[32px] w-[63px] text-[12px] font-medium leading-loose text-center text-white rounded-full`}
            onClick={handleUpdateContent}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
