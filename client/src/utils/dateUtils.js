export function calculateRelationshipScore(startDateStr) {
  if (!startDateStr) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalDays: 0,
      hasStarted: false
    };
  }

  const start = new Date(startDateStr).getTime();
  const now = new Date().getTime();
  const diff = now - start;

  if (isNaN(diff) || diff < 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalDays: 0,
      hasStarted: false
    };
  }

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return {
    days,
    hours,
    minutes,
    seconds,
    totalDays: days,
    hasStarted: true
  };
}

export function getMilestones(totalDays) {
  const milestones = [
    { target: 7, label: '1 Week of Magic' },
    { target: 30, label: '1 Month Together' },
    { target: 50, label: '50 Golden Days' },
    { target: 100, label: '100 Sweet Days' },
    { target: 182, label: 'Half-Year Milestone' },
    { target: 365, label: '1 Year Anniversary' },
    { target: 500, label: '500 Days of Love' },
    { target: 730, label: '2 Years Forever' },
    { target: 1000, label: '1000 Days Milestone' },
  ];

  return milestones.map(m => ({
    ...m,
    achieved: totalDays >= m.target,
    progress: Math.min(100, Math.round((totalDays / m.target) * 100))
  }));
}

export function formatTime12h(time24) {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
}

export function getTodayDateStr() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}
