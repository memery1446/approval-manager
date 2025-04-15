// components/FloatingRiskBanner.js
import React from "react";
import "../styles/tooltip.css";

const FloatingRiskBanner = ({ message }) => {
  if (!message) return null;

  return (
    <div className="floating-risk-banner">
      {message}
    </div>
  );
};

export default FloatingRiskBanner;
