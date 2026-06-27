const PageWrapper = ({ children }) => {
  return (
    <div className="relative min-h-screen">
      <div
        className="fixed top-25 left-20 w-[90%] h-130 rounded-full blur-3xl -z-10 pointer-events-none"
        style={{ background: "rgba(59,130,246,0.12)" }}
      />
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
};

export default PageWrapper;