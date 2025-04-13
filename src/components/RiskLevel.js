// components/RiskLevel.js
import { getSpenderType } from "../utils/spenderMapping";

/**
 * Determine the risk level of a given approval based on multiple criteria
 * @param {Object} props
 * @param {Object} props.approval - The approval object
 * @param {string} props.lastUsedDate - A date string from LastUsedDate component
 */
const RiskLevel = ({ approval, lastUsedDate }) => {
  if (!approval) return null;

  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  const parsedDate = lastUsedDate ? new Date(lastUsedDate) : null;
  const isOld = parsedDate && parsedDate < oneYearAgo;

  const isUnlimited =
    approval.valueAtRisk === "Unlimited" ||
    approval.valueAtRisk?.toLowerCase() === "unlimited";

  const spenderKnown = getSpenderType(approval.spender);

  const isNFT = approval.type === "ERC-721" || approval.type === "ERC-1155";

  const isWholeCollection = isNFT && !approval.tokenId;

  const value = parseFloat(approval.valueAtRisk?.toString().replace(/,/g, "")) || 0;

  // 🚨 High Risk Cases
  if (
    isOld ||
    !spenderKnown ||
    isUnlimited ||
    isWholeCollection ||
    (approval.type === "ERC-20" && value > 1000) ||
    (isNFT && approval.tokenIds && approval.tokenIds.length > 1)
  ) {
    return <span className="badge bg-danger" style={{ fontSize: "0.75rem", padding: "0.25em 0.5em" }}>HIGH RISK</span>;
  }

  // 🟡 Medium Risk Cases
  if (
    (approval.type === "ERC-20" && value > 500) ||
    (approval.type === "ERC-721")
  ) {
    return <span className="badge bg-warning text-dark" style={{ fontSize: "0.75rem", padding: "0.25em 0.5em" }}>MEDIUM RISK</span>;
  }

  // ✅ Low Risk
  return <span className="badge bg-success" style={{ fontSize: "0.75rem", padding: "0.25em 0.5em" }}>LOW RISK</span>;
};

export default RiskLevel;
