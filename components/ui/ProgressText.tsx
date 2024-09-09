type ProgressTextProps = {
  value: number | undefined | null;
};

export const ProgressText = ({ value }: ProgressTextProps) => {
  if (value) {
    if (value === 100) return "끄으으으읕";
    if (value > 90)
      return (
        <span>
          꾸준한 노력이
          <br />
          빛을 발하는 순간이에요.
        </span>
      );
    if (value > 70)
      return (
        <span>
          지금까지 잘해왔어요.
          <br />
          끝까지 가볼까요?
        </span>
      );
    if (value > 60)
      return (
        <span>
          피부가 당신의 노력을
          <br />
          알아보고 있어요. 멈추지 마세요!
        </span>
      );
    if (value > 50)
      return (
        <span>
          피부에 서서히
          <br />
          변화가 스며들고 있어요.
        </span>
      );
    if (value > 40)
      return (
        <span>
          눈에 보이지 않아도
          <br />
          피부 속부터 건강해지고 있어요.
        </span>
      );
    if (value > 30)
      return (
        <span>
          잘하고 있어요.
          <br />
          꾸준함이 답이에요.
        </span>
      );
    if (value > 20)
      return (
        <span>
          잘하고 있어요.
          <br />
          조금만 더!
        </span>
      );
    if (value > 10)
      return (
        <span>
          좋은 시작,
          <br />
          계속 관리해볼까요?
        </span>
      );
    return (
      <span>
        좋아요, 이제 시작이에요!
        <br />
        계속 나아가요.
      </span>
    );
  }
  return (
    <span>
      작은 습관으로 지키는
      <br />
      나의 피부
    </span>
  );
};
