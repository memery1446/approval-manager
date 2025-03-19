import React from "react";

const TransactionHashComponent = ({ transactionHash }) => {
  if (!transactionHash || transactionHash === "N/A") {
    return <span className="badge bg-secondary">Local TX</span>;
  }

  return (
    <a
      href={`https://etherscan.io/tx/${transactionHash}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {transactionHash.substring(0, 8)}...
    </a>
  );
};

export default TransactionHashComponent;

