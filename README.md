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

### Wallet setup

This is set up for 1337, not 31337

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
The Approval Manager dApp offers users a streamlined interface to monitor and manage token approvals across various Ethereum standards, including ERC-20, ERC-721, and ERC-1155. By integrating with users' Ethereum wallets, it provides a comprehensive overview of active token allowances granted to third-party contracts, enhancing security and control over digital assets.

### Key Features:

#### Comprehensive Approval Tracking: The dApp scans and displays all active approvals for ERC-20 tokens (fungible assets), ERC-721 tokens (non-fungible tokens or NFTs), and ERC-1155 tokens (multi-token standard), allowing users to view which contracts have access to their assets.​

#### Selective Revocation: Users can selectively revoke approvals, effectively removing the permission previously granted to specific contracts. This feature is crucial for minimizing exposure to potentially malicious or outdated contracts.​

#### Batch Revocation: For efficiency, the dApp supports batch revocation, enabling users to revoke multiple approvals simultaneously, reducing the number of transactions and associated gas fees.​

#### User-Friendly Interface: Designed with simplicity in mind, the dApp provides an intuitive interface that displays relevant information, such as the spender contract address, token type, and approved amount, facilitating informed decision-making.​

### Understanding Approvals:

#### ERC-20 Approvals: In the ERC-20 standard, approvals are managed through the approve function, where a token holder authorizes a spender to transfer up to a specified amount of tokens on their behalf. This is commonly used in decentralized exchanges and lending platforms.​
GitHub

#### ERC-721 Approvals: For ERC-721 tokens, approvals can be granted for individual NFTs using the approve function or for all NFTs owned by a user through the setApprovalForAll function. The latter grants blanket permission to a spender for all of the user's NFTs.​

#### ERC-1155 Approvals: The ERC-1155 standard introduces a versatile approval mechanism where the setApprovalForAll function is used to grant or revoke permission for an operator to manage all of the caller's tokens, accommodating both fungible and non-fungible tokens within a single contract.​

### By consolidating the management of these approvals into a single platform, the Approval Manager dApp empowers users to maintain better control over their digital assets, enhancing security and reducing the risk of unauthorized token transfers.

## Deployments
The Approval-Manager is currently deployed on the Hardhat testnet:

Project Maintainer: Mark Emery
GitHub Repository: memery1446/approval-manager