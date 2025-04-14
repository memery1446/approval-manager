import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAccount } from "../store/web3Slice";
import { connectWallet } from "../utils/providerService";

// Force direct console access - bypass any potential overwrites
const safeConsoleLog = window.console.log.bind(window.console);

const WalletConnect = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state.web3?.account);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Log when component renders (safely)
  useEffect(() => {
    safeConsoleLog("🔵 WalletConnect component mounted");
    
    // Remove existing debug elements 
    try {
      const existingDebug = document.getElementById('wallet-debug');
      if (existingDebug && document.body.contains(existingDebug)) {
        document.body.removeChild(existingDebug);
      }
      
      // Clean up global reference 
      if (window._updateDebug) {
        window._updateDebug = null;
        delete window._updateDebug;
      }
    } catch (err) {
      // Handle any cleanup errors
    }
    
    return () => {
      safeConsoleLog("🔵 WalletConnect component unmounted");
    };
  }, []);

  const handleConnect = async () => {
    try {
      safeConsoleLog("🔌 Connect button clicked");
      
      setConnecting(true);
      setError(null);
      
      // Use the connectWallet function from providerService
      const success = await connectWallet();
      
      safeConsoleLog(`Wallet connection ${success ? "successful" : "failed"}`);
      
      if (!success) {
        setError("Failed to connect wallet");
        safeConsoleLog("❌ Wallet connection failed");
      }
    } catch (err) {
      safeConsoleLog("❌ Wallet connection error:", err);
      setError(err.message || "Connection failed");
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = () => {
    try {
      safeConsoleLog("Disconnecting wallet");
      dispatch(setAccount(null));
    } catch (err) {
      safeConsoleLog("Disconnect error:", err);
    }
  };

  // Log when account changes
  useEffect(() => {
    try {
      safeConsoleLog("👛 Account state updated:", account || "not connected");
    } catch (err) {
      safeConsoleLog("Account update error:", err);
    }
  }, [account]);

  return (
<div className="card my-1">
  <div className="card-body p-2"> {/* Reduced padding */}
    <h5 className="card-title mb-2" style={{ color: "#ffffff" }}>Wallet Connection</h5> {/* Explicit white text */}

    {error && (
      <div className="alert alert-danger mb-2" role="alert"> {/* Reduced margin-bottom */}
        {error}
      </div>
    )}

    {!account ? (
      <button 
        className="btn btn-primary w-100 mb-2" // Reduced margin-bottom
        onClick={handleConnect}
        disabled={connecting}
      >
        {connecting ? "Connecting..." : "Connect Wallet"}
      </button>
    ) : (
      <div
        style={{
          backgroundColor: "var(--input-bg)",
          padding: "0.5rem", // Reduced padding
          borderRadius: "0.5rem",
          marginBottom: "0.5rem", // Reduced margin-bottom
        }}
      >
        <div className="d-flex justify-content-between" style={{ color: "#ffffff", fontSize: "0.9rem" }}>
          <span>Connected:</span>
          <span>{account.substring(0, 6)}...{account.substring(account.length - 4)}</span>
        </div>
        <button 
          className="btn btn-outline-secondary w-100 mt-1" // Reduced margin-top
          onClick={handleDisconnect}
        >
          Disconnect
        </button>
      </div>
    )}

    <div className="mt-2" style={{ color: "#ffffff", fontSize: "0.875rem" }}> {/* Explicit white text */}
      <p>Status: {connecting ? "Connecting..." : account ? "Connected" : "Not connected"}</p>
    </div>
  </div>
</div>
  );
};

export default WalletConnect;