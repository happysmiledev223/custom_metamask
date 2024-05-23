const { Web3Provider } = require('@ethersproject/providers');
const { ethers } = require('ethers');
const { formatUnits } = require('@ethersproject/units');
import { useDispatch, useSelector } from 'react-redux';
import actions from '../store/actions'

export function getBalance(walletAddress, dispatch) {
  const web3Provider = new Web3Provider(global.ethereumProvider);
  web3Provider.getBalance(walletAddress).then(balance => {
    const balanceInEther = ethers.utils.formatUnits(balance, 'ether');
    dispatch(actions.setRemoteBalance(balance._hex));
    return balance._hex;
  }).catch(error => {
    console.error('Error:', error);
  });
}