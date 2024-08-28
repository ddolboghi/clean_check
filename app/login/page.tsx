import GoogleLoginButton from "@/components/GoogleLoginButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import cleanFreeLogo from "@/assets/cleanfreeLogo2.png";
import Image from "next/image";

export default async function Login() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  if (user) {
    redirect("/checklist");
  }

  return (
    <main className="pb-[76px] flex flex-col gap-[177px] justify-end items-center h-screen overflow-hidden">
      <div className="text-center">
        <h1 className="font-semibold text-[40px] mb-6 opacity-0 translate-y-10 animate-fadeInUp">
          환영합니다!
        </h1>
        <p className="text-[#808080] text-[20px] opacity-0 translate-y-10 animate-fadeIn delay-2000">
          스킨체크와 함께 피부를 지켜보세요.
        </p>
      </div>
      <div className="opacity-0 animate-fadeIn delay-2000">
        <Image
          src={cleanFreeLogo}
          width={195}
          height={195}
          alt="클린프리 로고"
        />
      </div>
      <div className="opacity-0 animate-fadeIn delay-2000">
        <GoogleLoginButton />
      </div>
    </main>
  );
}
