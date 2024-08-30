import AddProxyPage from "@/components/AddProxyPage";

export default async function TodayList() {
  const adminPw = process.env.NEXT_PUBLIC_ADMIN_PASSWORD as string;

  return (
    <main className="text-center">
      <h1>make cheklist</h1>
      <hr />
      <AddProxyPage />
    </main>
  );
}
