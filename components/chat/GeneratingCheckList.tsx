import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { GeneratingCheckListType } from "./Chatbot";

export default function GeneratingCheckList({
  generateCheckList,
  percentage,
}: {
  generateCheckList: GeneratingCheckListType;
  percentage: number;
}) {
  console.log(generateCheckList);
  console.log(percentage);

  const getProgressText = () => {
    if (!generateCheckList.generateTodoListMessageStart) {
      return "체크리스트를\n생성 중이에요.";
    }
    if (generateCheckList.generateParsedTodoListStart) {
      return "내게 꼭 맞는 맞춤형\n리스트를 생성 중이에요.";
    }
    if (generateCheckList.saveCheckListStart) {
      return "거의 다\n완료됐어요.";
    }
    if (generateCheckList.savedCheckList) {
      return "체크리스트를 통해\n피부를 지켜보아요.";
    }
    return "";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="h-screen flex flex-col justify-center items-center bg-white w-full text-center">
        <div className="">
          <p className="text-[#808080] pb-5 text-[20px]">
            잠시만 기다려주세요.
          </p>
          <p className="font-bold text-[30px]">{getProgressText()}</p>
        </div>
        <div className="mt-10 w-[222px]">
          <CircularProgressbar
            minValue={0}
            maxValue={100}
            value={percentage}
            text={`${percentage}%`}
            styles={{
              root: {
                textAlign: "center",
              },
              // Customize the path, i.e. the "completed progress"
              path: {
                // Path color
                stroke: "#24E6C1",
                // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                strokeLinecap: "butt",
                // Customize transition animation
                transition: "stroke-dashoffset 0.5s ease 0s",
                // Rotate the path
                transformOrigin: "center center",
              },
              // Customize the circle behind the path, i.e. the "total progress"
              trail: {
                stroke: "#EEF3F2",
                // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                strokeLinecap: "butt",
                transform: "rotate(0.25turn)",
                transformOrigin: "center center",
              },
              text: {
                fill: "#24E6C1",
                fontSize: "16px",
                transform: "translateX(-15%) translateY(5%)",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
