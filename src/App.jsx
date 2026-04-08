import { useState, useRef, useCallback, useEffect } from 'react';
import Hero from './components/Hero';
import ControlPanel from './components/ControlPanel';
import Timeline from './components/Timeline';
import DetailPanel from './components/DetailPanel';
import Tooltip from './components/Tooltip';
import Footer from './components/Footer';

const MIN_ZOOM = 0.3;
const MAX_ZOOM = 3;

function App() {
  const [zoom, setZoom] = useState(1);
  const [currentEra, setCurrentEra] = useState('all');
  const [selectedDynasty, setSelectedDynasty] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tooltip, setTooltip] = useState({ visible: false, position: { x: 0, y: 0 }, dynasty: null });
  
  const timelineRef = useRef(null);

  const scrollToTimeline = useCallback(() => {
    timelineRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.3, MAX_ZOOM));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.3, MIN_ZOOM));
  }, []);

  const handleResetView = useCallback(() => {
    setZoom(1);
    setCurrentEra('all');
    setSelectedDynasty(null);
    setSearchQuery('');
  }, []);

  const handleEraChange = useCallback((eraId) => {
    setCurrentEra(eraId);
    setSelectedDynasty(null);
  }, []);

  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleSelectDynasty = useCallback((dynasty) => {
    setSelectedDynasty(dynasty);
  }, []);

  const handleCloseDetailPanel = useCallback(() => {
    setSelectedDynasty(null);
  }, []);

  const handleShowTooltip = useCallback((event, dynasty) => {
    const rect = event.target.getBoundingClientRect();
    setTooltip({
      visible: true,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      },
      dynasty
    });
  }, []);

  const handleHideTooltip = useCallback(() => {
    setTooltip(prev => ({ ...prev, visible: false }));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedDynasty(null);
      }
    };

    const handleClickOutside = (e) => {
      if (!e.target.closest('.detail-panel') && 
          !e.target.closest('.dynasty-block') && 
          selectedDynasty) {
        setSelectedDynasty(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [selectedDynasty]);

  return (
    <div className="bg-paper font-sans text-ink min-h-screen">
      <Hero onScrollToTimeline={scrollToTimeline} />
      
      <ControlPanel
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        currentEra={currentEra}
        onEraChange={handleEraChange}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
      />

      <main ref={timelineRef} className="container mx-auto px-4 py-8">
        <Timeline
          currentEra={currentEra}
          searchQuery={searchQuery}
          zoom={zoom}
          selectedDynasty={selectedDynasty?.id}
          onSelectDynasty={handleSelectDynasty}
          onShowTooltip={handleShowTooltip}
          onHideTooltip={handleHideTooltip}
        />
        
        <div className="mt-4 text-center text-sm text-inkLight/60">
          <span className="inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            拖动或滚动浏览时间轴 · 点击朝代查看详情 · 支持缩放调整视图
          </span>
        </div>
      </main>

      <DetailPanel 
        dynasty={selectedDynasty} 
        onClose={handleCloseDetailPanel} 
      />

      <Tooltip
        visible={tooltip.visible}
        position={tooltip.position}
        dynasty={tooltip.dynasty}
      />

      <Footer />
    </div>
  );
}

export default App;
