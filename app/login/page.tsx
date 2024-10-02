import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import logo from "@/public/assets/beauing-512x512.png";
import Image from "next/image";
import "@/style/loginPageAnimation.css";
import KakaoLoginButton from "@/components/KakaoLoginButton";

export default async function Login() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  if (user) {
    redirect("/main");
  }

  return (
    <main className="flex flex-col justify-center gap-10 items-center text-center h-screen overflow-hidden bg-[#6AC7D7]">
      <h1 className="font-semibold text-[40px] opacity-0 animate-fadeInUp">
        환영합니다!
      </h1>
      <p className="mt-[-20px] pb-10 text-[20px] opacity-0 animate-fadeIn delay-1500">
        뷰잉과 함께
        <br /> 피부를 지켜보세요.
      </p>
      <div className="mb-[-20%] opacity-0 animate-fadeIn delay-1500">
        <Image src={logo} width={195} height={195} alt="앱 로고" />
      </div>
      <div className="mt-[40%] opacity-0 animate-fadeIn delay-1500 flex flex-col gap-2">
        <KakaoLoginButton />
      </div>
    </main>
  );
}
