import React from 'react';
import { getSpenderDisplayInfo } from '../utils/spenderMapping';

const SpenderDisplay = ({ address }) => {
  const { name, address: truncatedAddress } = getSpenderDisplayInfo(address);

  return (
    <div className="d-flex flex-column">
      <div className="fw-bold" style={{ fontSize: '0.9rem' }}> {/* Adjusted font size */}
        {name}
      </div>
      <div className="small text-muted" style={{ lineHeight: '1.2' }}>
        {truncatedAddress}
      </div>
    </div>
  );
};

export default getSpenderInfo;