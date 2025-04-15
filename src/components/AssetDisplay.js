import TokenLogo from './TokenLogo';
import { getAssetDisplayInfo } from '../utils/tokenMapping';
import { getSpenderDisplayInfo } from '../utils/spenderMapping';
/**
 * Component to display asset information with logo
 * 
 * @param {Object} props
 * @param {Object} props.approval - The approval object containing contract and type info
 * @param {boolean} props.compact - Whether to display in compact mode
 * @param {string} props.logoSize - Size of the logo (tiny, small, medium, large)
 */
const AssetDisplay = ({ approval, compact = false, logoSize = 'medium' }) => {
  // Get enhanced asset information
  const assetInfo = getAssetDisplayInfo(approval);
  const spenderAddress = "0x7a250d5630b4cf539739df2c5dacb4c659f2488d"; // Example address
const spenderInfo = getSpenderDisplayInfo(spenderAddress);

  // Compact mode for tables
  if (compact) {
    return (
      <div className="d-flex align-items-center">
        <TokenLogo 
          address={approval.contract} 
          type={approval.type} 
          size={logoSize}
          className="me-3" // Increased spacing for better alignment
        />
        <span className="fw-bold text-truncate" style={{ maxWidth: '150px' }}> {/* Truncate long names */}
          {assetInfo.name}
        </span>
      </div>
    );
  }
  
  // Full display mode
// Full display mode
return (
  <div className="d-flex align-items-center">
    <TokenLogo 
      address={approval.contract} 
      type={approval.type} 
      size={logoSize}
      className="me-3"
    />
    <div>
      <div className="fw-bold mb-1" style={{ fontSize: '1.1rem' }}>
        {assetInfo.name}
      </div>
      <div className="small text-muted" style={{ lineHeight: '1.2' }}>
        {approval.contract?.slice(0, 6)}...{approval.contract?.slice(-4)}
      </div>
    </div>
  </div>
);

};

export default AssetDisplay;