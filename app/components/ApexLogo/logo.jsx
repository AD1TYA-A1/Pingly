export default function ApexSteelText({ width = "100%" }) {
  return (
    <svg
      width={width}
      viewBox="0 0 680 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="APEX"
    >
      <defs>
        <linearGradient id="steel" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#f0f0f0" />
          <stop offset="12%"  stopColor="#c8cdd4" />
          <stop offset="28%"  stopColor="#ffffff" />
          <stop offset="42%"  stopColor="#9aa0ab" />
          <stop offset="55%"  stopColor="#d8dde4" />
          <stop offset="68%"  stopColor="#6e7680" />
          <stop offset="80%"  stopColor="#c0c6ce" />
          <stop offset="90%"  stopColor="#f4f5f6" />
          <stop offset="100%" stopColor="#7a8290" />
        </linearGradient>
        <linearGradient id="steelEdge" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="50%"  stopColor="#404550" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#101214" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="bevel" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Base steel fill */}
      <text x="340" y="158" textAnchor="middle"
        fontFamily="'Arial Black', Impact, 'Franklin Gothic Heavy', sans-serif"
        fontSize="148" fontWeight="900" letterSpacing="8"
        fill="url(#steel)"
        stroke="url(#steelEdge)" strokeWidth="1.2"
        paintOrder="stroke fill"
      >APEX</text>

      {/* Bevel highlight overlay */}
      <text x="340" y="158" textAnchor="middle"
        fontFamily="'Arial Black', Impact, 'Franklin Gothic Heavy', sans-serif"
        fontSize="148" fontWeight="900" letterSpacing="8"
        fill="url(#bevel)" opacity="0.55"
      >APEX</text>

      {/* Edge shimmer */}
      <text x="340" y="158" textAnchor="middle"
        fontFamily="'Arial Black', Impact, 'Franklin Gothic Heavy', sans-serif"
        fontSize="148" fontWeight="900" letterSpacing="8"
        fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.3"
      >APEX</text>
    </svg>
  );
}