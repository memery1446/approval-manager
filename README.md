## Overview
Approval-Manager is a comprehensive tool for managing and monitoring token approvals on Ethereum and compatible blockchains. It provides a streamlined interface for handling ERC20, ERC721, and ERC1155 token approvals, helping users secure their assets by maintaining visibility and control over smart contract permissions. The project is currently deployed on the Hardhat testnet.

## Getting Started 

### Prerequisites

Make sure you have installed:

Node.js & npm

This is set up for use of Hardhat localhost

### Clone the Repository

git clone https://github.com/memery1446/approval-manager.git 

### Navigate to the project directory and install dependencies

cd approval-manager 

npm install

### Start the Hardhat node 

npx hardhat node

### In a new terminal window, cd into project and add a .env file. Fill it in based on the .env.example file

touch .env

(Hardhat private keys are public:) 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

### Wallet setup

#### Add Hardhat network

NOTE: Use chainID: 1337, -NOT- 31337 

Hardhat Network RPC URL, http://127.0.0.1:8545/ 

#### Import and deploy from Hardhat account -0- 

The following information is public, from the Hardhat node: 

##### Account #0: 
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 

##### Private Key: 
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

### Compile the smart contracts

npx hardhat compile

### In a fresh terminal window open the Dapp UI

npm start

(If it doesn't open automatically, browser to localhost:3000)

### In a fresh terminal window, run the first of two scripts:

npx hardhat run scripts/deploy.js --network localhost

### Run the second of two scripts:

npx hardhat run scripts/Approve.js --network localhost

### Click the refresh button in the UI Approval Window

35 approvals range through the various types within each standard. 
Revoke approvals in singles or any combination or select-all, etc.

#### Features
The Approval Manager dApp offers users a streamlined interface to monitor and manage token approvals across various Ethereum standards, including ERC-20, ERC-721, and ERC-1155. By integrating with users' Ethereum wallets, it provides a comprehensive overview of active token allowances granted to third-party contracts, enhancing security and control over digital assets.

##### Comprehensive Approval Tracking: 
The dApp scans and displays all active approvals for ERC-20 tokens (fungible assets), ERC-721 tokens (non-fungible tokens or NFTs), and ERC-1155 tokens (multi-token standard), allowing users to view which contracts have access to their assets.​

##### Selective Revocation: 
Users can selectively revoke approvals, effectively removing the permission previously granted to specific contracts. This feature is crucial for minimizing exposure to potentially malicious or outdated contracts.​

##### Batch Revocation: 
For efficiency, the dApp supports batch revocation, enabling users to revoke multiple approvals simultaneously, reducing the number of transactions and associated gas fees.​

##### User-Friendly Interface: 
Designed with simplicity in mind, the dApp provides an intuitive interface that displays relevant information, such as the spender contract address, token type, and approved amount, facilitating informed decision-making.​

#### Understanding Approvals

##### ERC-20 Approvals: 
In the ERC-20 standard, approvals are managed through the approve function, where a token holder authorizes a spender to transfer up to a specified amount of tokens on their behalf. This is commonly used in decentralized exchanges and lending platforms.​
GitHub

##### ERC-721 Approvals: 
For ERC-721 tokens, approvals can be granted for individual NFTs using the approve function or for all NFTs owned by a user through the setApprovalForAll function. The latter grants blanket permission to a spender for all of the user's NFTs.​

##### ERC-1155 Approvals: 
The ERC-1155 standard introduces a versatile approval mechanism where the setApprovalForAll function is used to grant or revoke permission for an operator to manage all of the caller's tokens, accommodating both fungible and non-fungible tokens within a single contract.​

##### By consolidating the management of these approvals into a single platform, the Approval Manager dApp empowers users to maintain better control over their digital assets, enhancing security and reducing the risk of unauthorized token transfers.

#### Deployments
The Approval-Manager is currently deployed on the Hardhat testnet:

Project Maintainer: Mark Emery
GitHub Repository: memery1446/approval-manager