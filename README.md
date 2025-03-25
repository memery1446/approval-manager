Overview
Approval-Manager is a comprehensive tool for managing and monitoring token approvals on Ethereum and compatible blockchains. It provides a streamlined interface for handling ERC20, ERC721, and ERC1155 token approvals, helping users secure their assets by maintaining visibility and control over smart contract permissions. The project is currently deployed on the Hardhat testnet.

## Getting Started 

### Prerequisites

Make sure you have installed:

Node.js & npm

Docker

### Clone the Repository

git clone https://github.com/memery1446/approval-manager.git 

### Navigate to the project directory and install dependencies

cd approval-manager 

npm install

### Add a .env file and fill it in based on the .env.example file

touch .env

### Stop running any Docker containers

docker stop approval-manager

docker rm approval-manager

docker rmi approval-manager

### Pull the latest version

docker pull memery1446/approval-manager:latest

### Start the container in detatched mode routing to 8545

docker run -d --name approval-manager -p 8545:8545 memery1446/approval-manager:latest


### Enter the container:

docker exec -it approval-manager bash

### Compile the smart contracts

npx hardhat compile

### Start the Hardhat node

npx hardhat node

### Run a fresh deployment in another terminal window:

npx hardhat run scripts/deploy.js --network localhost

### Run the approval script:

npx hardhat run scripts/Approve.js --network localhost

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