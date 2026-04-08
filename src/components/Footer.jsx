const Footer = () => {
  return (
    <footer className="bg-paperDark border-t border-ink/10 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-sm text-inkLight/80 mb-2">
            当前为历史可视化演示版本，后续可扩充更详细政权资料
          </p>
          <p className="text-xs text-inkLight/60">
            时间数据采用通行简化写法，仅供学习参考
          </p>
          <p className="text-xs text-inkLight/40 mt-4">
            中国朝代演进图 © 2024
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
