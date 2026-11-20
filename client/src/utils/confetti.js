import confetti from 'canvas-confetti';

export const triggerLoveConfetti = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 }
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#ec4899', '#a855f7', '#d946ef']
  });
  fire(0.2, {
    spread: 60,
    colors: ['#f43f5e', '#c084fc', '#fbcfe8']
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#a855f7', '#8b5cf6', '#ec4899']
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    colors: ['#fb7185', '#e879f9', '#ffffff']
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ['#a21caf', '#7c3aed', '#f472b6']
  });
};
