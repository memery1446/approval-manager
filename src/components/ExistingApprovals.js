"use client"

import { useEffect, useState, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { getERC20Approvals } from "../utils/erc20Approvals"
import { getERC721Approvals } from "../utils/nftApprovals"
import { getERC1155Approvals } from "../utils/erc1155Approvals"
import { setApprovals } from "../store/web3Slice"
import { getProvider } from "../utils/providerService"
import { getSpenderType } from "../utils/spenderMapping" // Import the spender utility
import { CONTRACT_ADDRESSES } from "../abis" // Import contract addresses
import AssetDisplay from "../components/AssetDisplay" // Import our new component

const ExistingApprovals = () => {
  const dispatch = useDispatch()
  const account = useSelector((state) => state.web3.account)
  const network = useSelector((state) => state.web3.network)
  const currentApprovals = useSelector((state) => state.web3.approvals || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [debugLogs, setDebugLogs] = useState([])

  // Add debug logging function
  const addLog = (message) => {
    console.log(message) // Always log to console
    setDebugLogs((prev) => [...prev, `${new Date().toTimeString().slice(0, 8)}: ${message}`])
  }

  const fetchApprovals = useCallback(async () => {
    addLog("🟠 fetchApprovals() function started...")

    if (!account) {
      addLog("❌ No account detected, skipping approval fetch.")
      return
    }

    if (!network) {
      addLog("❌ No network detected, skipping approval fetch.")
      return
    }

    try {
      setLoading(true)
      setError(null)
      addLog(`📋 Fetching approvals for account: ${account} on network: ${network}`)

      // Check current Redux state first
      addLog(`Current approvals in Redux: ${currentApprovals.length}`)

      // Get provider
      let provider
      try {
        provider = await getProvider()
        if (!provider) {
          if (window.ethersProvider) {
            addLog("⚠️ Using global provider as fallback")
            provider = window.ethersProvider
          } else {
            throw new Error("No provider available")
          }
        }
        addLog(`✅ Provider initialized: ${provider ? "success" : "failed"}`)
      } catch (providerErr) {
        addLog(`❌ Provider initialization error: ${providerErr.message}`)
        throw providerErr
      }

      if (!provider) {
        addLog("❌ Provider still unavailable, approvals cannot be fetched.")
        throw new Error("Provider unavailable after multiple attempts")
      }

      addLog("✅ Provider ready, proceeding with approval fetching...")

      // Try to fetch real approvals
      let erc20Fetched = []
      try {
        addLog("⏳ Fetching ERC-20 approvals...")
        erc20Fetched = (await getERC20Approvals([], account, provider)) || []
        addLog(`🔍 ERC-20 Approvals found: ${erc20Fetched.length}`)
      } catch (erc20Error) {
        addLog(`❌ ERC-20 fetch error: ${erc20Error.message}`)
        console.error("ERC-20 fetch error:", erc20Error)
      }

      let erc721Fetched = []
      try {
        addLog("⏳ Fetching ERC-721 approvals...")
        erc721Fetched = (await getERC721Approvals(account, provider)) || []
        addLog(`🔍 ERC-721 Approvals found: ${erc721Fetched.length}`)
      } catch (erc721Error) {
        addLog(`❌ ERC-721 fetch error: ${erc721Error.message}`)
        console.error("ERC-721 fetch error:", erc721Error)
      }

      let erc1155Fetched = []
      try {
        addLog("⏳ Fetching ERC-1155 approvals...")
        erc1155Fetched = (await getERC1155Approvals(account, provider)) || []
        addLog(`🔍 ERC-1155 Approvals found: ${erc1155Fetched.length}`)
      } catch (erc1155Error) {
        addLog(`❌ ERC-1155 fetch error: ${erc1155Error.message}`)
        console.error("ERC-1155 fetch error:", erc1155Error)
      }

      const realApprovals = [...erc20Fetched, ...erc721Fetched, ...erc1155Fetched]

      // Always update Redux with the fetched approvals, even if empty
      addLog(`🟢 Collected ${realApprovals.length} approvals, dispatching to Redux...`)
      dispatch(setApprovals(realApprovals))
      addLog(`🔵 Dispatched ${realApprovals.length} approvals to Redux`)

      // Check if it worked by logging window.store
      if (window.store) {
        const storeState = window.store.getState()
        addLog(
          `📊 Redux store current state: ${
            storeState.web3.approvals ? `${storeState.web3.approvals.length} approvals` : "No approvals found"
          }`,
        )
      }
    } catch (err) {
      addLog(`❌ Error fetching approvals: ${err.message}`)
      console.error("Approval fetch error:", err)
      setError(err.message)
    } finally {
      // Make sure loading state is always set to false when done
      setLoading(false)
    }
  }, [account, network, dispatch, currentApprovals])

  // Effect to fetch approvals when account/network changes
  useEffect(() => {
    addLog("🔄 useEffect triggered for account/network change")
    if (account && network) {
      addLog(`✅ Account and network detected, calling fetchApprovals`)
      fetchApprovals()
    } else {
      addLog("⚠️ Account or network not available yet")
    }
  }, [account, network, fetchApprovals])

  // Attempt a fetch after a delay to ensure provider is ready
  useEffect(() => {
    const timer = setTimeout(() => {
      addLog("⏳ Delayed fetchApprovals execution...")
      fetchApprovals()
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // Add a way to add mock approvals in case real ones can't be fetched
  const addMockApprovals = () => {
    addLog("🧪 Adding mock approvals to Redux...")

    const mockApprovals = [
      {
        type: "ERC-20",
        contract: "0x6b175474e89094c44da98b954eedeac495271d0f",
        spender: "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
        asset: "DAI",
        valueAtRisk: "Unlimited",
      },
      {
        type: "ERC-721",
        contract: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
        spender: "0x00000000006c3852cbef3e08e8df289169ede581",
        asset: "BAYC",
        valueAtRisk: "All NFTs",
      },
      {
        type: "ERC-1155",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        spender: "0x207a32a58e1666f4109b361869b9456bf4761283",
        asset: "OpenSea Collection",
        valueAtRisk: "Multiple NFTs",
      },
      // Add new mock approvals for your demo spenders
      {
        type: "ERC-20",
        contract: CONTRACT_ADDRESSES.TK1,
        spender: CONTRACT_ADDRESSES.LendingSpender,
        asset: "Standard Token",
        valueAtRisk: "5,000 tokens",
      },
      {
        type: "ERC-721",
        contract: CONTRACT_ADDRESSES.TestNFT,
        spender: CONTRACT_ADDRESSES.NftMarketplaceSpender,
        asset: "Test NFT",
        valueAtRisk: "All NFTs",
      },
      {
        type: "ERC-20",
        contract: CONTRACT_ADDRESSES.PermitToken,
        spender: CONTRACT_ADDRESSES.DexSpender,
        asset: "Permit Token",
        valueAtRisk: "Unlimited",
      },
      {
        type: "ERC-1155",
        contract: CONTRACT_ADDRESSES.TestERC1155,
        spender: CONTRACT_ADDRESSES.BridgeSpender,
        asset: "Multi-Token",
        valueAtRisk: "Multiple Tokens",
      },
      {
        type: "ERC-20",
        contract: CONTRACT_ADDRESSES.FeeToken,
        spender: CONTRACT_ADDRESSES.MockSpender,
        asset: "Fee Token",
        valueAtRisk: "200 tokens",
      },
    ]

    dispatch(setApprovals(mockApprovals))
    addLog(`✅ Added ${mockApprovals.length} mock approvals to Redux`)
  }

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-light d-flex justify-content-between align-items-center">
        <h3 className="mb-0">Existing Approvals</h3>
        <div className="d-flex gap-2">
          <button className="btn btn-secondary" onClick={fetchApprovals} disabled={loading}>
            {loading ? "Loading..." : "🔄 Refresh Approvals"}
          </button>
          <button className="btn btn-info" onClick={addMockApprovals}>
            🧪 Add Mock Data
          </button>
        </div>
      </div>
      <div className="card-body">
        {loading ? (
          <p>Loading approvals...</p>
        ) : error ? (
          <div className="alert alert-danger">
            <p className="mb-0">Error: {error}</p>
            <button className="btn btn-sm btn-outline-danger mt-2" onClick={fetchApprovals}>
              Retry
            </button>
          </div>
        ) : (
          <div>
            <p className="text-info">
              Wallet:{" "}
              {account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : "Not connected"}
              {network && <span className="ms-2">Network: {network}</span>}
            </p>
            <div className="d-flex justify-content-between align-items-center">
              <p className="mb-0">
                {currentApprovals.length > 0
                  ? `Found ${currentApprovals.length} approvals in Redux store`
                  : "No approvals found. Click 'Add Mock Data' to add test approvals."}
              </p>
            </div>

            {/* Show a preview of the approvals */}
            {currentApprovals.length > 0 && (
              <div className="mt-3">
                <h5>Approval Preview:</h5>
                <div className="table-responsive">
                  <table className="table table-sm table-bordered">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Asset</th>
                        <th>Spender</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentApprovals.slice(0, 3).map((approval, index) => (
                        <tr key={index}>
                          <td>
                            <span
                              className={`badge bg-${approval.type === "ERC-20" ? "success" : approval.type === "ERC-721" ? "primary" : "warning"}`}
                            >
                              {approval.type}
                            </span>
                          </td>
                          <td>
                            {/* Updated to use the new AssetDisplay component */}
                            <AssetDisplay approval={approval} compact={true} logoSize="small" />
                          </td>
                          <td>
                            <div>
                              {/* Display spender type if available */}
                              {getSpenderType(approval.spender) && (
                                <div className="small fw-bold mb-1">
                                  <span className="badge bg-info text-dark">{getSpenderType(approval.spender)}</span>
                                </div>
                              )}
                              {/* Display truncated address */}
                              <span title={approval.spender}>
                                {approval.spender.substring(0, 6)}...
                                {approval.spender.substring(approval.spender.length - 4)}
                              </span>
                            </div>
                          </td>
                          <td>
                            {approval.valueAtRisk
                              ? approval.type === "ERC-20" && approval.valueAtRisk.toLowerCase() !== "unlimited"
                                ? `${approval.valueAtRisk} / Unlimited`
                                : approval.valueAtRisk
                              : "Unknown"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {currentApprovals.length > 3 && (
                  <p className="text-muted small">...and {currentApprovals.length - 3} more approvals</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Debug logs section */}
        <details className="mt-3">
          <summary className="text-muted cursor-pointer">Debug Logs</summary>
          <div
            className="mt-2 bg-dark text-light p-2"
            style={{ fontSize: "0.8rem", maxHeight: "200px", overflowY: "auto" }}
          >
            {debugLogs.length === 0 ? (
              <p className="text-muted">No logs yet</p>
            ) : (
              debugLogs.map((log, idx) => <div key={idx}>{log}</div>)
            )}
          </div>
          <div className="mt-2">
            <button
              className="btn btn-sm btn-info me-2"
              onClick={() => console.log("Current Redux State:", window.store?.getState())}
            >
              Log Redux State
            </button>
            <button className="btn btn-sm btn-warning" onClick={() => setDebugLogs([])}>
              Clear Logs
            </button>
          </div>
        </details>
      </div>
    </div>
  )
}

export default ExistingApprovals
