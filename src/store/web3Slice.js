// Minimal Redux slice for testing
import { createSlice } from "@reduxjs/toolkit";

const minimalWeb3Slice = createSlice({
  name: "web3",
  initialState: {
    account: null,
    network: null,
    approvals: [], // Always initialize as an empty array
    lastUpdated: new Date().toISOString()
  },
  reducers: {
    // Simplified setApprovals that just replaces the array
    setApprovals: (state, action) => {
      console.log("🔄 MinimalRedux: setApprovals called");
      console.log("📥 Payload:", action.payload);
      
      // Very robust validation and handling
      if (!action.payload) {
        console.warn("⚠️ Empty payload received, setting empty array");
        state.approvals = [];
      }
      else if (!Array.isArray(action.payload)) {
        console.warn("⚠️ Non-array payload received, wrapping in array");
        state.approvals = [action.payload];
      } 
      else {
        state.approvals = action.payload; // Simple direct assignment
      }
      
      // Update timestamp
      state.lastUpdated = new Date().toISOString();
      
      console.log("✅ New approvals state:", state.approvals);
    },
    
    // Simplified account setter
    setAccount: (state, action) => {
      state.account = action.payload;
      console.log("👛 Account set:", action.payload);
    },
    
    // Simplified network setter
    setNetwork: (state, action) => {
      state.network = action.payload;
      console.log("🌐 Network set:", action.payload);
    }
  }
});

export const { setApprovals, setAccount, setNetwork } = minimalWeb3Slice.actions;
export default minimalWeb3Slice.reducer;


