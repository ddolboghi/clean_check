import CleanFreeLogoWhite from "../icons/CleanFreeLogoWhite";

export default function CheckListHead() {
  return (
    <div className="px-6 flex flex-row justify-between items-center">
      <div>
        <h1 className="pt-[76px] font-semibold text-[26px] pb-2">
          작은 습관으로 지키는
          <br /> 나의 피부
        </h1>
        <p className="mb-[35px] text-[#286459] font-medium">
          지금부터 바로 시작해요!
        </p>
      </div>
      <CleanFreeLogoWhite />
    </div>
  );
}
