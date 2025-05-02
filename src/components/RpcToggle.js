import React, { useState, useEffect } from "react";

const RpcToggle = () => {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("rpcMode") || "remote";
  });

  const handleChange = (e) => {
    const newMode = e.target.value;
    localStorage.setItem("rpcMode", newMode);
    window.location.reload();
  };

  return (
    <div className="card my-3">
      <div className="card-body p-2">
        <h6 className="mb-2">RPC Mode Toggle</h6>
        <select className="form-select" value={mode} onChange={handleChange}>
          <option value="local">🖥 Local (Hardhat)</option>
          <option value="remote">☁️ Remote (Infura)</option>
        </select>
        <small className="text-muted d-block mt-2">
          Switches between your local Hardhat fork and Infura Mainnet.
        </small>
      </div>
    </div>
  );
};

export default RpcToggle;

