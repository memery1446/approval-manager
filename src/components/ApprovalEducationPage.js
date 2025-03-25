import React from 'react';

const ApprovalEducationPage = ({ onBack }) => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary fw-bold">
          <span className="me-2">📚</span> Understanding Crypto Approvals
        </h1>
        <button className="btn btn-primary" onClick={onBack}>
          Back to Dashboard
        </button>
      </div>

      {/* Essential Crypto Approval Reminders */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-light">
          <h5 className="mb-0">🔥 Essential Crypto Approval Reminders 🔥</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h6 className="text-primary">Understanding Permissions</h6>
              <ul>
                <li>Approvals remain active until revoked.</li>
                <li>Unlimited approvals grant full token access.</li>
              </ul>
              <h6 className="text-primary">Security Actions</h6>
              <ul>
                <li>Regularly audit and revoke unused approvals.</li>
                <li>Revoke permissions immediately after use.</li>
              </ul>
            </div>
            <div className="col-md-6">
              <h6 className="text-primary">Risk Factors</h6>
              <ul>
                <li>Approvals can be exploited long after being set.</li>
                <li>Many hacks use legitimate approvals, not direct compromises.</li>
              </ul>
              <h6 className="text-primary">Protection Tips</h6>
              <ul>
                <li>Review approvals quarterly.</li>
                <li>Only approve on trusted websites.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Approval Information */}
      <div className="card shadow-sm">
        <div className="card-header bg-light">
          <h4 className="mb-0">Detailed Approval Information</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h5 className="text-primary">What Are Approvals?</h5>
              <p>
                Approvals allow smart contracts to access and transfer tokens from your wallet. These permissions remain until revoked, even if you stop using the platform.
              </p>
              <h5 className="text-primary">Common Scenarios</h5>
              <ul>
                <li><strong>DEX Trading:</strong> Token approvals for swaps.</li>
                <li><strong>NFT Marketplaces:</strong> Permission to transfer NFTs.</li>
                <li><strong>DeFi Protocols:</strong> Access for lending and yield farming.</li>
                <li><strong>Gaming dApps:</strong> Token/NFT approvals for in-game assets.</li>
              </ul>
            </div>
            <div className="col-md-6">
              <h5 className="text-primary">Types of Approvals</h5>
              <ul>
                <li><strong>ERC-20:</strong> Fungible token approvals.</li>
                <li><strong>ERC-721:</strong> NFT-specific approvals.</li>
                <li><strong>ERC-1155:</strong> Multi-token approvals.</li>
              </ul>
              <h5 className="text-primary">Best Practices</h5>
              <ul>
                <li>Use specific approval amounts instead of unlimited.</li>
                <li>Regularly review and revoke approvals.</li>
                <li>Use a hardware wallet for extra security.</li>
                <li>Only approve transactions on trusted platforms.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Security Implications */}
      <div className="card shadow-sm mt-4">
        <div className="card-header bg-light">
          <h4 className="mb-0">Security Implications</h4>
        </div>
        <div className="card-body">
          <p>
            <strong>Unlimited approvals</strong> pose a security risk if the contract becomes malicious or compromised, allowing asset drains without additional confirmations.
          </p>
          <div className="alert alert-warning">
            <div className="d-flex align-items-center">
              <span className="me-2">⚠️</span>
              <strong>Most crypto hacks involve valid approvals rather than direct wallet compromises.</strong>
            </div>
          </div>
          <p>
            Regularly auditing and revoking unnecessary approvals reduces your risk exposure significantly.
          </p>
        </div>
      </div>

      <div className="text-center mt-4 mb-4">
        <button className="btn btn-lg btn-primary" onClick={onBack}>
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ApprovalEducationPage;
