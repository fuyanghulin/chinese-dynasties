import { ERAS } from '../data/dynasties';

const ControlPanel = ({ 
  searchQuery, 
  onSearchChange, 
  currentEra, 
  onEraChange, 
  onZoomIn, 
  onZoomOut, 
  onResetView 
}) => {
  return (
    <nav className="sticky top-0 z-40 bg-paper/95 backdrop-blur-sm border-b border-ink/10 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 lg:flex-none lg:w-64">
              <input 
                type="text" 
                placeholder="搜索朝代..." 
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full py-2 px-4 pl-10 border border-ink/10 rounded-lg bg-white/80 text-sm transition-all focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-inkLight/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <div className="flex items-center gap-1 bg-porcelain rounded-lg p-1">
              <button 
                onClick={onZoomIn} 
                className="p-1.5 rounded transition-all text-inkLight hover:bg-accent/10 hover:text-accent"
                title="放大"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              <button 
                onClick={onZoomOut} 
                className="p-1.5 rounded transition-all text-inkLight hover:bg-accent/10 hover:text-accent"
                title="缩小"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <button 
                onClick={onResetView} 
                className="p-1.5 rounded transition-all text-inkLight hover:bg-accent/10 hover:text-accent"
                title="重置视图"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex gap-1 min-w-max">
              {ERAS.map(era => (
                <button
                  key={era.id}
                  onClick={() => onEraChange(era.id)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-all whitespace-nowrap ${
                    era.id === currentEra 
                      ? 'bg-accent text-white' 
                      : 'text-inkLight hover:bg-accent/10 hover:text-accent'
                  }`}
                >
                  {era.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-inkLight">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-accent"></span>
                大一统
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-inkLight"></span>
                分裂并立
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-bronze"></span>
                少数民族政权
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ControlPanel;
