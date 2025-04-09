// components/TokenLogo.js
import { useState, useEffect } from 'react';
import { getLogoUrl } from '../utils/tokenMapping';

/**
 * Component to display token logo with fallback handling
 * 
 * @param {Object} props
 * @param {string} props.address - Token contract address
 * @param {string} props.type - Token type (ERC-20, ERC-721, ERC-1155)
 * @param {string} props.size - Size of the logo (small, medium, large)
 * @param {string} props.className - Additional CSS classes
 */
const TokenLogo = ({ address, type, size = 'medium', className = '' }) => {
  const [imgSrc, setImgSrc] = useState('');
  const [hasError, setHasError] = useState(false);
  
  // Determine size in pixels
  const getSizeInPx = () => {
    switch(size) {
      case 'tiny': return 16;
      case 'small': return 24;
      case 'medium': return 32;
      case 'large': return 48;
      default: return 32;
    }
  };

  useEffect(() => {
    // Reset error state when address changes
    setHasError(false);
    // Get the logo URL from our mapping utility
    setImgSrc(getLogoUrl(address, type));
  }, [address, type]);

  // Handle image loading error
  const handleError = () => {
    setHasError(true);
    // Set to default logo based on token type
    if (type === 'ERC-20') {
      setImgSrc('https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029');
    } else {
      setImgSrc('https://openseauserdata.com/files/8a9f039c36782cd0a9feb245b0073596.png');
    }
  };

  // If we have an error and we're already using the fallback image
  // just show a colored circle with first letter of the address
  if (hasError) {
    const firstChar = address ? address.charAt(2).toUpperCase() : 'T'; // Skip 0x prefix
    const sizeInPx = getSizeInPx();
    
    const colors = [
      '#FF6B6B', '#4ECDC4', '#F9DC5C', '#3D84A8', '#E84A5F',
      '#2A363B', '#99B898', '#FECEA8', '#FF847C', '#E84A5F'
    ];
    
    // Use a hash of the address to pick a consistent color
    const colorIndex = address ? 
      [...address].reduce((sum, char) => sum + char.charCodeAt(0), 0) % colors.length :
      0;
      
    return (
      <div 
        className={`token-logo-fallback d-inline-flex justify-content-center align-items-center rounded-circle ${className}`}
        style={{
          width: `${sizeInPx}px`,
          height: `${sizeInPx}px`,
          backgroundColor: colors[colorIndex],
          color: 'white',
          fontSize: `${sizeInPx * 0.5}px`,
          fontWeight: 'bold'
        }}
      >
        {firstChar}
      </div>
    );
  }

  // Render the logo image
  return (
    <img
      src={imgSrc}
      alt="Token Logo"
      className={`token-logo ${className}`}
      style={{
        width: `${getSizeInPx()}px`,
        height: `${getSizeInPx()}px`,
        objectFit: 'contain'
      }}
      onError={handleError}
    />
  );
};

export default TokenLogo;

