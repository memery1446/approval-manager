// components/ProviderInitializer.js
import { useEffect } from "react";
import { initializeProvider } from "../utils/providerService";

const ProviderInitializer = () => {
  useEffect(() => {
    initializeProvider(); // ensures Redux gets account/network after reload
  }, []);

  return null; // no UI needed
};

export default ProviderInitializer;

