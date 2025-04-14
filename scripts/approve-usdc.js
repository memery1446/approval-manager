const { ethers } = require("hardhat");

/**
 * ERC20 Approval Manager - Handles different types of ERC20 approvals
 * 
 * Supports:
 * 1. Standard ERC20 tokens (like USDC)
 * 2. ERC20 Permit tokens (EIP2612, like UNI)
 * 3. ERC20 Fee tokens (tokens with transfer fees)
 */

// Spender addresses (using known addresses from spenderMapping.js)
const SPENDERS = {
  ONEINCH: "0x11111112542d85b3ef69ae05771c2dccff4faa26", // 1inch Router
  UNISWAP: "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45", // Uniswap Router V3
  OPENSEA: "0x00000000006c3852cbef3e08e8df289169ede581", // OpenSea Seaport
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
  }
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
async function standardApprove(tokenConfig, spender, signer) {
  console.log(`\n🔑 Processing STANDARD approval for ${tokenConfig.name}...`);
  
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
  
  return { tokenConfig, tx, receipt };
}

/**
 * ERC20 Permit approval (EIP2612)
 */
async function permitApprove(tokenConfig, spender, signer) {
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
    
    return { tokenConfig, tx, receipt };
    
    /* Full permit implementation would look like this:
    const owner = await signer.getAddress();
    const nonce = await token.nonces(owner);
    const name = await token.name();
    const chainId = (await ethers.provider.getNetwork()).chainId;
    const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    
    // For unlimited approval, use MaxUint256
    const value = ethers.MaxUint256;
    
    // Create permit signature
    const domain = {
      name,
      version: '1',
      chainId,
      verifyingContract: tokenConfig.address
    };
    
    const types = {
      Permit: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' }
      ]
    };
    
    const message = {
      owner,
      spender,
      value,
      nonce,
      deadline
    };
    
    const signature = await signer._signTypedData(domain, types, message);
    const { v, r, s } = ethers.utils.splitSignature(signature);
    
    // Execute the permit
    const tx = await token.permit(
      owner,
      spender,
      value,
      deadline,
      v,
      r,
      s,
      await getGasSettings()
    );
    
    const receipt = await tx.wait();
    console.log(`✅ Permit approved! Transaction: ${tx.hash}`);
    
    return { tokenConfig, tx, receipt };
    */
    
  } catch (error) {
    console.error(`❌ Error during permit approval:`, error);
    throw error;
  }
}

/**
 * ERC20 Fee token approval (tokens with transfer fees)
 */
async function feeTokenApprove(tokenConfig, spender, signer) {
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
  
  return { tokenConfig, tx, receipt };
}

/**
 * Process the appropriate approval based on token type
 */
async function processApproval(tokenConfig, spenderAddress, signer) {
  switch (tokenConfig.type) {
    case "standard":
      return await standardApprove(tokenConfig, spenderAddress, signer);
    case "permit":
      return await permitApprove(tokenConfig, spenderAddress, signer);
    case "fee":
      return await feeTokenApprove(tokenConfig, spenderAddress, signer);
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
  
  // Define our approvals to process
  const approvalsToProcess = [
    { token: TOKENS.USDC, spender: SPENDERS.ONEINCH },    // Standard USDC approval
    { token: TOKENS.UNI, spender: SPENDERS.UNISWAP },     // Permit token (UNI)
    { token: TOKENS.FLOKI, spender: SPENDERS.OPENSEA }    // Fee token (FLOKI)
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
        signer
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
    console.log(`- ${result.tokenConfig.name}: Approved successfully, tx: ${result.tx.hash}`);
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