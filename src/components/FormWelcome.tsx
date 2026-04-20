interface FormWelcomeProps { onStart: () => void; }

export function FormWelcome({ onStart }: FormWelcomeProps) {
  return (
    <div className="form-grid-bg form-grid-bg--scroll flex flex-col items-center justify-center px-4 py-12 sm:py-16 relative">

      {/* Bottom-left glow */}
      <div className="absolute bottom-0 left-0 w-80 h-80 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,0,0,0.10) 0%, transparent 70%)" }} />

      <div className="form-welcome relative z-10 text-center w-full max-w-md mx-auto">

        {/* Logo */}
        <div className="form-logo mb-8 flex justify-center">
          <img src="/logo.png" alt="Delta Institutions"
            className="h-16 sm:h-20 w-auto object-contain drop-shadow-xl" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-black/10 border border-black/20
                        text-black text-[10px] font-extrabold uppercase tracking-[3px]
                        px-4 py-1.5 rounded-full mb-5 form-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse shrink-0" />
          Dubai · UAE · KHDA Approved
        </div>
        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase leading-[1.05] tracking-tight text-black mb-3">
          Enroll at{" "}
          <span style={{ color: "#0d0d0d" }}>Delta</span>
          <br />Digital Academy
        </h1>
        <p className="text-black/60 text-sm sm:text-base mb-8 leading-relaxed">
          UAE's leading digital academy — complete the form to begin your journey.
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-8 sm:gap-12 mb-9 form-fade-in">
          {[["7K+", "Members"], ["8+", "Years"], ["20+", "Trainers"]].map(([n, l]) => (
            <div key={l} className="text-center">
              <div className="text-2xl sm:text-3xl font-black leading-none text-black">{n}</div>
              <div className="text-[9px] text-black/50 uppercase tracking-[2px] mt-1 font-bold">{l}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={onStart}
            className="px-12 sm:px-16 py-4 sm:py-5 text-base sm:text-lg font-black uppercase
                       tracking-widest rounded-full shadow-2xl transition-all duration-300
                       hover:-translate-y-1 border-0"
            style={{ background: "#0d0d0d", color: "#c8f000", fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: "0 8px 32px rgba(0,0,0,0.20)" }}
          >
            Start Enrollment →
          </button>
          <div className="flex items-center gap-2 text-xs text-black/40 form-fade-in">
            press <kbd className="px-2 py-1 bg-black/10 border border-black/20 rounded text-[10px] font-mono">Enter ↵</kbd> to begin
          </div>
        </div>

        {/* Info strip */}
        <div className="mt-9 flex flex-wrap justify-center gap-5 text-xs text-black/40 form-fade-in">
          {[
            ["⏱", "~3 minutes"],
            ["📋", "18 questions"],
            ["🔒", "Secure & private"],
          ].map(([icon, label]) => (
            <span key={label} className="flex items-center gap-1.5">{icon} {label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
