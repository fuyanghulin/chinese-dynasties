const Tooltip = ({ visible, position, dynasty }) => {
  if (!visible || !dynasty) return null;

  const startText = dynasty.startYear < 0 
    ? `前${Math.abs(dynasty.startYear)}年` 
    : `${dynasty.startYear}年`;
  const endText = dynasty.endYear < 0 
    ? `前${Math.abs(dynasty.endYear)}年` 
    : `${dynasty.endYear}年`;

  return (
    <div 
      className="fixed px-4 py-3 bg-ink/95 text-white rounded-lg text-sm pointer-events-none z-[100] max-w-[280px] shadow-xl"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -100%)'
      }}
    >
      <div className="font-semibold font-serif mb-1">{dynasty.fullName}</div>
      <div className="text-white/80 text-xs leading-relaxed">
        {startText} - {endText}<br />
        建立者：{dynasty.founder}<br />
        都城：{dynasty.capital}
      </div>
    </div>
  );
};

export default Tooltip;
