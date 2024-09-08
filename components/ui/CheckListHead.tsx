import Link from "next/link";
import ChatbotReversedIcon from "../icons/ChatbotReversedIcon";
import CleanFreeLogoWhite from "../icons/CleanFreeLogoWhite";
import LogoutButton from "../LogoutButton";

type CheckListHeadProps = {
  memberId?: string;
  subscription?: PushSubscription | null;
  handleDeleteSubscription?: () => void;
};

export default function CheckListHead({
  memberId,
  subscription,
  handleDeleteSubscription,
}: CheckListHeadProps) {
  async function unsubscribeFromPush() {
    try {
      await subscription?.unsubscribe();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/notification-unsubscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            memberId: memberId,
            pushSubscription: subscription,
          }),
        }
      );

      if (!res.ok) throw new Error("Delete pushSubscription failed.");
      else {
        if (handleDeleteSubscription) handleDeleteSubscription();
      }
    } catch (error) {
      console.error(error);
    }
  }
  //추후 필요 시 알림 받지 않는 기능 추가하기

  return (
    <section className="bg-[#24E6C1] px-6 mb-[-55px]">
      <div className="mb-[53px] flex flex-col justify-between">
        <div className="pt-10 flex flex-row justify-between">
          <LogoutButton>
            <CleanFreeLogoWhite />
          </LogoutButton>
          <Link href="/chat">
            <ChatbotReversedIcon />
          </Link>
        </div>
        <div>
          <p className="text-[#286459] font-medium">지금부터 바로 시작해요!</p>
          <h1 className="font-semibold text-[26px] pb-2 leading-tight">
            작은 습관으로 지키는
            <br /> 나의 피부
          </h1>
        </div>
        <div></div>
      </div>
    </section>
  );
}
