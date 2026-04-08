import { TYPE_LABELS } from '../data/dynasties';

const DetailPanel = ({ dynasty, onClose }) => {
  if (!dynasty) return null;

  const startText = dynasty.startYear < 0 
    ? `前${Math.abs(dynasty.startYear)}年` 
    : `${dynasty.startYear}年`;
  const endText = dynasty.endYear < 0 
    ? `前${Math.abs(dynasty.endYear)}年` 
    : `${dynasty.endYear}年`;
  const duration = dynasty.endYear - dynasty.startYear;
  const typeInfo = TYPE_LABELS[dynasty.type];

  return (
    <div 
      className={`fixed top-0 right-0 w-full max-w-md h-screen bg-paper shadow-2xl z-50 overflow-y-auto transition-transform duration-300 ${
        dynasty ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-8 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-ink/10 transition-colors"
          title="关闭详情面板"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="fade-in">
          <div className="mb-6 pb-4 border-b border-ink/10">
            <h2 className="font-serif text-3xl font-bold text-ink mb-1">{dynasty.fullName}</h2>
            <p className="text-sm text-inkLight">{startText} - {endText}（共{duration}年）</p>
          </div>
          
          <div className="mb-5">
            <label className="block text-xs font-semibold text-accent uppercase tracking-wide mb-1.5">政权类型</label>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              dynasty.type === 'unified' ? 'bg-accent/10 text-accent' :
              dynasty.type === 'divided' ? 'bg-inkLight/10 text-inkLight' :
              'bg-bronze/10 text-bronze'
            }`}>
              {typeInfo.name}
            </span>
          </div>
          
          <div className="mb-5">
            <label className="block text-xs font-semibold text-accent uppercase tracking-wide mb-1.5">建立者</label>
            <p className="text-[15px] text-ink leading-relaxed">{dynasty.founder}</p>
          </div>
          
          <div className="mb-5">
            <label className="block text-xs font-semibold text-accent uppercase tracking-wide mb-1.5">都城</label>
            <p className="text-[15px] text-ink leading-relaxed">{dynasty.capital}</p>
          </div>
          
          <div className="mb-5">
            <label className="block text-xs font-semibold text-accent uppercase tracking-wide mb-1.5">简介</label>
            <p className="text-[15px] text-ink leading-relaxed">{dynasty.description}</p>
          </div>
          
          <div className="mb-5">
            <label className="block text-xs font-semibold text-accent uppercase tracking-wide mb-1.5">历史特点</label>
            <p className="text-[15px] text-ink leading-relaxed">{dynasty.characteristics}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPanel;
