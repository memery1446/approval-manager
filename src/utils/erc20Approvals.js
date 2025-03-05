import { Contract, JsonRpcProvider, getAddress } from "ethers";
import { CONTRACT_ADDRESSES, TOKEN_ABI } from "../../src/constants/abis";

const provider = new JsonRpcProvider(process.env.REACT_APP_ALCHEMY_SEPOLIA_URL);

// Define spender addresses
const spenderAddresses = [CONTRACT_ADDRESSES.MockSpender];

export async function getERC20Approvals(tokenContracts, ownerAddress) {
  console.log("🔍 Starting ERC-20 approval check for:", ownerAddress);

  // Ensure token contracts are provided
  if (!tokenContracts || tokenContracts.length === 0) {
    console.warn("⚠️ No ERC-20 token contracts provided. Skipping...");
    return [];
  }

  console.log("🔍 Checking token contracts:", tokenContracts);
  let approvals = [];

  for (let tokenAddress of tokenContracts) {
    try {
      tokenAddress = getAddress(tokenAddress);
      console.log(`🔍 Checking ERC-20 token: ${tokenAddress}`);
      const contract = new Contract(tokenAddress, TOKEN_ABI, provider);

      for (let spender of spenderAddresses) {
        spender = getAddress(spender);
        console.log(`🔍 Checking allowance for spender: ${spender}`);
        const allowance = await contract.allowance(ownerAddress, spender);
        console.log(`💰 Allowance result: ${allowance.toString()}`);

        if (allowance > 0n) {
          const approval = {
            contract: tokenAddress,
            type: "ERC-20",
            spender: spender,
            amount: allowance.toString(),
          };

          approvals.push(approval);
          console.log(`✅ Found ERC-20 approval:`, approval);
        }
      }
    } catch (error) {
      console.error(`❌ Error checking ERC-20 token ${tokenAddress}:`, error.message);
    }
  }

  console.log("✅ Completed ERC-20 check. Found approvals:", approvals.length);
  return approvals;
}

export default getERC20Approvals;


