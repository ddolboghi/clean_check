import Image from "next/image";
import completeSvg from "@/assets/complete.svg";
import "@/style/completionAllTodoPopUp.css";

type CompletionAllTodoPopUpProps = {
  onClickHomeBtn: () => void;
};

export default function CompletionAllTodoPopUp({
  onClickHomeBtn,
}: CompletionAllTodoPopUpProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="transform transition-transform duration-300 scale-100 opacity-100">
        <div className="bg-white flex flex-col text-sm font-semibold tracking-tight max-w-[364px] rounded-3xl scale-80 opacity-0 transition-all duration-300 ease-in-out animate-grow">
          <div className="flex relative flex-col justify-center items-center px-12 w-full aspect-[1.395]">
            <Image
              loading="lazy"
              src={completeSvg}
              alt="User profile"
              className="object-contain rounded-full aspect-square w-[58px]"
            />
            <h2 className="relative mt-5 text-2xl tracking-tight leading-none text-[#191919]">
              모든 체크 완료!
            </h2>
            <p className="relative self-stretch mt-3 font-light leading-5 text-center text-[#8EA39F]">
              지금의 노력이 쌓여 미래의 아름다움이 됩니다.
              <br />
              계속해서 나아가요!
            </p>
          </div>
          <button
            className="bg-[#24E6C1] h-[49px] leading-loose text-center text-white rounded-b-3xl"
            onClick={onClickHomeBtn}
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}
