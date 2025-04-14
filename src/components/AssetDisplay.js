import TokenLogo from './TokenLogo';
import { getAssetDisplayInfo } from '../utils/tokenMapping';

/**
 * Component to display asset information with logo
 * 
 * @param {Object} props
 * @param {Object} props.approval - The approval object containing contract and type info
 * @param {boolean} props.compact - Whether to display in compact mode
 * @param {string} props.logoSize - Size of the logo (tiny, small, medium, large)
 */
const AssetDisplay = ({ approval, compact = false, logoSize = 'small' }) => {
  // Get enhanced asset information
  const assetInfo = getAssetDisplayInfo(approval);
  
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
  return (
    <div className="d-flex align-items-center">
      <TokenLogo 
        address={approval.contract} 
        type={approval.type} 
        size={logoSize}
        className="me-3" // Increased spacing for better alignment
      />
      <div>
        <div className="fw-bold mb-1" style={{ fontSize: '1.1rem' }}> {/* Slightly larger font for title */}
          {assetInfo.name}
        </div>
        <div className="small text-muted" style={{ lineHeight: '1.2' }}> {/* Improved line height for description */}
          {assetInfo.description}
        </div>
      </div>
    </div>
  );
};

export default AssetDisplay;