import React from 'react';

/**
 * RiskLevel Component - Updated to use only MEDIUM and HIGH risk categories
 */
const RiskLevel = ({ approval }) => {
  // Check if this is a medium risk approval (otherwise it's high risk)
  const isMediumRisk = () => {
    // MEDIUM RISK: ERC20 tokens with values under 500
    if (approval.type === 'ERC-20') {
      // Not unlimited and has a numeric value
      if (approval.valueAtRisk && 
          !approval.valueAtRisk.toLowerCase().includes('unlimited')) {
        const valueString = approval.valueAtRisk.replace(/[^0-9.]/g, '');
        const value = parseFloat(valueString);
        if (!isNaN(value) && value < 500.00) {
          return true;
        }
      }
    }
    
    // MEDIUM RISK: Any individual NFT (no collection at risk)
    if ((approval.type === 'ERC-721' || approval.type === 'ERC-1155') && 
        approval.tokenId && approval.tokenId !== 'all') {
      return true;
    }
    
    return false;
  };
  
  // Determine risk level - everything is either MEDIUM or HIGH
  let level, badgeClass;
  
  if (isMediumRisk()) {
    level = 'MEDIUM RISK';
    badgeClass = 'bg-warning';
  } else {
    // All other approvals are HIGH RISK
    level = 'HIGH RISK';
    badgeClass = 'bg-danger';
  }
  
  return (
    <span className={`badge ${badgeClass}`} style={{ fontSize: '0.75rem' }}>
      {level}
    </span>
  );
};

export default RiskLevel;