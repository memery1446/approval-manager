"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { getERC20Approvals } from "../utils/erc20Approvals"
import { getERC721Approvals } from "../utils/nftApprovals"
import { getERC1155Approvals, revokeMultipleERC1155Approvals } from "../utils/erc1155Approvals"
import { setApprovals } from "../store/web3Slice"
import { getProvider } from "../utils/providerService"
import { revokeERC20Approvals, revokeERC721Approvals } from "../utils/batchRevokeUtils"
import TransactionProgressBar from "../components/TransactionProgressBar"
import TransactionHashComponent from "../components/TransactionHashComponent"
import { getSpenderType } from "../utils/spenderMapping" // Import the spender utility
import AssetDisplay from "../components/AssetDisplay" // Import the new component
import RiskLevel from "../components/RiskLevel" // Import the RiskLevel component
import SpenderDisplay from "../utils/getSpenderInfo" 

const ApprovalDashboard = ({ onNavigateToEducation }) => {
  const dispatch = useDispatch()
  const wallet = useSelector((state) => state.web3?.account)
  // Guarantee approvals is always an array and log its value
  const approvals = useSelector((state) => {
    const approvalsFromState = state.web3?.approvals
    console.log("🔍 Reading approvals from Redux:", approvalsFromState)
    return Array.isArray(approvalsFromState) ? approvalsFromState : []
  })
  const [selectedApprovals, setSelectedApprovals] = useState([])
  const [processing, setProcessing] = useState(false)
  const [progressValue, setProgressValue] = useState(0)
  const [progressStatus, setProgressStatus] = useState("")
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  // Refresh approvals on wallet connection
  useEffect(() => {
    if (wallet) {
      refreshApprovals()
    }
  }, [wallet])

  // Allow selection of individual approvals
  const handleSelect = (approval) => {
    console.log("🔘 Selecting approval:", approval)
    setSelectedApprovals((prev) => {
      const exists = prev.some(
        (a) =>
          a.contract === approval.contract &&
          a.spender === approval.spender &&
          (a.tokenId ? a.tokenId === approval.tokenId : true),
      )
      return exists
        ? prev.filter(
            (a) =>
              !(
                a.contract === approval.contract &&
                a.spender === approval.spender &&
                (a.tokenId ? a.tokenId === approval.tokenId : true)
              ),
          )
        : [...prev, approval]
    })
  }

  // Handle select all approvals
  const handleSelectAll = (isChecked) => {
    if (!Array.isArray(approvals)) {
      console.error("Approvals is not an array:", approvals)
      return
    }

    if (isChecked) {
      setSelectedApprovals([...approvals]) // Select all approvals
    } else {
      setSelectedApprovals([]) // Deselect all
    }
  }

  // Handle single approval revokes
  const handleSingleRevoke = (approval) => {
    console.log("🔴 Revoking single approval:", approval)
    // Set the selected approval and then call the main revoke function
    setSelectedApprovals([approval])
    // We need to use setTimeout because setState is asynchronous
    setTimeout(() => handleRevoke(), 0)
  }

  // Refresh approvals with better error handling
  const refreshApprovals = async () => {
    console.log("🔄 Refreshing approvals for wallet:", wallet)
    setRefreshing(true)
    setError(null)

    try {
      const provider = await getProvider()
      if (!provider) {
        throw new Error("Failed to get provider")
      }

      console.log("🔄 Fetching ERC-20 approvals...")
      let erc20Approvals = []
      try {
        // First try with empty array as first parameter
        erc20Approvals = (await getERC20Approvals([], wallet, provider)) || []
        console.log("✅ ERC-20 approvals fetched:", erc20Approvals)
      } catch (erc20Error) {
        console.error("❌ Error fetching ERC-20 approvals with [] first param:", erc20Error)

        try {
          // Try with null as first parameter as fallback
          console.log("🔄 Attempting fallback with null first param")
          erc20Approvals = (await getERC20Approvals(null, wallet, provider)) || []
          console.log("✅ ERC-20 approvals fetched with fallback:", erc20Approvals)
        } catch (nullError) {
          console.error("❌ Fallback also failed:", nullError)

          // Final attempt with just wallet and provider
          try {
            console.log("🔄 Final attempt with just wallet and provider")
            erc20Approvals = (await getERC20Approvals(wallet, provider)) || []
            console.log("✅ ERC-20 approvals fetched with final attempt:", erc20Approvals)
          } catch (finalError) {
            console.error("❌ All ERC-20 fetch attempts failed:", finalError)
          }
        }
      }

      console.log("🔄 Fetching ERC-721 approvals...")
      const erc721Approvals = (await getERC721Approvals(wallet, provider)) || []
      console.log("✅ ERC-721 approvals fetched:", erc721Approvals)

      console.log("🔄 Fetching ERC-1155 approvals...")
      const erc1155Approvals = (await getERC1155Approvals(wallet, provider)) || []
      console.log("✅ ERC-1155 approvals fetched:", erc1155Approvals)

      // Combine all approvals
      const allApprovals = [...erc20Approvals, ...erc721Approvals, ...erc1155Approvals]

      console.log("📊 Total approvals found:", {
        "ERC-20": erc20Approvals.length,
        "ERC-721": erc721Approvals.length,
        "ERC-1155": erc1155Approvals.length,
        Total: allApprovals.length,
      })

      // Always dispatch the approvals, even if empty
      dispatch(setApprovals(allApprovals))
    } catch (error) {
      console.error("❌ Error refreshing approvals:", error)
      setError("Failed to refresh approvals: " + error.message)
    } finally {
      // Make sure refreshing state is always set to false when done
      setRefreshing(false)
    }
  }

  // Process selected approvals
  const handleRevoke = async () => {
    if (!selectedApprovals.length || processing) {
      console.log("⚠️ No approvals selected or already processing")
      return
    }

    console.log("🚀 Starting revocation for", selectedApprovals.length, "approvals")
    setProcessing(true)
    setProgressValue(10)
    setProgressStatus("Preparing revocation...")
    setError(null)

    try {
      console.log("🔌 Getting provider and signer...")
      const provider = await getProvider()
      if (!provider) {
        throw new Error("Failed to get provider")
      }

      const signer = await provider.getSigner()
      if (!signer) {
        throw new Error("Failed to get signer")
      }

      console.log("✅ Provider and signer ready")

      // Separate approvals by type
      const erc20Approvals = selectedApprovals.filter((a) => a?.type === "ERC-20")
      const erc721Approvals = selectedApprovals.filter((a) => a?.type === "ERC-721")
      const erc1155Approvals = selectedApprovals.filter((a) => a?.type === "ERC-1155")

      console.log("📊 Approval breakdown:", {
        "ERC-20": erc20Approvals.length,
        "ERC-721": erc721Approvals.length,
        "ERC-1155": erc1155Approvals.length,
      })

      const successfulApprovals = []

      // Process ERC-20 tokens if any
      if (erc20Approvals.length > 0) {
        console.log("💰 Revoking ERC-20 approvals")
        setProgressStatus("Revoking ERC-20 approvals...")
        setProgressValue(20)
        try {
          const erc20Result = await revokeERC20Approvals(erc20Approvals, signer)
          if (erc20Result?.success) {
            console.log("✅ ERC-20 revocation successful")
            successfulApprovals.push(...erc20Approvals)
          }
        } catch (error) {
          console.error("❌ ERC-20 revocation error:", error)
        }
      }

      // Process ERC-721 tokens if any
      if (erc721Approvals.length > 0) {
        console.log("🖼️ Revoking ERC-721 approvals")
        setProgressStatus("Revoking ERC-721 approvals...")
        setProgressValue(40)
        try {
          const erc721Result = await revokeERC721Approvals(erc721Approvals, signer)
          if (erc721Result?.success) {
            console.log("✅ ERC-721 revocation successful")
            successfulApprovals.push(...erc721Approvals)
          }
        } catch (error) {
          console.error("❌ ERC-721 revocation error:", error)
        }
      }

      // Process ERC-1155 tokens if any
      if (erc1155Approvals.length > 0) {
        console.log("🎮 Revoking ERC-1155 approvals")
        setProgressStatus("Revoking ERC-1155 approvals...")
        setProgressValue(60)
        try {
          const erc1155Result = await revokeMultipleERC1155Approvals(
            erc1155Approvals.map((a) => ({ contract: a.contract, spender: a.spender })),
          )
          if (erc1155Result?.success) {
            console.log("✅ ERC-1155 revocation successful")
            successfulApprovals.push(...erc1155Approvals)
          }
        } catch (error) {
          console.error("❌ ERC-1155 revocation error:", error)
        }
      }

      setProgressValue(80)
      setProgressStatus("Updating state...")

      if (successfulApprovals.length > 0) {
        // Create a new array without the revoked approvals
        const currentApprovals = [...approvals] // Make a copy of current approvals
        const remainingApprovals = currentApprovals.filter(
          (a) =>
            !successfulApprovals.some(
              (sel) =>
                sel.contract === a.contract &&
                sel.spender === a.spender &&
                (a.tokenId ? sel.tokenId === a.tokenId : true),
            ),
        )

        console.log("🟢 Updating Redux with remaining approvals:", remainingApprovals.length)
        dispatch(setApprovals(remainingApprovals))
        setProgressValue(100)
        setProgressStatus(`Revocation complete! Revoked ${successfulApprovals.length} approvals.`)
      } else {
        throw new Error("No approvals were successfully revoked.")
      }
    } catch (error) {
      console.error("❌ Revocation Error:", error)
      setProgressStatus("Revocation failed.")
      setError(error.message || "Revocation failed")
    } finally {
      setProcessing(false)
      setSelectedApprovals([])
      setTimeout(() => {
        setProgressValue(0)
        setProgressStatus("")
      }, 2000)
    }
  }

  return (
  <>
    {/* Error Display */}
    {error && <div className="alert alert-danger mb-3">{error}</div>}

    {/* Progress Bar */}
    {progressValue > 0 && <TransactionProgressBar progress={progressValue} status={progressStatus} />}

    {/* Approvals table  */}
    <div
      className="approval-window"
      style={{
        minHeight: "200px",
        maxHeight: "calc(60vh - 200px)", // Responsive height based on viewport
        overflowY: "auto",
        border: "1px solid var(--border-color)",
        borderRadius: "0.75rem",
        backgroundColor: "var(--form-bg)",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)",
        position: "relative",
        padding: "0"
      }}
    >
      <div style={{ padding: "0 0.75rem" }}>
        <table className="table table-hover mb-0" style={{ marginTop: 0 }}>
          <thead style={{
            position: "sticky",
            top: "0",
            zIndex: 2,
            backgroundColor: "#000000", // Pure black background
            color: "#ffffff", // White text
            borderBottom: "2px solid #000000", // Match the black background
            marginTop: 0
          }}>
            <tr style={{ lineHeight: "1" }}>
              <th style={{ padding: "0.75rem 0.5rem", backgroundColor: "#000000", color: "#ffffff" }}>
                <input
                  type="checkbox"
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  checked={approvals.length > 0 && selectedApprovals.length === approvals.length}
                  disabled={approvals.length === 0 || processing}
                />
              </th>
              <th style={{ padding: "0.75rem 0.5rem", backgroundColor: "#000000", color: "#ffffff" }}>TOKEN</th>
              <th style={{ padding: "0.75rem 0.5rem", backgroundColor: "#000000", color: "#ffffff" }}>TYPE</th>
              <th style={{ padding: "0.75rem 0.5rem", backgroundColor: "#000000", color: "#ffffff" }}>SPENDER</th>
              <th style={{ padding: "0.75rem 0.5rem", backgroundColor: "#000000", color: "#ffffff" }}>ALLOWANCE</th>
              <th style={{ padding: "0.75rem 0.5rem", backgroundColor: "#000000", color: "#ffffff" }}>RISK LEVEL</th>
              <th style={{ padding: "0.75rem 0.5rem", backgroundColor: "#000000", color: "#ffffff" }}>LAST USED</th>
              <th style={{ padding: "0.75rem 0.5rem", backgroundColor: "#000000", color: "#ffffff" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody className="border-0" style={{ marginTop: "0.5rem" }}>
            {approvals.map((a, idx) => {
              const isSelected = selectedApprovals.some(
                (sel) =>
                  sel.contract === a.contract &&
                  sel.spender === a.spender &&
                  (a.tokenId !== undefined ? sel.tokenId === a.tokenId : true),
              );

              return (
                <tr key={idx} className="border-0">
                  {/* Checkbox Column */}
                  <td style={{ padding: "0.5rem" }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelect(a)}
                      disabled={processing}
                    />
                  </td>

                  {/* Token Column */}
                  <td style={{ padding: "0.5rem" }}>
                    <AssetDisplay approval={a} compact={true} logoSize="small" />
                  </td>

                  {/* Type Column */}
                  <td style={{ padding: "0.5rem" }}>
                    <span
                      className={`badge bg-${a.type === "ERC-20" ? "success" : a.type === "ERC-721" ? "primary" : "warning"}`}
                      style={{ fontSize: "0.75rem" }}
                    >
                      {a.type}
                    </span>
                  </td>

                  {/* Spender Column */}
                  <td style={{ padding: "0.5rem" }}>
                    <SpenderDisplay address={a.spender} />
                  </td>

                  {/* Allowance Column */}
                  <td style={{ padding: "0.5rem", fontSize: "0.85rem" }}>
                    {a.valueAtRisk
                      ? a.type === "ERC-20" && a.valueAtRisk.toLowerCase() !== "unlimited"
                        ? `${a.valueAtRisk}`
                        : a.valueAtRisk
                      : "Unknown"}
                  </td>

                  {/* Risk Level Column */}
                  <td style={{ padding: "0.5rem" }}>
                    <RiskLevel approval={a} />
                  </td>

                  {/* Last Used Column */}
                  <td style={{ padding: "0.5rem", fontSize: "0.85rem" }}>
                    {a.lastUsed || "15/03/2023 14:30"}
                  </td>

                  {/* Actions Column */}
                  <td style={{ padding: "0.5rem" }}>
                    <button
                      className="btn btn-danger btn-sm"
                      style={{ fontSize: "0.75rem" }}
                      onClick={() => handleSingleRevoke(a)}
                      disabled={processing}
                    >
                      Revoke
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>

{/* PROCEED Button with metallic gradient and white highlight */}
<button
  className="btn btn-proceed w-100 text-uppercase mt-3"
  onClick={handleRevoke}
  disabled={processing || selectedApprovals.length === 0}
  style={{ 
    background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.5) 0%, #0dcc8e 100%)",
    border: "none",
    borderRadius: "0.5rem",
    padding: "0.875rem",
    fontWeight: "500",
    color: "#ffffff",
    letterSpacing: "0.05rem",
    boxShadow: "0 4px 10px rgba(10, 21, 37, 0.2), 0 0 20px rgba(14, 181, 130, 0.3)",
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
    position: "relative",
    overflow: "hidden"
  }}
>
  <span
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "40%",
      background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.3), transparent)",
      borderRadius: "0.5rem 0.5rem 0 0",
      pointerEvents: "none"
    }}
  ></span>
  {processing ? "PROCESSING..." : "PROCEED"}
</button>
  </>
  );
};

export default ApprovalDashboard;