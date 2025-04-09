// src/constants/abis.js
const { abi: testERC1155ABI } = require('../artifacts/contracts/TestERC1155.sol/TestERC1155.json');
const { abi: testTokenABI } = require('../artifacts/contracts/TestToken.sol/TestToken.json');
const { abi: testNFTABI } = require('../artifacts/contracts/TestNFT.sol/TestNFT.json');

// Fall back to default if file doesn't exist
let deployedAddresses;
try {
    deployedAddresses = require('./deployedAddresses.json');
    console.log('Using addresses from deployedAddresses.json');
} catch (error) {
    console.warn('deployedAddresses.json not found, using default addresses');
    deployedAddresses = {
  "TK1": "0xa85EffB2658CFd81e0B1AaD4f2364CdBCd89F3a1",
  "TK2": "0x8aAC5570d54306Bb395bf2385ad327b7b706016b",
  "PermitToken": "0x64f5219563e28EeBAAd91Ca8D31fa3b36621FD4f",
  "FeeToken": "0x1757a98c1333B9dc8D408b194B2279b5AFDF70Cc",
  "TestNFT": "0x6484EB0792c646A4827638Fc1B6F20461418eB00",
  "UpgradeableNFT": "0xf201fFeA8447AB3d43c98Da3349e0749813C9009",
  "DynamicNFT": "0xA75E74a5109Ed8221070142D15cEBfFe9642F489",
  "TestERC1155": "0x495f947276749Ce646f68AC8c248420045cb7b5e",
  "UpgradeableERC1155": "0xB66a603f4cFe17e3D27B87a8BfCaD319856518B8",
  "MockSpender": "0x1bEfE2d8417e22Da2E0432560ef9B2aB68Ab75Ad",
  "BridgeSpender": "0x04f1A5b9BD82a5020C49975ceAd160E98d8B77Af",
  "DexSpender": "0xde79380FBd39e08150adAA5C6c9dE3146f53029e",
  "LendingSpender": "0xbFD3c8A956AFB7a9754C951D03C9aDdA7EC5d638",
  "MiscSpender": "0x38F6F2caE52217101D7CA2a5eC040014b4164E6C",
  "NftMarketplaceSpender": "0x207Fa8Df3a17D96Ca7EA4f2893fcdCb78a304101",
  "RaribleSpender": "0xfac7bea255a6990f749363002136af6556b31e04"
    };
}

module.exports = {
    TOKEN_ABI: testTokenABI,
    NFT_ABI: testNFTABI,
    ERC1155_ABI: testERC1155ABI,

    CONTRACT_ADDRESSES: deployedAddresses,

    NETWORK_CONFIG: {
        1337: {
            name: "Hardhat Local Fork",
            rpcUrl: typeof window !== 'undefined' 
                    ? (process.env.HARDHAT_RPC_URL || "http://127.0.0.1:8545")
                    : process.env.HARDHAT_RPC_URL, 
            contracts: {
                tokenManager: deployedAddresses.TK1,
                secondToken: deployedAddresses.TK2,
                erc721: [
                    deployedAddresses.TestNFT,
                    deployedAddresses.UpgradeableNFT,
                    deployedAddresses.DynamicNFT
                ],
                erc1155: [
                    deployedAddresses.TestERC1155,
                    deployedAddresses.UpgradeableERC1155
                ],
                MockSpender: deployedAddresses.MockSpender
            }
        },
        1: {
            name: "Ethereum Mainnet",
            rpcUrl: "https://eth-mainnet.alchemyapi.io/v2/YOUR_ALCHEMY_API_KEY",
            contracts: {
                tokenManager: "0xYourEthereumTokenManager",
                erc721: "0xYourEthereumERC721",
                erc1155: "0xYourEthereumERC1155"
            }
        },
        56: {
            name: "Binance Smart Chain",
            rpcUrl: "https://bsc-dataseed.binance.org/",
            contracts: {
                tokenManager: "0xYourBSCManager",
                erc721: "0xYourBSCERC721",
                erc1155: "0xYourBSCERC1155"
            }
        },
        137: {
            name: "Polygon",
            rpcUrl: "https://polygon-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY",
            contracts: {
                tokenManager: "0xYourPolygonTokenManager",
                erc721: "0xYourPolygonERC721",
                erc1155: "0xYourPolygonERC1155"
            }
        }
    }
};

