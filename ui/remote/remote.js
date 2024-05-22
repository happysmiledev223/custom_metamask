const { Web3Provider } = require('@ethersproject/providers');

export function getBalance(walletAddress) {
  const web3Provider = new Web3Provider(global.ethereumProvider);
  web3Provider.getBalance(walletAddress).then(balance => {
    console.log("Balance:",balance.toString());
    return balance.toString();
  }).catch(error => {
    console.error('Error:', error);
  });
}