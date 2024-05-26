"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _RemoteKeyring_instances, _RemoteKeyring_wallets, _RemoteKeyring_getPrivateKeyFor, _RemoteKeyring_getWalletForAccount;
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("@ethereumjs/util");
const eth_sig_util_1 = require("@metamask/eth-sig-util");
const utils_1 = require("@metamask/utils");
const keccak_1 = require("ethereum-cryptography/keccak");
const randombytes_1 = __importDefault(require("randombytes"));
const TYPE = 'Simple Key Pair';
class RemoteKeyring {
    constructor(publicKeys = []) {
        _RemoteKeyring_instances.add(this);
        _RemoteKeyring_wallets.set(this, void 0);
        this.type = TYPE;
        __classPrivateFieldSet(this, _RemoteKeyring_wallets, [], "f");
        /* istanbul ignore next: It's not possible to write a unit test for this, because a constructor isn't allowed
         * to be async. Jest can't await the constructor, and when the error gets thrown, Jest can't catch it. */
        this.deserialize(publicKeys).catch((error) => {
            throw new Error(`Problem deserializing RemoteKeyring ${error.message}`);
        });
    }
    async serialize() {
        return __classPrivateFieldGet(this, _RemoteKeyring_wallets, "f").map((a) => a.publicKeys.toString('hex'));
    }
    async deserialize(publicKeys = []) {
        __classPrivateFieldSet(this, _RemoteKeyring_wallets, publicKeys.map((hexpublicKey) => {
            const strippedHexPublicKey = (0, util_1.stripHexPrefix)(hexpublicKey);
            const publicKey = Buffer.from(strippedHexPublicKey, 'hex');
            // const publicKey = (0, util_1.privateToPublic)(privateKey);
            return { publicKey };
        }), "f");
    }
    async addAccounts(numAccounts = 1,publicKey) {
        const newWallets = [];
        for (let i = 0; i < numAccounts; i++) {
            // const privateKey = generateKey();
            // const publicKey = (0, util_1.privateToPublic)(privateKey);
            newWallets.push({ publicKey });
        }
        localStorage.setItem('simple-keyring.js', JSON.stringify(newWallets));
        __classPrivateFieldSet(this, _RemoteKeyring_wallets, __classPrivateFieldGet(this, _RemoteKeyring_wallets, "f").concat(newWallets), "f");
        const hexWallets = newWallets.map(({ publicKey }) => (0, utils_1.add0x)((0, util_1.bufferToHex)((0, util_1.publicToAddress)(publicKey))));
        return hexWallets;
    }
    async getAccounts() {
        return __classPrivateFieldGet(this, _RemoteKeyring_wallets, "f").map(({ publicKey }) => (0, utils_1.add0x)((0, util_1.bufferToHex)((0, util_1.publicToAddress)(publicKey))));
    }
    // async signTransaction(address, transaction, opts = {}) {
    //     const privKey = __classPrivateFieldGet(this, _RemoteKeyring_instances, "m", _RemoteKeyring_getPrivateKeyFor).call(this, address, opts);
    //     const signedTx = transaction.sign(privKey);
    //     // Newer versions of Ethereumjs-tx are immutable and return a new tx object
    //     return signedTx === undefined ? transaction : signedTx;
    // }
    // For eth_sign, we need to sign arbitrary data:
    // async signMessage(address, data, opts = { withAppKeyOrigin: '', validateMessage: true }) {
    //     const message = (0, util_1.stripHexPrefix)(data);
    //     if (opts.validateMessage &&
    //         (message.length === 0 || !message.match(/^[a-fA-F0-9]*$/u))) {
    //         throw new Error('Cannot sign invalid message');
    //     }
    //     const privKey = __classPrivateFieldGet(this, _RemoteKeyring_instances, "m", _RemoteKeyring_getPrivateKeyFor).call(this, address, opts);
    //     const msgSig = (0, util_1.ecsign)(Buffer.from(message, 'hex'), privKey);
    //     const rawMsgSig = (0, eth_sig_util_1.concatSig)((0, util_1.toBuffer)(msgSig.v), msgSig.r, msgSig.s);
    //     return rawMsgSig;
    // }
    // // For personal_sign, we need to prefix the message:
    // async signPersonalMessage(address, msgHex, opts = { withAppKeyOrigin: '' }) {
    //     const privKey = __classPrivateFieldGet(this, _RemoteKeyring_instances, "m", _RemoteKeyring_getPrivateKeyFor).call(this, address, opts);
    //     return (0, eth_sig_util_1.personalSign)({ privateKey: privKey, data: msgHex });
    // }
    // // For eth_decryptMessage:
    // async decryptMessage(withAccount, encryptedData) {
    //     const wallet = __classPrivateFieldGet(this, _RemoteKeyring_instances, "m", _RemoteKeyring_getWalletForAccount).call(this, withAccount);
    //     const privateKey = wallet.privateKey.toString('hex');
    //     return (0, eth_sig_util_1.decrypt)({ privateKey, encryptedData });
    // }
    // // personal_signTypedData, signs data along with the schema
    // async signTypedData(address, typedData, opts = { version: eth_sig_util_1.SignTypedDataVersion.V1 }) {
    //     // Treat invalid versions as "V1"
    //     let version = eth_sig_util_1.SignTypedDataVersion.V1;
    //     if (opts.version && isSignTypedDataVersion(opts.version)) {
    //         version = eth_sig_util_1.SignTypedDataVersion[opts.version];
    //     }
    //     const privateKey = __classPrivateFieldGet(this, _RemoteKeyring_instances, "m", _RemoteKeyring_getPrivateKeyFor).call(this, address, opts);
    //     return (0, eth_sig_util_1.signTypedData)({ privateKey, data: typedData, version });
    // }
    // // get public key for nacl
    // async getEncryptionPublicKey(withAccount, opts) {
    //     const privKey = __classPrivateFieldGet(this, _RemoteKeyring_instances, "m", _RemoteKeyring_getPrivateKeyFor).call(this, withAccount, opts);
    //     const publicKey = (0, eth_sig_util_1.getEncryptionPublicKey)(privKey.toString('hex'));
    //     return publicKey;
    // }
    // // returns an address specific to an app
    // async getAppKeyAddress(address, origin) {
    //     if (!origin || typeof origin !== 'string') {
    //         throw new Error(`'origin' must be a non-empty string`);
    //     }
    //     const wallet = __classPrivateFieldGet(this, _RemoteKeyring_instances, "m", _RemoteKeyring_getWalletForAccount).call(this, address, {
    //         withAppKeyOrigin: origin,
    //     });
    //     const appKeyAddress = (0, utils_1.add0x)((0, util_1.bufferToHex)((0, util_1.publicToAddress)(wallet.publicKey)));
    //     return appKeyAddress;
    // }
    // // exportAccount should return a hex-encoded private key:
    // async exportAccount(address, opts = { withAppKeyOrigin: '' }) {
    //     const wallet = __classPrivateFieldGet(this, _RemoteKeyring_instances, "m", _RemoteKeyring_getWalletForAccount).call(this, address, opts);
    //     return wallet.privateKey.toString('hex');
    // }
    removeAccount(address) {
        if (!__classPrivateFieldGet(this, _RemoteKeyring_wallets, "f")
            .map(({ publicKey }) => (0, util_1.bufferToHex)((0, util_1.publicToAddress)(publicKey)).toLowerCase())
            .includes(address.toLowerCase())) {
            throw new Error(`Address ${address} not found in this keyring`);
        }
        __classPrivateFieldSet(this, _RemoteKeyring_wallets, __classPrivateFieldGet(this, _RemoteKeyring_wallets, "f").filter(({ publicKey }) => (0, util_1.bufferToHex)((0, util_1.publicToAddress)(publicKey)).toLowerCase() !==
            address.toLowerCase()), "f");
    }
}
exports.RemoteKeyring = RemoteKeyring;
_RemoteKeyring_wallets = new WeakMap(), _RemoteKeyring_instances = new WeakSet(), _RemoteKeyring_getPrivateKeyFor = function _RemoteKeyring_getPrivateKeyFor(address, opts = { withAppKeyOrigin: '' }) {
    if (!address) {
        throw new Error('Must specify address.');
    }
    const wallet = __classPrivateFieldGet(this, _RemoteKeyring_instances, "m", _RemoteKeyring_getWalletForAccount).call(this, address, opts);
    return wallet.privateKey;
}, _RemoteKeyring_getWalletForAccount = function _RemoteKeyring_getWalletForAccount(account, opts = {}) {
    const address = (0, eth_sig_util_1.normalize)(account);
    let wallet = __classPrivateFieldGet(this, _RemoteKeyring_wallets, "f").find(({ publicKey }) => (0, util_1.bufferToHex)((0, util_1.publicToAddress)(publicKey)) === address);
    if (!wallet) {
        throw new Error('Simple Keyring - Unable to find matching address.');
    }
    if (opts.withAppKeyOrigin) {
        const { privateKey } = wallet;
        const appKeyOriginBuffer = Buffer.from(opts.withAppKeyOrigin, 'utf8');
        const appKeyBuffer = Buffer.concat([privateKey, appKeyOriginBuffer]);
        const appKeyPrivateKey = (0, util_1.arrToBufArr)((0, keccak_1.keccak256)(appKeyBuffer));
        const appKeyPublicKey = (0, util_1.privateToPublic)(appKeyPrivateKey);
        wallet = { privateKey: appKeyPrivateKey, publicKey: appKeyPublicKey };
    }
    return wallet;
};
RemoteKeyring.type = TYPE;
/**
 * Generate and validate a new random key of 32 bytes.
 *
 * @returns Buffer The generated key.
 */
function generateKey() {
    const privateKey = (0, randombytes_1.default)(32);
    if (!(0, util_1.isValidPrivate)(privateKey)) {
        throw new Error('Private key does not satisfy the curve requirements (ie. it is invalid)');
    }
    return privateKey;
}
/**
 * Type predicate type guard to check if a string is in the enum SignTypedDataVersion.
 *
 * @param version - The string to check.
 * @returns Whether it's in the enum.
 */
// TODO: Put this in @metamask/eth-sig-util
function isSignTypedDataVersion(version) {
    return version in eth_sig_util_1.SignTypedDataVersion;
}
//# sourceMappingURL=simple-keyring.js.map