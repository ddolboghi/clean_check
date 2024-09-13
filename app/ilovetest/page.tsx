import ShareBtn from "@/components/ShareBtn";

export default async function TodayList() {
  const adminPw = process.env.NEXT_PUBLIC_ADMIN_PASSWORD as string;

  return (
    <main className="text-center">
      <h1>test page</h1>
      <hr />
      <ShareBtn shareUrl="share url" />
    </main>
  );
}
