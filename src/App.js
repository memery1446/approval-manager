// App.js with improved text contrast
"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Provider } from "react-redux"
import store from "./store/index"
import WalletConnect from "./components/WalletConnect.js"
import NetworkSelector from "./components/NetworkSelector.js"
import ApprovalDashboard from "./components/ApprovalDashboard.js"
import ApprovalEducationPage from "./components/ApprovalEducationPage.js"
import "bootstrap/dist/css/bootstrap.min.css"
import { BootstrapWrapper } from "./utils/provider"
import { initializeProvider } from "./utils/providerService"
import FloatingRiskBanner from "./components/FloatingRiskBanner";
import ProviderInitializer from "./components/ProviderInitializer"; 
import RpcToggle from "./components/RpcToggle";



// Import the custom theme CSS
import "./styles/theme.css"
import './styles/tooltip.css'


// Use Redux hooks
const AppContent = () => {
  const dispatch = useDispatch()
  const wallet = useSelector((state) => state.web3?.account)
  const network = useSelector((state) => state.web3.network)
  const approvals = useSelector((state) => state.web3.approvals)
  const [showEducation, setShowEducation] = useState(false)
  const [hoveredRiskMessage, setHoveredRiskMessage] = useState(null);


  useEffect(() => {
    initializeProvider().catch((error) => console.error("❌ Provider initialization error:", error))
  }, [])

  return (
    <BootstrapWrapper>
    <ProviderInitializer />
    
      {!showEducation ? (
        // Main Dashboard View styled like the modal in the screenshot
        <div className="container my-4" style={{ maxWidth: "968px" }}>
          <div className="card shadow-lg" style={{ position: "relative" }}>
            <div className="card-body p-4">
              <h3 className="mb-3" style={{ color: "#ffffff", fontWeight: "normal" }}>
                Revoke Approvals
              </h3>

              {/* Wallet Selector - more compact */}
              <div className="mb-3">
                <WalletConnect />
              </div>


              {/* Wallet Details - more compact */}
              {wallet && (
                <div
                  style={{
                    backgroundColor: "var(--input-bg)",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div className="d-flex justify-content-between" style={{ color: "#ffffff", fontSize: "0.9rem" }}>
                    <span>Total Approvals:</span>
                    <span>{approvals?.length || 0}</span>
                  </div>
                  <div className="d-flex justify-content-between" style={{ color: "#ffffff", fontSize: "0.9rem" }}>
                    <span>Network:</span>
                    <span>{network || "Not selected"}</span>
                  </div>
                </div>
              )}

              {/* Network Selector - more compact */}
              <div className="mb-3">
                <NetworkSelector />
              </div>

{/* Rpc Dev Toggle */}
              <div className="mb-3">
               <RpcToggle />
              </div>

              {/* Approval Dashboard - given more vertical space */}
             <ApprovalDashboard
  onNavigateToEducation={() => setShowEducation(true)}
  setHoveredRiskMessage={setHoveredRiskMessage}
/>
            </div>
          </div>
        </div>
      ) : (
        // Education Page View
        <div className="container my-5">
          <ApprovalEducationPage onBack={() => setShowEducation(false)} />
        </div>
      )}

<FloatingRiskBanner message={hoveredRiskMessage} />


    </BootstrapWrapper>
  )
}

const App = () => {
  useEffect(() => {
    // Expose store to window for debugging
    if (typeof window !== "undefined" && !window.store) {
      window.store = store
    }
  }, [])

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App
