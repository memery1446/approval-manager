import { JsonRpcProvider, BrowserProvider } from "ethers";

console.log("🔌 provider.js loaded - " + new Date().toISOString());

// Get the dynamic chain ID matching hardhat.config.js
const USE_DEFAULT_CHAIN_ID = process.env.USE_DEFAULT_CHAIN_ID === "true";
const LOCAL_CHAIN_ID = USE_DEFAULT_CHAIN_ID ? 31337 : 1337;

const getRpcUrl = () => {
  if (typeof window !== "undefined") {
    const mode = localStorage.getItem("rpcMode") || "remote";
    if (mode === "local") {
      return "http://127.0.0.1:8545"; // 🖥 Hardhat local
    }
  }

  // Default: use Infura or fallback
  return process.env.HARDHAT_RPC_URL || 
         `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}` ||
         "https://ethereum.publicnode.com"; // final backup
};


// Dynamic network RPC URLs
const NETWORK_RPC_URLS = {
  [LOCAL_CHAIN_ID]: getRpcUrl(), // Dynamic local chain ID
};

if (typeof window !== 'undefined') {
    window.NETWORK_INFO = {
        supportedNetworks: Object.keys(NETWORK_RPC_URLS).map(Number),
        currentLocalNetwork: LOCAL_CHAIN_ID,
        getNetworkName: (chainId) => {
            const names = {
                1: "Ethereum Mainnet",
                11155111: "Sepolia Testnet",
                31337: "Hardhat Localhost (31337)",
                1337: "Hardhat Localhost (1337)"
            };
            return names[chainId] || `Unknown Network (${chainId})`;
        }
    };
    console.log(`🌐 Network info exposed - Local chain ID: ${LOCAL_CHAIN_ID}`);
}

async function getProvider() {
    try {
        console.log("📡 Attempting to get provider...");

        if (typeof window !== "undefined" && window.ethereum) {
            console.log("🦊 MetaMask or similar provider detected");
            const provider = new BrowserProvider(window.ethereum);
            const network = await provider.getNetwork();
            const chainId = Number(network.chainId);

            // Dynamic check based on the current environment
            if (chainId !== LOCAL_CHAIN_ID) {
                alert(`❌ Wrong network detected! Please switch to Hardhat (Chain ID: ${LOCAL_CHAIN_ID}) in MetaMask.`);
                return null;
            }

            console.log(`✅ Connected to Chain ID: ${chainId}`);

            window.ethersProvider = provider; // Assign to global scope immediately
            console.log("🔌 Provider set globally!");

            if (window.store && window.store.dispatch) {
                window.store.dispatch({ type: 'web3/setNetwork', payload: chainId });
                console.log("🔄 Updated network in Redux:", chainId);
            }

            return provider;
        }

        const rpcUrl = getRpcUrl();
        console.log(`📡 No wallet detected, using RPC: ${rpcUrl}`);
        console.log(`🌐 Selected RPC URL: ${rpcUrl}`);


        const fallbackProvider = new JsonRpcProvider(rpcUrl);
        window.ethersProvider = fallbackProvider;
        console.log("🔌 Fallback provider set globally!");

        return fallbackProvider;
    } catch (error) {
        console.error("❌ Provider error:", error);
        return null;
    }
}

// ✅ Restore BootstrapWrapper
const BootstrapWrapper = ({ children }) => {
  return <div className="bootstrap-wrapper">{children}</div>;
};

// ✅ Force provider setup when the script loads
(async () => {
    console.log(`🔄 Ensuring provider is initialized (Chain ID: ${LOCAL_CHAIN_ID})...`);
    await getProvider();
    console.log("✅ Provider setup complete!");
})();

export { getProvider, BootstrapWrapper, LOCAL_CHAIN_ID };

