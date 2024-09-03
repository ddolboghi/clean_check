import { logout } from "@/lib/logout";

export default function LogoutButton({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleLogout = () => {
    const isLogout = logout();
    if (!isLogout) alert("로그아웃에 실패했어요.");
  };

  return <button onClick={() => handleLogout()}>{children}</button>;
}
