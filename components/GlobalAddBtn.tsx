"use client";

import AddIconColor from "./icons/AddIconColor";

type GlobalAddBtnProps = {
  children: React.ReactNode;
  handleBtn: () => Promise<void>;
};

export default function GlobalAddBtn({
  children,
  handleBtn,
}: GlobalAddBtnProps) {
  return (
    <>
      {children}
      <button
        className="absolute bottom-[80px] right-6"
        onClick={() => handleBtn()}
      >
        <AddIconColor width="30" height="30" />
      </button>
    </>
  );
}
