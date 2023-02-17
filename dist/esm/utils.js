import { __awaiter, __generator } from "tslib";
import isURL from 'is-url';
import { bech32 } from 'bech32';
import axios from 'axios';
import aesjs from 'aes-js';
import Base64 from 'base64-js';
import * as bolt11 from 'bolt11';
import { Sha256 } from '@aws-crypto/sha256-js';
var LNURL_REGEX = /^(?:http.*[&?]lightning=|lightning:)?(lnurl[0-9]{1,}[02-9ac-hj-np-z]+)/;
var LN_ADDRESS_REGEX = /^((?:[^<>()\[\]\\.,;:\s@"]+(?:\.[^<>()\[\]\\.,;:\s@"]+)*)|(?:".+"))@((?:\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(?:(?:[a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var ONION_REGEX = /^(http:\/\/[^/:@]+\.onion(?::\d{1,5})?)(\/.*)?$/;
/**
 * Decode a bech32 encoded url (lnurl) or lightning address and return a url
 * @method decodeUrlOrAddress
 * @param  lnUrlOrAddress string to decode
 * @return  plain url or null if is an invalid url or lightning address
 */
export var decodeUrlOrAddress = function (lnUrlOrAddress) {
    var bech32Url = parseLnUrl(lnUrlOrAddress);
    if (bech32Url) {
        var decoded = bech32.decode(bech32Url, 20000);
        return Buffer.from(bech32.fromWords(decoded.words)).toString();
    }
    var address = parseLightningAddress(lnUrlOrAddress);
    if (address) {
        var username = address.username, domain = address.domain;
        var protocol = domain.match(/\.onion$/) ? 'http' : 'https';
        return "".concat(protocol, "://").concat(domain, "/.well-known/lnurlp/").concat(username);
    }
    return null;
};
/**
 * Parse an url and return a bech32 encoded url (lnurl)
 * @method parseLnUrl
 * @param  url string to parse
 * @return  bech32 encoded url (lnurl) or null if is an invalid url
 */
export var parseLnUrl = function (url) {
    if (!url)
        return null;
    var result = LNURL_REGEX.exec(url.toLowerCase());
    return result ? result[1] : null;
};
/**
 * Verify if a string is a valid lnurl value
 * @method isLnurl
 * @param  url string to validate
 * @return  true if is a valid lnurl value
 */
export var isLnurl = function (url) {
    if (!url)
        return false;
    return LNURL_REGEX.test(url.toLowerCase());
};
/**
 * Verify if a string is a lightning adress
 * @method isLightningAddress
 * @param  address string to validate
 * @return  true if is a lightning address
 */
export var isLightningAddress = function (address) {
    if (!address)
        return false;
    return LN_ADDRESS_REGEX.test(address);
};
/**
 * Parse an address and return username and domain
 * @method parseLightningAddress
 * @param  address string to parse
 * @return  LightningAddress { username, domain }
 */
export var parseLightningAddress = function (address) {
    if (!address)
        return null;
    var result = LN_ADDRESS_REGEX.exec(address);
    return result ? { username: result[1], domain: result[2] } : null;
};
/**
 * Verify if a string is an url
 * @method isUrl
 * @param  url string to validate
 * @return  true if is an url
 */
export var isUrl = function (url) {
    if (!url)
        return false;
    try {
        return isURL(url);
    }
    catch (_a) {
        return false;
    }
};
/**
 * Verify if a string is an onion url
 * @method isOnionUrl
 * @param  url string to validate
 * @return  true if is an onion url
 */
export var isOnionUrl = function (url) {
    return isUrl(url) && ONION_REGEX.test(url.toLowerCase());
};
/**
 * Parse a number to Satoshis
 * @method checkedToSats
 * @param  value number to parse
 * @return  Satoshis or null
 */
export var checkedToSats = function (value) {
    if (value && value >= 0)
        return toSats(value);
    return null;
};
/**
 * Cast a number to Satoshis type
 * @method toSats
 * @param  value number to cast
 * @return  Satoshis
 */
export var toSats = function (value) {
    return value;
};
export var isValidAmount = function (_a) {
    var amount = _a.amount, min = _a.min, max = _a.max;
    var isValid = amount > 0 && amount >= min && amount <= max;
    var isFixed = min === max;
    return isValid && isFixed ? amount === min : isValid;
};
export var getJson = function (_a) {
    var url = _a.url, params = _a.params;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            return [2 /*return*/, axios.get(url, { params: params }).then(function (response) {
                    if (response.data.status === 'ERROR')
                        throw new Error(response.data.reason + '');
                    return response.data;
                })];
        });
    });
};
export var sha256 = function (data, encoding) {
    if (encoding === void 0) { encoding = 'hex'; }
    var sha256 = new Sha256();
    sha256.update(Buffer.from(data, encoding));
    return Buffer.from(sha256.digestSync()).toString('hex');
};
export var decodeInvoice = function (invoice) {
    if (!invoice)
        return null;
    try {
        var network = undefined;
        // hack to support signet invoices, remove when it is supported in bolt11
        if (invoice.startsWith('lntbs')) {
            network = {
                bech32: 'tbs',
                pubKeyHash: 0x6f,
                scriptHash: 0xc4,
                validWitnessVersions: [0, 1],
            };
        }
        return bolt11.decode(invoice, network);
    }
    catch (_a) {
        return null;
    }
};
export var getHashFromInvoice = function (invoice) {
    if (!invoice)
        return null;
    try {
        var decoded = decodeInvoice(invoice);
        if (!decoded || !decoded.tags)
            return null;
        var hashTag = decoded.tags.find(function (value) { return value.tagName === 'payment_hash'; });
        if (!hashTag || !hashTag.data)
            return null;
        return hashTag.data.toString();
    }
    catch (_a) {
        return null;
    }
};
export var isValidPreimage = function (_a) {
    var invoice = _a.invoice, preimage = _a.preimage;
    if (!invoice || !preimage)
        return false;
    var invoiceHash = getHashFromInvoice(invoice);
    if (!invoiceHash)
        return false;
    try {
        var preimageHash = sha256(preimage);
        return invoiceHash === preimageHash;
    }
    catch (_b) {
        return false;
    }
};
export var decipherAES = function (_a) {
    var successAction = _a.successAction, preimage = _a.preimage;
    if (successAction.tag !== 'aes' ||
        !successAction.iv ||
        !successAction.ciphertext ||
        !preimage)
        return null;
    var key = aesjs.utils.hex.toBytes(preimage);
    var iv = Base64.toByteArray(successAction.iv);
    var ciphertext = Base64.toByteArray(successAction.ciphertext);
    var cbc = new aesjs.ModeOfOperation.cbc(key, iv);
    var plaintext = cbc.decrypt(ciphertext);
    // remove padding
    var size = plaintext.length;
    var pad = plaintext[size - 1];
    plaintext = plaintext.slice(0, size - pad);
    return aesjs.utils.utf8.fromBytes(plaintext);
};
