const Hero = ({ onScrollToTimeline }) => {
  return (
    <header className="relative overflow-hidden min-h-[50vh]">
      <div className="absolute inset-0 bg-gradient-to-b from-paperDark/50 to-paper"></div>
      <div className="absolute inset-0 opacity-5 hero-pattern"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-ink mb-4 tracking-wide">
            中国朝代演进图
          </h1>
          <p className="text-lg md:text-xl text-inkLight mb-6 font-serif">
            按时间展开，查看中国历史王朝更替与并立关系
          </p>
          <p className="text-sm md:text-base text-inkLight/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            从上古夏商周到近现代，跨越四千余年的历史长河。直观展示朝代更迭、政权并立、分裂统一的历史脉络。
          </p>
          <button 
            onClick={onScrollToTimeline}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-br from-accent to-accentLight text-white rounded-lg font-medium transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-xl group"
          >
            <span>开始浏览</span>
            <svg className="w-5 h-5 ml-2 transform group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-paper to-transparent"></div>
    </header>
  );
};

export default Hero;
