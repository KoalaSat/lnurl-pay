"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decipherAES = exports.isValidPreimage = exports.getHashFromInvoice = exports.decodeInvoice = exports.sha256 = exports.getJson = exports.isValidAmount = exports.toSats = exports.checkedToSats = exports.isOnionUrl = exports.isUrl = exports.parseLightningAddress = exports.isLightningAddress = exports.isLnurl = exports.parseLnUrl = exports.decodeUrlOrAddress = void 0;
var tslib_1 = require("tslib");
var is_url_1 = tslib_1.__importDefault(require("is-url"));
var bech32_1 = require("bech32");
var axios_1 = tslib_1.__importDefault(require("axios"));
var aes_js_1 = tslib_1.__importDefault(require("aes-js"));
var base64_js_1 = tslib_1.__importDefault(require("base64-js"));
var bolt11 = tslib_1.__importStar(require("bolt11"));
var sha256_js_1 = require("@aws-crypto/sha256-js");
var LNURL_REGEX = /^(?:http.*[&?]lightning=|lightning:)?(lnurl[0-9]{1,}[02-9ac-hj-np-z]+)/;
var LN_ADDRESS_REGEX = /^((?:[^<>()\[\]\\.,;:\s@"]+(?:\.[^<>()\[\]\\.,;:\s@"]+)*)|(?:".+"))@((?:\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(?:(?:[a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var ONION_REGEX = /^(http:\/\/[^/:@]+\.onion(?::\d{1,5})?)(\/.*)?$/;
/**
 * Decode a bech32 encoded url (lnurl) or lightning address and return a url
 * @method decodeUrlOrAddress
 * @param  lnUrlOrAddress string to decode
 * @return  plain url or null if is an invalid url or lightning address
 */
var decodeUrlOrAddress = function (lnUrlOrAddress) {
    var bech32Url = (0, exports.parseLnUrl)(lnUrlOrAddress);
    if (bech32Url) {
        var decoded = bech32_1.bech32.decode(bech32Url, 20000);
        return Buffer.from(bech32_1.bech32.fromWords(decoded.words)).toString();
    }
    var address = (0, exports.parseLightningAddress)(lnUrlOrAddress);
    if (address) {
        var username = address.username, domain = address.domain;
        var protocol = domain.match(/\.onion$/) ? 'http' : 'https';
        return "".concat(protocol, "://").concat(domain, "/.well-known/lnurlp/").concat(username);
    }
    return null;
};
exports.decodeUrlOrAddress = decodeUrlOrAddress;
/**
 * Parse an url and return a bech32 encoded url (lnurl)
 * @method parseLnUrl
 * @param  url string to parse
 * @return  bech32 encoded url (lnurl) or null if is an invalid url
 */
var parseLnUrl = function (url) {
    if (!url)
        return null;
    var result = LNURL_REGEX.exec(url.toLowerCase());
    return result ? result[1] : null;
};
exports.parseLnUrl = parseLnUrl;
/**
 * Verify if a string is a valid lnurl value
 * @method isLnurl
 * @param  url string to validate
 * @return  true if is a valid lnurl value
 */
var isLnurl = function (url) {
    if (!url)
        return false;
    return LNURL_REGEX.test(url.toLowerCase());
};
exports.isLnurl = isLnurl;
/**
 * Verify if a string is a lightning adress
 * @method isLightningAddress
 * @param  address string to validate
 * @return  true if is a lightning address
 */
var isLightningAddress = function (address) {
    if (!address)
        return false;
    return LN_ADDRESS_REGEX.test(address);
};
exports.isLightningAddress = isLightningAddress;
/**
 * Parse an address and return username and domain
 * @method parseLightningAddress
 * @param  address string to parse
 * @return  LightningAddress { username, domain }
 */
var parseLightningAddress = function (address) {
    if (!address)
        return null;
    var result = LN_ADDRESS_REGEX.exec(address);
    return result ? { username: result[1], domain: result[2] } : null;
};
exports.parseLightningAddress = parseLightningAddress;
/**
 * Verify if a string is an url
 * @method isUrl
 * @param  url string to validate
 * @return  true if is an url
 */
var isUrl = function (url) {
    if (!url)
        return false;
    try {
        return (0, is_url_1.default)(url);
    }
    catch (_a) {
        return false;
    }
};
exports.isUrl = isUrl;
/**
 * Verify if a string is an onion url
 * @method isOnionUrl
 * @param  url string to validate
 * @return  true if is an onion url
 */
var isOnionUrl = function (url) {
    return (0, exports.isUrl)(url) && ONION_REGEX.test(url.toLowerCase());
};
exports.isOnionUrl = isOnionUrl;
/**
 * Parse a number to Satoshis
 * @method checkedToSats
 * @param  value number to parse
 * @return  Satoshis or null
 */
var checkedToSats = function (value) {
    if (value && value >= 0)
        return (0, exports.toSats)(value);
    return null;
};
exports.checkedToSats = checkedToSats;
/**
 * Cast a number to Satoshis type
 * @method toSats
 * @param  value number to cast
 * @return  Satoshis
 */
var toSats = function (value) {
    return value;
};
exports.toSats = toSats;
var isValidAmount = function (_a) {
    var amount = _a.amount, min = _a.min, max = _a.max;
    var isValid = amount > 0 && amount >= min && amount <= max;
    var isFixed = min === max;
    return isValid && isFixed ? amount === min : isValid;
};
exports.isValidAmount = isValidAmount;
var getJson = function (_a) {
    var url = _a.url, params = _a.params;
    return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_b) {
            return [2 /*return*/, axios_1.default.get(url, { params: params }).then(function (response) {
                    if (response.data.status === 'ERROR')
                        throw new Error(response.data.reason + '');
                    return response.data;
                })];
        });
    });
};
exports.getJson = getJson;
var sha256 = function (data, encoding) {
    if (encoding === void 0) { encoding = 'hex'; }
    var sha256 = new sha256_js_1.Sha256();
    sha256.update(Buffer.from(data, encoding));
    return Buffer.from(sha256.digestSync()).toString('hex');
};
exports.sha256 = sha256;
var decodeInvoice = function (invoice) {
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
exports.decodeInvoice = decodeInvoice;
var getHashFromInvoice = function (invoice) {
    if (!invoice)
        return null;
    try {
        var decoded = (0, exports.decodeInvoice)(invoice);
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
exports.getHashFromInvoice = getHashFromInvoice;
var isValidPreimage = function (_a) {
    var invoice = _a.invoice, preimage = _a.preimage;
    if (!invoice || !preimage)
        return false;
    var invoiceHash = (0, exports.getHashFromInvoice)(invoice);
    if (!invoiceHash)
        return false;
    try {
        var preimageHash = (0, exports.sha256)(preimage);
        return invoiceHash === preimageHash;
    }
    catch (_b) {
        return false;
    }
};
exports.isValidPreimage = isValidPreimage;
var decipherAES = function (_a) {
    var successAction = _a.successAction, preimage = _a.preimage;
    if (successAction.tag !== 'aes' ||
        !successAction.iv ||
        !successAction.ciphertext ||
        !preimage)
        return null;
    var key = aes_js_1.default.utils.hex.toBytes(preimage);
    var iv = base64_js_1.default.toByteArray(successAction.iv);
    var ciphertext = base64_js_1.default.toByteArray(successAction.ciphertext);
    var cbc = new aes_js_1.default.ModeOfOperation.cbc(key, iv);
    var plaintext = cbc.decrypt(ciphertext);
    // remove padding
    var size = plaintext.length;
    var pad = plaintext[size - 1];
    plaintext = plaintext.slice(0, size - pad);
    return aes_js_1.default.utils.utf8.fromBytes(plaintext);
};
exports.decipherAES = decipherAES;
