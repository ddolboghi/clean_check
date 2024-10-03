"use client";

import { useEffect, useState } from "react";
import CloseIcon from "../icons/CloseIcon";
import { Folder } from "@/utils/types";
import StorageAddPopUp from "../storage/StorageAddPopUp";
import { addRoutineToFolder, getSimpleFolders } from "@/actions/storage";
import { Skeleton } from "../ui/skeleton";

type SavePopUpProps = {
  index: number;
  routineId: number;
  handleSaveBtn: () => void;
  setOffset: (value: React.SetStateAction<number>) => void;
  handleMoveToStorage: (routineIdx: number) => void;
};

export default function SavePopUp({
  index,
  routineId,
  handleSaveBtn,
  setOffset,
  handleMoveToStorage,
}: SavePopUpProps) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStorageAddPopUp, setShowStorageAddPopUp] = useState(false);

  useEffect(() => {
    const getFolders = async () => {
      const response = await getSimpleFolders();
      if (response) {
        setFolders(response);
        setLoading(false);
      }
    };

    if (!showStorageAddPopUp) {
      getFolders();
    }
  }, [showStorageAddPopUp]);

  const handleCancleBtn = () => {
    handleSaveBtn();
    setOffset(0);
  };

  const handleNewFolder = () => {
    setShowStorageAddPopUp(!showStorageAddPopUp);
  };

  const handleAddRoutineToFolder = async (folderId: number) => {
    handleCancleBtn();
    handleMoveToStorage(index);
    const response = await addRoutineToFolder(folderId, routineId);
    if (!response) throw new Error("Bad request.");
  };

  return (
    <>
      {showStorageAddPopUp ? (
        <StorageAddPopUp handleBtn={handleNewFolder} animateOn={false} />
      ) : (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="m-5 flex flex-col gap-5 justify-between items-end p-5 bg-[#F6F9F9] min-w-[200px] w-[364px] rounded-[23px] min-h-[181px] h-auto">
            <div className="flex justify-between w-full">
              <h1 className="text-[20px] font-semibold text-[#698388]">
                보관함에 저장
              </h1>
              <button
                className="w-[30px] flex justify-center items-center"
                onClick={handleCancleBtn}
              >
                <CloseIcon />
              </button>
            </div>
            <div className="flex flex-col gap-2 w-full">
              {loading ? (
                <div className="flex flex-col gap-2">
                  <Skeleton className="w-full h-[46px] rounded-[15px]" />
                  <Skeleton className="w-full h-[46px] rounded-[15px]" />
                  <Skeleton className="w-full h-[46px] rounded-[15px]" />
                </div>
              ) : (
                folders.map((folder) => (
                  <div
                    key={folder.id}
                    className="active:bg-[#C9DDE1] bg-white w-full rounded-[15px] px-[19px] flex flex-row justify-between items-center h-[46px]"
                    onClick={() => handleAddRoutineToFolder(folder.id)}
                  >
                    <p className="text-[16px] font-medium text-[#444444]">
                      {folder.name}
                    </p>
                    <span className="text-[12px] font-light text-[#898989]">
                      {folder.numberOfRoutines}
                    </span>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={handleNewFolder}
              className="text-white text-center align-middle bg-[#88D6E4] w-[88px] h-[32px] rounded-full flex justify-between items-center px-4"
            >
              <span className="font-medium">+</span>
              <span className="text-[12px] font-medium">새 폴더</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
