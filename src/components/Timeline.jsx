import { useRef, useEffect, useCallback, useMemo } from 'react';
import { DYNASTIES_DATA, ERAS } from '../data/dynasties';

const YEAR_SCALE_BASE = 2;
const TRACK_HEIGHT = 60;
const TRACK_GAP = 12;
const PADDING_LEFT = 60;
const PADDING_RIGHT = 60;

const Timeline = ({ 
  currentEra, 
  searchQuery, 
  zoom, 
  selectedDynasty, 
  onSelectDynasty, 
  onShowTooltip, 
  onHideTooltip 
}) => {
  const wrapperRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const era = ERAS.find(e => e.id === currentEra) || ERAS[0];

  const { filteredDynasties, minYear, maxYear, yearRange, timelineWidth, tracks, maxTrack } = useMemo(() => {
    let dynasties = [...DYNASTIES_DATA];
    
    if (currentEra !== 'all') {
      dynasties = dynasties.filter(d => d.era === currentEra);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      dynasties = dynasties.filter(d => 
        d.name.toLowerCase().includes(query) ||
        d.fullName.toLowerCase().includes(query)
      );
    }

    let minYearCalc, maxYearCalc;
    if (currentEra === 'all') {
      minYearCalc = Math.min(...DYNASTIES_DATA.map(d => d.startYear));
      maxYearCalc = Math.max(...DYNASTIES_DATA.map(d => d.endYear));
    } else {
      [minYearCalc, maxYearCalc] = era.range;
    }

    const yearRangeCalc = maxYearCalc - minYearCalc;
    const timelineWidthCalc = Math.max(
      yearRangeCalc * YEAR_SCALE_BASE * zoom + PADDING_LEFT + PADDING_RIGHT, 
      typeof window !== 'undefined' ? window.innerWidth : 1200
    );

    const tracksMap = new Map();
    const sortedDynasties = [...dynasties].sort((a, b) => a.startYear - b.startYear);
    const trackEnds = [];

    sortedDynasties.forEach(dynasty => {
      let assignedTrack = dynasty.track !== undefined ? dynasty.track : 0;
      
      if (dynasty.track === undefined) {
        for (let i = 0; i < trackEnds.length; i++) {
          if (trackEnds[i] <= dynasty.startYear) {
            assignedTrack = i;
            trackEnds[i] = dynasty.endYear;
            break;
          }
        }
        
        if (assignedTrack === dynasty.track) {
          assignedTrack = trackEnds.length;
          trackEnds.push(dynasty.endYear);
        }
      } else {
        while (trackEnds.length <= assignedTrack) {
          trackEnds.push(-Infinity);
        }
        trackEnds[assignedTrack] = Math.max(trackEnds[assignedTrack], dynasty.endYear);
      }
      
      tracksMap.set(dynasty.id, assignedTrack);
    });

    const maxTrackCalc = Math.max(...tracksMap.values(), 0);

    return {
      filteredDynasties: dynasties,
      minYear: minYearCalc,
      maxYear: maxYearCalc,
      yearRange: yearRangeCalc,
      timelineWidth: timelineWidthCalc,
      tracks: tracksMap,
      maxTrack: maxTrackCalc
    };
  }, [currentEra, searchQuery, zoom, era]);

  const contentHeight = (maxTrack + 1) * (TRACK_HEIGHT + TRACK_GAP) + 40;

  const calculateYearStep = useCallback((range) => {
    const scaledRange = range * zoom;
    if (scaledRange < 200) return 10;
    if (scaledRange < 500) return 25;
    if (scaledRange < 1000) return 50;
    if (scaledRange < 2000) return 100;
    if (scaledRange < 5000) return 200;
    return 500;
  }, [zoom]);

  const yearMarkers = useMemo(() => {
    const step = calculateYearStep(yearRange);
    const markers = [];
    
    for (let year = Math.ceil(minYear / step) * step; year <= maxYear; year += step) {
      const x = PADDING_LEFT + ((year - minYear) / yearRange) * (timelineWidth - PADDING_LEFT - PADDING_RIGHT);
      const yearText = year < 0 ? `前${Math.abs(year)}年` : `${year}年`;
      markers.push({ x, year, yearText });
    }
    
    return markers;
  }, [minYear, maxYear, yearRange, timelineWidth, calculateYearStep]);

  const dynastyBlocks = useMemo(() => {
    const sortedDynasties = [...filteredDynasties].sort((a, b) => {
      const trackA = tracks.get(a.id) || 0;
      const trackB = tracks.get(b.id) || 0;
      if (trackA !== trackB) return trackA - trackB;
      return a.startYear - b.startYear;
    });

    return sortedDynasties.map(dynasty => {
      const track = tracks.get(dynasty.id) || 0;
      const x = PADDING_LEFT + ((dynasty.startYear - minYear) / yearRange) * (timelineWidth - PADDING_LEFT - PADDING_RIGHT);
      const width = Math.max(
        ((dynasty.endYear - dynasty.startYear) / yearRange) * (timelineWidth - PADDING_LEFT - PADDING_RIGHT), 
        40
      );
      const y = track * (TRACK_HEIGHT + TRACK_GAP) + 10;
      
      const sizeClass = width < 60 ? 'text-xs' : width < 100 ? 'text-sm' : 'text-base';
      const isSelected = selectedDynasty === dynasty.id;
      const isHighlighted = searchQuery && (
        dynasty.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        dynasty.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );

      return {
        ...dynasty,
        x,
        width,
        y,
        track,
        sizeClass,
        isSelected,
        isHighlighted
      };
    });
  }, [filteredDynasties, tracks, minYear, yearRange, timelineWidth, selectedDynasty, searchQuery]);

  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('.dynasty-block')) return;
    isDragging.current = true;
    wrapperRef.current?.classList.add('dragging');
    startX.current = e.pageX - wrapperRef.current.offsetLeft;
    scrollLeft.current = wrapperRef.current.scrollLeft;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isDragging.current = false;
    wrapperRef.current?.classList.remove('dragging');
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    wrapperRef.current?.classList.remove('dragging');
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - wrapperRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    if (wrapperRef.current) {
      wrapperRef.current.scrollLeft = scrollLeft.current - walk;
    }
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    wrapper.addEventListener('mousedown', handleMouseDown);
    wrapper.addEventListener('mouseleave', handleMouseLeave);
    wrapper.addEventListener('mouseup', handleMouseUp);
    wrapper.addEventListener('mousemove', handleMouseMove);

    return () => {
      wrapper.removeEventListener('mousedown', handleMouseDown);
      wrapper.removeEventListener('mouseleave', handleMouseLeave);
      wrapper.removeEventListener('mouseup', handleMouseUp);
      wrapper.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseDown, handleMouseLeave, handleMouseUp, handleMouseMove]);

  const getDynastyTypeClass = (type) => {
    switch (type) {
      case 'unified':
        return 'bg-gradient-to-br from-accent to-accentLight';
      case 'divided':
        return 'bg-gradient-to-br from-inkLight to-gray-500';
      case 'minority':
        return 'bg-gradient-to-br from-bronze to-amber-700';
      default:
        return 'bg-gradient-to-br from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="bg-white/50 rounded-xl shadow-lg border border-ink/5 overflow-hidden min-h-[500px]">
      <div 
        ref={wrapperRef}
        className="timeline-wrapper relative overflow-x-auto overflow-y-hidden cursor-grab select-none"
      >
        <div 
          className="relative"
          style={{ width: `${timelineWidth}px` }}
        >
          <div 
            className="relative bg-gradient-to-b from-accent/5 to-transparent border-b border-ink/10"
            style={{ height: '40px' }}
          >
            {yearMarkers.map(({ x, yearText }) => (
              <div
                key={x}
                className="absolute bottom-0 transform -translate-x-1/2 flex flex-col items-center text-inkLight"
                style={{ left: `${x}px` }}
              >
                <div className="w-px h-2 bg-ink/20 mb-1"></div>
                <span className="text-[11px] font-medium whitespace-nowrap">{yearText}</span>
              </div>
            ))}
          </div>

          <div 
            className="relative py-4 pb-8"
            style={{ height: `${contentHeight}px` }}
          >
            {dynastyBlocks.map((dynasty) => (
              <div
                key={dynasty.id}
                className={`dynasty-block absolute h-12 md:h-14 rounded-md flex items-center justify-center cursor-pointer transition-all overflow-hidden font-serif ${getDynastyTypeClass(dynasty.type)} ${dynasty.sizeClass} ${dynasty.isSelected ? 'ring-2 ring-accent shadow-lg z-20' : ''} ${dynasty.isHighlighted ? 'dynasty-highlighted' : ''}`}
                style={{
                  left: `${dynasty.x}px`,
                  width: `${dynasty.width}px`,
                  top: `${dynasty.y}px`
                }}
                onMouseEnter={(e) => onShowTooltip(e, dynasty)}
                onMouseLeave={onHideTooltip}
                onClick={() => onSelectDynasty(dynasty)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
                <span className="font-semibold text-white drop-shadow-sm z-10">{dynasty.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
