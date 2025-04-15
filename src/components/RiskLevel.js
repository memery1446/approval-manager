import React from 'react';
import EduAlerts from './EduAlerts';

const RiskLevel = ({ approval, setHoveredRiskMessage }) => {
  const isDaiApproval = approval.asset === "DAI" || approval.asset === "Dai";
  const hasOldDate =
    approval.lastUsed === "01/04/2022 14:30" ||
    (approval.lastUsed && approval.lastUsed.includes("2022")) ||
    (approval.lastUsed && approval.lastUsed.includes("2023"));

  let isMediumRisk = false;
  let reason = EduAlerts.DEFAULT_HIGH;

  if (isDaiApproval) {
    reason = EduAlerts.HIGH_RISK_DAI;
  } else if (hasOldDate) {
    reason = EduAlerts.HIGH_RISK_OLD_DATE;
  } else {
    if (approval.type === 'ERC-20' && approval.valueAtRisk) {
      if (!approval.valueAtRisk.toLowerCase().includes('unlimited')) {
        const valueString = approval.valueAtRisk.replace(/[^0-9.]/g, '');
        const value = parseFloat(valueString);
        if (!isNaN(value) && value < 500.00) {
          isMediumRisk = true;
          reason = EduAlerts.MEDIUM_RISK_LOW_AMOUNT;
        }
      }
    }

    if ((approval.type === 'ERC-721' || approval.type === 'ERC-1155') &&
        approval.tokenId && approval.tokenId !== 'all') {
      isMediumRisk = true;
      reason = EduAlerts.MEDIUM_RISK_SINGLE_NFT;
    }
  }

  const badgeClass = isDaiApproval || hasOldDate || !isMediumRisk ? "badge bg-danger" : "badge bg-warning";
  const badgeText = isDaiApproval || hasOldDate || !isMediumRisk ? "HIGH RISK" : "MEDIUM RISK";

  return (
    <span
      className={badgeClass}
      style={{ fontSize: '0.75rem', cursor: 'default' }}
      onMouseEnter={() => setHoveredRiskMessage?.(reason)}
      onMouseLeave={() => setHoveredRiskMessage?.(null)}
    >
      {badgeText}
    </span>
  );
};

export default RiskLevel;
