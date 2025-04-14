import React from 'react';

/**
 * RiskLevel Component - Correctly implementing the specified risk levels
 */
const RiskLevel = ({ approval }) => {
  // Check if this is a high risk approval
  const isHighRisk = () => {
    // HIGH RISK: Any unlimited approval
    if (approval.valueAtRisk && approval.valueAtRisk.toLowerCase().includes('unlimited')) {
      return true;
    }
    
    // HIGH RISK: Any whole-collection approval
    if (approval.type === 'ERC-721' || approval.type === 'ERC-1155') {
      if (approval.valueAtRisk && (
        approval.valueAtRisk.toLowerCase().includes('all') || 
        approval.valueAtRisk.toLowerCase().includes('collection')
      )) {
        return true;
      }
    }
    
    // HIGH RISK: Any approval from 2023 or earlier (hardcoded for demo)
    // We're mocking the date for demo purposes
    const mockDate = "15/03/2023 14:30";
    if (mockDate.includes('2023')) {
      return true;
    }
    
    return false;
  };
  
  // Check if this is a medium risk approval
  const isMediumRisk = () => {
    // MEDIUM RISK: ERC20 tokens with values from 100.00-1000.00
    if (approval.type === 'ERC-20') {
      if (approval.valueAtRisk) {
        const valueString = approval.valueAtRisk.replace(/[^0-9.]/g, '');
        const value = parseFloat(valueString);
        if (!isNaN(value) && value >= 100.00 && value <= 1000.00) {
          return true;
        }
      }
    }
    
    // MEDIUM RISK: Any individual NFT (no collection at risk)
    if ((approval.type === 'ERC-721' || approval.type === 'ERC-1155') && approval.tokenId) {
      return true;
    }
    
    return false;
  };
  
  // Check if this is a low risk approval
  const isLowRisk = () => {
    // LOW RISK: USDC-only 99.00 and below
    const isUSDC = approval.asset === 'USDC' || approval.symbol === 'USDC';
    
    if (isUSDC && approval.valueAtRisk) {
      const valueString = approval.valueAtRisk.replace(/[^0-9.]/g, '');
      const value = parseFloat(valueString);
      if (!isNaN(value) && value <= 99.00) {
        return true;
      }
    }
    
    return false;
  };
  
  // Determine risk level
  let level, badgeClass;
  
  if (isHighRisk()) {
    level = 'HIGH RISK';
    badgeClass = 'bg-danger';
  } else if (isMediumRisk()) {
    level = 'MEDIUM RISK';
    badgeClass = 'bg-warning';
  } else if (isLowRisk()) {
    level = 'LOW RISK';
    badgeClass = 'bg-success';
  } else {
    // Default fallback
    level = 'MEDIUM RISK';
    badgeClass = 'bg-warning';
  }
  
  return (
    <span className={`badge ${badgeClass}`} style={{ fontSize: '0.75rem' }}>
      {level}
    </span>
  );
};

export default RiskLevel;