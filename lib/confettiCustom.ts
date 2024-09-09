import confetti from "canvas-confetti";

export const excuteConfetti = () => {
  const duration = 7 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = {
    startVelocity: 10,
    spread: 360,
    ticks: 60,
    zIndex: 0,
    gravity: 0.3,
  };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const handleConfetti = () => {
    const intervalId: NodeJS.Timeout = setInterval(() => {
      let timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(intervalId);
      }

      var particleCount = 50 * (timeLeft / duration);

      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      );
    }, 250);
  };

  return handleConfetti;
};
