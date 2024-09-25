"use client";

import { FolderWithRoutines } from "@/utils/types";
import { useEffect, useState } from "react";
import SlideFolder from "./SlideFolder";
import StorageAddPopUp from "../StorageAddPopUp";
import GlobalAddBtn from "../GlobalAddBtn";
import { getFolders } from "@/actions/storage";

type StoragesProps = {
  initFolders: FolderWithRoutines[] | null;
};

export default function Storages({ initFolders }: StoragesProps) {
  const [folders, setFolders] = useState<FolderWithRoutines[] | null>(
    initFolders
  );
  const [showStorageAddPopUp, setShowStorageAddPopUp] = useState(false);

  useEffect(() => {
    const getFolderWithRoutines = async () => {
      const response = await getFolders();
      if (response && !showStorageAddPopUp) {
        setFolders(response);
      }
    };

    getFolderWithRoutines();
  }, [showStorageAddPopUp]);

  const handleGlobalAddBtn = () => {
    setShowStorageAddPopUp(!showStorageAddPopUp);
  };

  const handleUpdateFolders = (deletedFolderId: number) => {
    if (folders) {
      let updatedFolders = [...folders];
      updatedFolders = updatedFolders.filter(
        (folder) => folder.id !== deletedFolderId
      );
      setFolders(updatedFolders);
    }
  };

  return (
    <section className="w-full pt-16 flex flex-col gap-3">
      {folders ? (
        folders.map((folder) => (
          <SlideFolder
            key={folder.id}
            folderId={folder.id}
            initName={folder.name}
            initRoutines={folder.routines}
            handleUpdateFolders={handleUpdateFolders}
          />
        ))
      ) : (
        <div>폴더를 추가해보세요!</div>
      )}
      <GlobalAddBtn handleBtn={handleGlobalAddBtn}>
        {showStorageAddPopUp && (
          <StorageAddPopUp handleBtn={handleGlobalAddBtn} animateOn={true} />
        )}
      </GlobalAddBtn>
    </section>
  );
}
