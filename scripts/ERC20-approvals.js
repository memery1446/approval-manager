const { ethers } = require("hardhat");

/**
 * ERC20 Approval Manager - Handles different types of ERC20 approvals
 * 
 * Supports:
 * 1. Standard ERC20 tokens (like USDC) - Limited amount
 * 2. ERC20 Permit tokens (EIP2612, like UNI)
 * 3. ERC20 Fee tokens (tokens with transfer fees)
 */

// Spender addresses (using known addresses from spenderMapping.js)
const SPENDERS = {
  ONEINCH: "0x11111112542d85b3ef69ae05771c2dccff4faa26", // 1inch Router
  UNISWAP: "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45", // Uniswap Router V3
  OPENSEA: "0x00000000006c3852cbef3e08e8df289169ede581", // OpenSea Seaport
  OxEXCHANGE: "0xdef1c0ded9bec7f1a1670819833240f027b25eff", // 0x Exchange
};

// Token addresses and configurations
const TOKENS = {
  USDC: {
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
    type: "standard",
    name: "USDC"
  },
  UNI: {
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    decimals: 18,
    type: "permit",
    name: "UNI"
  },
  FLOKI: {
    address: "0xcf0C122c6b73ff809C693DB761e7BaeBe62b6a2E",
    decimals: 9,
    type: "fee",
    name: "FLOKI"
  },
  DAI: {
    address: "0x6b175474e89094c44da98b954eedeac495271d0f",
    decimals: 18,
    type: "standard",
    name: "DAI"
  },
  USDT: {
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    decimals: 6,
    type: "standard",
    name: "USDT"
  },
};

/**
 * Get optimized gas settings
 */
async function getGasSettings() {
  const feeData = await ethers.provider.getFeeData();
  return {
    maxFeePerGas: feeData.maxFeePerGas * BigInt(2), // Double for safety
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas * BigInt(2),
  };
}

/**
 * Standard ERC20 approval
 */
async function standardApprove(tokenConfig, spender, signer, amount = ethers.MaxUint256, approvalDate = null) {
  console.log(`\n🔑 Processing STANDARD approval for ${tokenConfig.name}...`);
  
  const token = await ethers.getContractAt(
    "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",
    tokenConfig.address,
    signer
  );
  
  // Get optimized gas settings
  const gasSettings = await getGasSettings();

  // Format amount for display
  const amountStr = amount === ethers.MaxUint256 
    ? "unlimited" 
    : ethers.formatUnits(amount, tokenConfig.decimals);
  
  console.log(`⏳ Approving ${spender} to spend ${amountStr} ${tokenConfig.name}...`);
  const tx = await token.approve(
    spender,
    amount,
    gasSettings
  );
  
  const receipt = await tx.wait();
  console.log(`✅ Approved! Transaction: ${tx.hash}`);
  
  return { 
    tokenConfig, 
    tx, 
    receipt,
    approvalDate: approvalDate || new Date().toISOString().split('T')[0], // Store approval date
    approvalAmount: amountStr
  };
}

/**
 * ERC20 Permit approval (EIP2612)
 */
async function permitApprove(tokenConfig, spender, signer, approvalDate = null) {
  console.log(`\n🔑 Processing PERMIT approval for ${tokenConfig.name}...`);
  
  // For permit tokens, we need the ERC20Permit interface
  const token = await ethers.getContractAt(
    ["function nonces(address owner) view returns (uint256)",
     "function name() view returns (string)",
     "function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)",
     "function approve(address spender, uint256 value) returns (bool)"],
    tokenConfig.address,
    signer
  );
  
  // Check if we can do a simple approve instead (fallback)
  try {
    console.log(`⚠️ Note: For simplicity, using standard approve for ${tokenConfig.name} instead of permit`);
    console.log(`   To implement full permit functionality, you would need to handle signatures`);
    
    // For unlimited approval, use MaxUint256
    const unlimitedAmount = ethers.MaxUint256;
    const gasSettings = await getGasSettings();
    
    const tx = await token.approve(
      spender,
      unlimitedAmount,
      gasSettings
    );
    
    const receipt = await tx.wait();
    console.log(`✅ Approved! Transaction: ${tx.hash}`);
    
    return { 
      tokenConfig, 
      tx, 
      receipt,
      approvalDate: approvalDate || new Date().toISOString().split('T')[0],
      approvalAmount: "unlimited"
    };
    
  } catch (error) {
    console.error(`❌ Error during permit approval:`, error);
    throw error;
  }
}

/**
 * ERC20 Fee token approval (tokens with transfer fees)
 */
