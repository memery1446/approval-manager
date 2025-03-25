## Overview
Approval-Manager is a comprehensive tool for managing and monitoring token approvals on Ethereum and compatible blockchains. It provides a streamlined interface for handling ERC20, ERC721, and ERC1155 token approvals, helping users secure their assets by maintaining visibility and control over smart contract permissions. The project is currently deployed on the Hardhat testnet.

## Getting Started 

### Prerequisites

Make sure you have installed:

Node.js & npm

### Clone the Repository

git clone https://github.com/memery1446/approval-manager.git 

### Navigate to the project directory and install dependencies

cd approval-manager 

npm install

### Add a .env file and fill it in based on the .env.example file

touch .env

### Set up is for 1337, not 31337, so check hardhat set up in Web3 wallet

### Compile the smart contracts

npx hardhat compile

### Start the Hardhat node

npx hardhat node

### In a fresh terminal window open the Dapp UI

npm start

### In a fresh terminal window, run the first of two scripts:

npx hardhat run scripts/deploy.js --network localhost

### Run the second of two scripts:

npx hardhat run scripts/Approve.js --network localhost

### Click the refresh button in the Approval Window

35 approvals range through the various types within each standard. 

### Revoke approvals in singles or any combination or select-all, etc.

## Features

Multi-Standard Support: Manages approvals for ERC20, ERC721, and ERC1155 tokens
Approval Dashboard: Visual interface for monitoring all active approvals
Batch Operations: Revoke multiple approvals in a single transaction
Single Revocation: Revoke individual token approvals with ease
User-Friendly Display: Clear presentation of token amounts and contract addresses
Cross-Chain Support: Works across Ethereum and compatible chains
Sepolia Testnet Integration: Fully functional on Sepolia testnet for testing

## Deployments
The Approval-Manager is currently deployed on the Hardhat testnet:

Project Maintainer: Mark Emery
GitHub Repository: memery1446/approval-manager