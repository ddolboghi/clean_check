"use client";

import AddIconColor from "./icons/AddIconColor";

type GlobalAddBtnProps = {
  children: React.ReactNode;
  handleBtn: () => void;
};

export default function GlobalAddBtn({
  children,
  handleBtn,
}: GlobalAddBtnProps) {
  return (
    <>
      {children}
      <button
        className="fixed z-10 bottom-[86px] right-6"
        onClick={() => handleBtn()}
      >
        <AddIconColor width="30" height="30" />
      </button>
    </>
  );
}
