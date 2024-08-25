"use client";

import { googleLogin } from "@/lib/googleLogin";

const GoogleLoginButton = () => {
  return <button onClick={() => googleLogin()}>Login with Google</button>;
};

export default GoogleLoginButton;
