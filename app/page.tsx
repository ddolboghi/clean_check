import GoogleLoginButton from "@/components/GoogleLoginButton";

export default async function Index() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="flex-1 flex flex-col gap-20 max-w-4xl px-3">
        <main className="flex-1 flex flex-col gap-6 px-4">
          <GoogleLoginButton />
        </main>
      </div>
    </div>
  );
}
