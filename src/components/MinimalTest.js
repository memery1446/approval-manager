import React, { useEffect } from "react";
import getERC20Approvals from "../utils/erc20Approvals";
import getERC721Approvals from "../utils/nftApprovals"; // ✅ make sure this is correct
import { JsonRpcProvider } from "ethers";

export default function MinimalTest() {
  useEffect(() => {
    const run = async () => {
      const provider = new JsonRpcProvider("http://127.0.0.1:8545");

      const user = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Hardhat dev wallet

      // ✅ ERC-20 approvals
      const erc20Approvals = await getERC20Approvals(null, user, provider);
      console.log("🧾 ERC-20 Approvals:", erc20Approvals);

      // ✅ ERC-721 approvals
      const erc721Approvals = await getERC721Approvals(user, provider);
      console.log("🎨 ERC-721 Approvals:", erc721Approvals);
    };

    run();
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Minimal Test</h2>
      <p>Check the console for both ERC-20 and ERC-721 approvals.</p>
    </div>
  );
}
