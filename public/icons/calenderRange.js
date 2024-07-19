const CalenderRange = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0D3276"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-calendar-range"
    >
      <rect width={18} height={18} x={3} y={4} rx={2} />
      <path d="M16 2v4" />
      <path d="M3 10h18" />
      <path d="M8 2v4" />
      <path d="M17 14h-6" />
      <path d="M13 18H7" />
      <path d="M7 14h.01" />
      <path d="M17 18h.01" />
    </svg>
  );
};

export default CalenderRange;