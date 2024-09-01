import { GeneratingCheckListType } from "./Chatbot";

export default function GeneratingCheckList({
  isGenerateCheckList,
}: {
  isGenerateCheckList: GeneratingCheckListType;
}) {
  console.log(isGenerateCheckList);
  //isGenerateCheckList에 따라 progress 조정하기
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white text-center">
        <div className="">
          <p>잠시만 기다려주세요.</p>
          <p>
            체크리스트를
            <br />
            생성 중이에요.
          </p>
        </div>
        <div>progress ui</div>
      </div>
    </div>
  );
}
