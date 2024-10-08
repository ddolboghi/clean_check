type AddIconColor = {
  width?: string;
  height?: string;
};

export default function AddIconColor({ width, height }: AddIconColor) {
  return (
    <svg
      width={`${width ? width : "16"}`}
      height={`${height ? height : "16"}`}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 0.5C3.85775 0.5 0.5 3.85775 0.5 8C0.5 12.1423 3.85775 15.5 8 15.5C12.1423 15.5 15.5 12.1423 15.5 8C15.5 3.85775 12.1423 0.5 8 0.5ZM11 8.75H8.75V11C8.75 11.414 8.414 11.75 8 11.75C7.586 11.75 7.25 11.414 7.25 11V8.75H5C4.586 8.75 4.25 8.414 4.25 8C4.25 7.586 4.586 7.25 5 7.25H7.25V5C7.25 4.586 7.586 4.25 8 4.25C8.414 4.25 8.75 4.586 8.75 5V7.25H11C11.414 7.25 11.75 7.586 11.75 8C11.75 8.414 11.414 8.75 11 8.75Z"
        fill="#6AC7D7"
      />
    </svg>
  );
}
