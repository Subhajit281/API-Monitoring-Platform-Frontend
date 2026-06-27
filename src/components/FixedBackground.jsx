import { createPortal } from "react-dom";

function FixedBackground() {
  return createPortal(
    <div
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #151515 0%, #050505 35%, #000000 50%, #050505 65%, #151515 100%)",
      }}
    >
      <div
        className="absolute top-25 left-20 w-[90%] h-130 rounded-full blur-3xl"
        style={{ background: "rgba(59,130,246,0.12)" }}
      />
    </div>,
    document.body
  );
}

export default FixedBackground;