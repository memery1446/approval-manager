import React from 'react';

const ApprovalEducationPage = ({ onBack }) => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary fw-bold">
          <span className="me-2">📚</span> Understanding Crypto Approvals
        </h1>
        <button 
          className="btn btn-primary" 
          onClick={onBack}
        >
          Back to Dashboard
        </button>
      </div>
      
      {/* Educational content (previously in ApprovalEducation.js) */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0">🔥 Essential Crypto Approval Reminders 🔥</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <p className="fw-bold text-primary mb-1">Understanding Permissions</p>
              <ul className="small mb-3">
                <li>Approvals remain active until explicitly revoked</li>
                <li>Unlimited approvals grant complete access to specific tokens</li>
              </ul>
              
              <p className="fw-bold text-primary mb-1">Security Actions</p>
              <ul className="small mb-3">
                <li>Regularly audit and revoke unused approvals</li>
                <li>Revoke permissions immediately after use</li>
              </ul>
            </div>
            
            <div className="col-md-6">
              <p className="fw-bold text-primary mb-1">Risk Factors</p>
              <ul className="small mb-3">
                <li>Active approvals can be exploited months/years later</li>
                <li>Most hacks use legitimate approvals, not direct compromise</li>
              </ul>
              
              <p className="fw-bold text-primary mb-1">Protection Tips</p>
              <ul className="small mb-0">
                <li>Review approvals quarterly</li>
                <li>Only approve on official websites</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional detailed information */}
      <div className="card shadow-sm mt-4">
        <div className="card-header bg-light">
          <h4 className="mb-0">Detailed Approval Information</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h5 className="text-primary">What Are Approvals?</h5>
              <p>
                Approvals are permissions you give to smart contracts or addresses to access and transfer tokens from your wallet. 
                These permissions remain active until explicitly revoked, even if you haven't interacted with the platform for months or years.
              </p>
              
              <h5 className="text-primary">Common Scenarios</h5>
              <ul>
                <li><strong>DEX Trading:</strong> Approving tokens for swapping on decentralized exchanges</li>
                <li><strong>NFT Marketplaces:</strong> Granting permission to transfer your NFTs when sold</li>
                <li><strong>DeFi Protocols:</strong> Allowing lending platforms or yield farms to access your tokens</li>
                <li><strong>Gaming dApps:</strong> Enabling games to utilize your tokens or NFTs</li>
              </ul>
            </div>
            
            <div className="col-md-6">
              <h5 className="text-primary">Types of Approvals</h5>
              <ul>
                <li><strong>ERC-20 Approvals:</strong> Permissions for fungible tokens like ETH, DAI, or LINK</li>
                <li><strong>ERC-721 Approvals:</strong> Permissions for non-fungible tokens (NFTs)</li>
                <li><strong>ERC-1155 Approvals:</strong> Permissions for multi-token standards that can represent both fungible and non-fungible tokens</li>
              </ul>
              
              <h5 className="text-primary">Best Practices</h5>
              <ul>
                <li>Use specific approval amounts instead of unlimited when possible</li>
                <li>Regularly review and revoke unused approvals</li>
                <li>Consider using a hardware wallet for additional security</li>
                <li>Be cautious when approving new or unaudited protocols</li>
                <li>Revoke permissions immediately after completing your intended transaction</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card shadow-sm mt-4">
        <div className="card-header bg-light">
          <h4 className="mb-0">Security Implications</h4>
        </div>
        <div className="card-body">
          <p>
            <strong>Unlimited approvals</strong> can pose significant security risks if the approved contract or address becomes compromised or malicious. 
            A compromised contract with approval to your tokens can drain your wallet without requiring additional confirmations.
          </p>
          
          <div className="alert alert-warning">
            <div className="d-flex align-items-center">
              <span className="me-2">⚠️</span>
              <strong>Most crypto hacks involve legitimate approvals rather than direct wallet compromises.</strong>
            </div>
          </div>
          
          <p>
            Regularly auditing and revoking unnecessary approvals is a simple yet effective security practice that can 
            significantly reduce your risk exposure in the crypto ecosystem.
          </p>
        </div>
      </div>
      
      <div className="text-center mt-4 mb-4">
        <button 
          className="btn btn-lg btn-primary" 
          onClick={onBack}
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ApprovalEducationPage;

