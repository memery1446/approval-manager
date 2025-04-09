import React, { useEffect } from "react";
import getERC20Approvals from "../utils/erc20Approvals";
import { JsonRpcProvider } from "ethers";

export default function MinimalTest() {
  useEffect(() => {
    const run = async () => {
      const provider = new JsonRpcProvider("http://127.0.0.1:8545");

      const user = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Hardhat dev wallet
      const approvals = await getERC20Approvals(null, user, provider);

      console.log("🧾 ERC-20 Approvals:", approvals);
    };

    run();
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Minimal Test</h2>
      <p>Check the console for ERC-20 approvals on your local fork.</p>
    </div>
  );
}
