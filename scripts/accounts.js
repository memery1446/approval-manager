import { getAddress } from 'ethers';

const address = '0xb66a603f4cfe17e3d27b87a8bfcad319856518b8';
const checksummedAddress = getAddress(address);
console.log(checksummedAddress);