async function feeTokenApprove(tokenConfig, spender, signer, approvalDate = null) {
  console.log(`\n🔑 Processing FEE TOKEN approval for ${tokenConfig.name}...`);
  console.log(`⚠️ Note: ${tokenConfig.name} has transfer fees, approving unlimited amount`);
  
  const token = await ethers.getContractAt(
    "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",
    tokenConfig.address,
    signer
  );
  
  // Get optimized gas settings
  const gasSettings = await getGasSettings();

  // For unlimited approval, use MaxUint256
  const unlimitedAmount = ethers.MaxUint256;

  console.log(`⏳ Approving ${spender} to spend unlimited ${tokenConfig.name}...`);
  const tx = await token.approve(
    spender,
    unlimitedAmount,
    gasSettings
  );
  
  const receipt = await tx.wait();
  console.log(`✅ Approved! Transaction: ${tx.hash}`);
  
  return { 
    tokenConfig, 
    tx, 
    receipt,
    approvalDate: approvalDate || new Date().toISOString().split('T')[0],
    approvalAmount: "unlimited"
  };
}

/**
 * Process the appropriate approval based on token type
 */
async function processApproval(tokenConfig, spenderAddress, signer, options = {}) {
  const { amount, approvalDate } = options;
  
  switch (tokenConfig.type) {
    case "standard":
      return await standardApprove(tokenConfig, spenderAddress, signer, amount, approvalDate);
    case "permit":
      return await permitApprove(tokenConfig, spenderAddress, signer, approvalDate);
    case "fee":
      return await feeTokenApprove(tokenConfig, spenderAddress, signer, approvalDate);
    default:
      throw new Error(`Unknown token type: ${tokenConfig.type}`);
  }
}

/**
 * Get spender name from address
 */
function getSpenderName(address) {
  for (const [key, value] of Object.entries(SPENDERS)) {
    if (value.toLowerCase() === address.toLowerCase()) {
      return key;
    }
  }
  return "Unknown";
}

/**
 * Main function
 */
async function main() {
  console.log("🚀 Starting ERC20 Approval Manager Script");
  
  // Get signer
  const [signer] = await ethers.getSigners();
  const signerAddress = await signer.getAddress();
  console.log(`📝 Using signer: ${signerAddress}`);
  
  // Generate a recent date for USDC approval (today - 3 days)
  const recentDate = new Date();
  recentDate.setDate(recentDate.getDate() - 3);
  const recentDateStr = recentDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  
  // Define our approvals to process
  const approvalsToProcess = [
    { 
      token: TOKENS.USDC, 
      spender: SPENDERS.ONEINCH,
      options: {
        amount: ethers.parseUnits("100", TOKENS.USDC.decimals), // 100 USDC
        approvalDate: recentDateStr // Recent date (3 days ago)
      }
    },
    { 
      token: TOKENS.UNI, 
      spender: SPENDERS.UNISWAP,
      options: {
        approvalDate: new Date().toISOString().split('T')[0] // Today's date
      }
    },
    { 
      token: TOKENS.FLOKI, 
      spender: SPENDERS.OPENSEA,
      options: {
        approvalDate: new Date().toISOString().split('T')[0] // Today's date
      }
    },
    {
      token: TOKENS.DAI,
      spender: SPENDERS.UNISWAP,
      options: {
        amount: ethers.parseUnits("75", TOKENS.DAI.decimals), // 75 DAI - LOW AMOUNT
        approvalDate: "2022-04-01" // OLD DATE for demonstrating age-based risk
      }
    },
    {
      token: TOKENS.USDT,
      spender: SPENDERS.OxEXCHANGE,
      options: {
        amount: ethers.MaxUint256, // unlimited
        approvalDate: new Date().toISOString().split('T')[0] // today
      }
    }
  ];
  
  // Process each approval
  const results = [];
  
  for (const approval of approvalsToProcess) {
    try {
      console.log(`\n-----------------------------------------------`);
      console.log(`Processing ${approval.token.name} approval for ${getSpenderName(approval.spender)}`);
      
      const result = await processApproval(
        approval.token,
        approval.spender,
        signer,
        approval.options || {}
      );
      
      results.push(result);
      
    } catch (error) {
      console.error(`❌ Error processing ${approval.token.name} approval:`, error);
    }
  }
  
  // Summary
  console.log(`\n-----------------------------------------------`);
  console.log(`✅ Approval Summary:`);
  for (const result of results) {
    console.log(`- ${result.tokenConfig.name}: Approved for ${result.approvalAmount} on ${result.approvalDate}, tx: ${result.tx.hash}`);
  }
  console.log(`-----------------------------------------------`);
}

// Execute the main function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });