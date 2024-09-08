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
    <div className="bg-[#24E6C1] px-6 mb-[-55px]">
      <div className="mb-[53px] flex flex-row justify-between items-center">
        <div>
          <h1 className="pt-[76px] font-semibold text-[26px] pb-2 leading-tight">
            작은 습관으로 지키는
            <br /> 나의 피부
          </h1>
          <p className="mb-[35px] text-[#286459] font-medium">
            지금부터 바로 시작해요!
          </p>
        </div>
        <div className="pt-10">
          <LogoutButton>
            <CleanFreeLogoWhite />
          </LogoutButton>
        </div>
      </div>
    </div>
  );
}
