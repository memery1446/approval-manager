// components/EduAlerts.js

const EduAlerts = {
  HIGH_RISK_OLD_DATE: "Approval is from 2022 or 2023 — high risk due to inactivity.",
  HIGH_RISK_DAI: "DAI approvals are always high risk due to known scam patterns.",
  MEDIUM_RISK_LOW_AMOUNT: "ERC-20 approval is below 500 tokens — moderate risk.",
  MEDIUM_RISK_SINGLE_NFT: "Approval is for a single NFT, not full collection.",
  DEFAULT_HIGH: "This approval exposes a high-risk pattern.",
  DEFAULT_MEDIUM: "This approval exposes a medium-risk pattern.",
};

export default EduAlerts;
