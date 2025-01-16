import React from 'react';

const Logo = ({ w = 200, h = 200 }) => {
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Circle */}
      <circle
        cx="100"
        cy="100"
        r="95"
        fill="#f8e9c8"
        stroke="#d4a373"
        strokeWidth="5"
      />

      {/* Main Container */}
      <rect
        x="65"
        y="60"
        width="70"
        height="90"
        rx="10"
        fill="#d4a373"
      />

      {/* Top Header */}
      <rect
        x="60"
        y="50"
        width="80"
        height="20"
        rx="5"
        fill="#b85c38"
      />

      {/* Diamond Shape */}
      <path
        d="M100 120 L90 100 L100 80 L110 100 Z"
        fill="#f4d35e"
        stroke="#d4a373"
        strokeWidth="2"
      />

      {/* Lines Inside the Diamond */}
      <line x1="100" y1="80" x2="100" y2="140" stroke="#d4a373" strokeWidth="2" />
      <line x1="95" y1="90" x2="100" y2="100" stroke="#d4a373" strokeWidth="2" />
      <line x1="105" y1="90" x2="100" y2="100" stroke="#d4a373" strokeWidth="2" />

      {/* Logo Text */}
      <text
        x="100"
        y="175"
        textAnchor="middle"
        fontFamily="'Poppins', sans-serif"
        fontSize="20"
        fill="#6d4c41"
      >
        Mouneh
      </text>
    </svg>
  );
};

export default Logo;