import Menu from "@/components/Menu";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Menu />
    </>
  );
}
