Overview
Approval-Manager is a comprehensive tool for managing and monitoring token approvals on Ethereum and compatible blockchains. It provides a streamlined interface for handling ERC20, ERC721, and ERC1155 token approvals, helping users secure their assets by maintaining visibility and control over smart contract permissions. The project is currently deployed on the Sepolia testnet.

## Getting Started 

### Clone the Repository

git clone https://github.com/memery1446/approval-manager.git <your-clone-name-here>

### Navigate to the project directory and install dependencies

cd approval-manager or your chosen name

npm install

### Add a .env file and fill it in based on the .env.example file

touch .env

### Stop running any Docker containers

docker stop approval-manager

docker rm approval-manager

docker rmi approval-manager

## Choose pull and run command combo that matches your setup
### Make sure docker desktop is started
 
### Pull and run on MAC (ARM64):

docker pull memery1446/approval-manager:arm64

docker run -d -p 3000:3000 --name approval-manager --env-file .env memery1446/approval-manager:arm64

### Pull and run on WINDOWS (AMD64):

docker pull memery1446/approval-manager:amd64

docker run -d -p 3000:3000 --name approval-manager --env-file .env memery1446/approval-manager:amd64

## Deploy contracts and update Addresses
### Enter the container:

docker exec -it approval-manager bash

### Run a fresh deployment:

npx hardhat run scripts/deploy.js --network sepolia

### Copy the new contract addresses to constants/abis.js and constants/networks.js.

manually update and save the addresses in abis.js and networks.js

### Run the approval script:

npx hardhat run scripts/approveOnly.js --network sepolia


## Features

Multi-Standard Support: Manages approvals for ERC20, ERC721, and ERC1155 tokens
Approval Dashboard: Visual interface for monitoring all active approvals
Batch Operations: Revoke multiple approvals in a single transaction
Single Revocation: Revoke individual token approvals with ease
User-Friendly Display: Clear presentation of token amounts and contract addresses
Cross-Chain Support: Works across Ethereum and compatible chains
Sepolia Testnet Integration: Fully functional on Sepolia testnet for testing

## Deployments
The Approval-Manager is currently deployed on the Sepolia testnet:
Sepolia Test Contracts
        TK1: "0x483FA7f61170c19276B3DbB399e735355Ae7676a",
        TK2: "0xE7B9Ede68593354aff96690600D008A40519D3CF",
        TestNFT: "0x8BB5f4628d7cFf1e2c9342B064f6F1b38376f354",
        ERC1155: "0x1bd10C54831F9231fDc5bD58139e2c101BE4396A",
        MockSpender: "0x3C8A478ff7839e07fAF3Dac72DCa575F5d4bC608"

Frontend URL: https://approval-manager-git-main-memery1446s-projects.vercel.app/

Usage

Connect your wallet (configured for Sepolia testnet)
View your active approvals in the dashboard
Select approvals and click "Revoke Selected" to revoke them
For batch operations, select multiple approvals of the same type
For mixed token types, the application will guide you through the process

Docker Management Commands
Option 1: Remove the existing container first (recommended)
shellCopy# First, stop the container if it's running
docker stop approval-manager

Contact

Project Maintainer: Mark Emery
GitHub Repository: memery1446/approval-manager