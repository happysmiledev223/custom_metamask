// import { TypedTransaction } from '@ethereumjs/tx';
// import { SignTypedDataVersion } from '@metamask/eth-sig-util';
// import { Eip1024EncryptedData, Hex, Keyring } from '@metamask/utils';

// eslint-disable-next-line camelcase
const util_1 = require('@ethereumjs/util');
// eslint-disable-next-line camelcase
const utils_1 = require('@metamask/utils');

const TYPE = 'Remote';

function hexStringToDecimalArray(hexString) {
  const decimalArray = new Uint8Array(hexString.length / 2);
  let index = 0;
  for (let i = 0; i < hexString.length; i += 2) {
    const hexPair = `0x${hexString.slice(i, i + 2)}`;
    decimalArray[index] = parseInt(hexPair, 16);
    index += 1;
  }
  return decimalArray;
}

let remotePublicKeys = new Array([]);

export default class RemoteKeyring {
  constructor(publicKeys = []) {
    const pubKeys = publicKeys.map((publicKey) => {
      const strippedHexPublicKey = stripHexPrefix(publicKey);
      const pubKey = Buffer.from(strippedHexPublicKey);
      return pubKey;
    });
    remotePublicKeys = new Array(pubKeys);
    this.type = TYPE;
  }

  async serialize() {
    return remotePublicKeys.map((pubkey) => pubkey.toString('hex'));
  }

  async deserialize(publicKeys = []) {
    const pubKeys = publicKeys.map((publicKey) => {
      const strippedHexPublicKey = stripHexPrefix(publicKey);
      const pubKey = Buffer.from(strippedHexPublicKey, 'hex');
      return pubKey;
    });
    remotePublicKeys = pubKeys;
  }

  async addAccounts(numAccounts) {
    const newWallets = [];
    for (let i = 0; i < numAccounts; i++) {
      const publicKey = '';
      newWallets.push(publicKey);
    }
    remotePublicKeys = [...newWallets, ...remotePublicKeys];
    const hexWallets = newWallets.map(({ publicKey }) =>
      (0, utils_1.add0x)(
        (0, util_1.bufferToHex)((0, util_1.publicToAddress)(publicKey)),
      ),
    );
    return hexWallets;
  }

  async getAccounts() {
    return remotePublicKeys.map((publicKey) =>
      (0, utils_1.add0x)(
        (0, util_1.bufferToHex)((0, util_1.publicToAddress)(publicKey)),
      ),
    );
    // return remotePublicKeys.map((publicKey) => {
    // (0, utils_1.add0x)((0, util_1.bufferToHex)((0, util_1.publicToAddress)(publicKey)));
    // });
  }

  signTransaction(address, transaction, opts) {}

  signMessage(address, data, opts) {}

  signPersonalMessage(address, msgHex, opts) {}

  decryptMessage(withAccount, encryptedData) {}

  signTypedData(address, typedData, opts) {}

  getEncryptionPublicKey(withAccount, opts) {}

  getAppKeyAddress(address, origin) {}

  exportAccount(address) {
    if (
      !remotePublicKeys
        .map((publicKey) =>
          (0, util_1.bufferToHex)(
            (0, util_1.publicToAddress)(publicKey),
          ).toLowerCase(),
        )
        .includes(address.toLowerCase())
    )
      throw new Error(`Address ${address} not found in this keyring`);
    return address.toString('hex');
  }

  removeAccount(address) {
    if (
      !remotePublicKeys
        .map((publicKey) =>
          (0, util_1.bufferToHex)(
            (0, util_1.publicToAddress)(publicKey),
          ).toLowerCase(),
        )
        .includes(address.toLowerCase())
    ) {
      throw new Error(`Address ${address} not found in this keyring`);
    }
    remotePublicKeys = remotePublicKeys.filter(
      (publicKey) => publicKey !== address,
    );
  }
}

export function isHexPrefixed(str) {
  if (typeof str !== 'string') {
    throw new Error(
      `[isHexPrefixed] input must be type 'string', received type ${typeof str}`,
    );
  }
  return str[0] === '0' && str[1] === 'x';
}

export function stripHexPrefix(str) {
  if (typeof str !== 'string') {
    throw new Error(
      `[stripHexPrefix] input must be type 'string', received ${typeof str}`,
    );
  }

  return isHexPrefixed(str) ? str.slice(2) : str;
}
