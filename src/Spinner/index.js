import React from "react";

const Spinner = () => {
  return (
    <span>
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="spinner"
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#0073e6"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="150 100"
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </span>
  );
};

export default Spinner;