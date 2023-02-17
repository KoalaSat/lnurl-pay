"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestInvoice = exports.requestInvoiceWithServiceParams = void 0;
var tslib_1 = require("tslib");
var utils_1 = require("./utils");
var request_pay_service_params_1 = require("./request-pay-service-params");
var requestInvoiceWithServiceParams = function (_a) {
    var params = _a.params, tokens = _a.tokens, comment = _a.comment, nostr = _a.nostr, _b = _a.onionAllowed, onionAllowed = _b === void 0 ? false : _b, _c = _a.validateInvoice, validateInvoice = _c === void 0 ? false : _c, _d = _a.fetchGet, fetchGet = _d === void 0 ? utils_1.getJson : _d;
    return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var callback, commentAllowed, min, max, invoiceParams, data, invoice, decodedInvoice, descriptionHash, hasValidDescriptionHash, hasValidAmount, successAction, decipher;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    callback = params.callback, commentAllowed = params.commentAllowed, min = params.min, max = params.max;
                    if (!(0, utils_1.isValidAmount)({ amount: tokens, min: min, max: max }))
                        throw new Error('Invalid amount');
                    if (!(0, utils_1.isUrl)(callback))
                        throw new Error('Callback must be a valid url');
                    if (!onionAllowed && (0, utils_1.isOnionUrl)(callback))
                        throw new Error('Onion requests not allowed');
                    invoiceParams = {
                        amount: tokens * 1000,
                    };
                    if (comment && commentAllowed > 0 && comment.length > commentAllowed)
                        throw new Error("The comment length must be ".concat(commentAllowed, " characters or fewer"));
                    if (comment)
                        invoiceParams.comment = comment;
                    if (nostr)
                        invoiceParams.nostr = nostr;
                    return [4 /*yield*/, fetchGet({ url: callback, params: invoiceParams })];
                case 1:
                    data = _e.sent();
                    invoice = data && data.pr && data.pr.toString();
                    if (!invoice)
                        throw new Error('Invalid pay service invoice');
                    decodedInvoice = (0, utils_1.decodeInvoice)(invoice);
                    descriptionHash = decodedInvoice === null || decodedInvoice === void 0 ? void 0 : decodedInvoice.tags.find(function (t) { return t.tagName === 'purpose_commit_hash'; });
                    hasValidDescriptionHash = descriptionHash
                        ? params.metadataHash === descriptionHash.data
                        : false;
                    if (validateInvoice && !hasValidDescriptionHash)
                        throw new Error("Invoice description hash doesn't match metadata hash.");
                    hasValidAmount = decodedInvoice
                        ? decodedInvoice.satoshis === tokens
                        : false;
                    if (validateInvoice && !hasValidAmount)
                        throw new Error("Invalid invoice amount ".concat(decodedInvoice === null || decodedInvoice === void 0 ? void 0 : decodedInvoice.satoshis, ". Expected ").concat(tokens));
                    successAction = undefined;
                    if (data.successAction) {
                        decipher = function (preimage) {
                            return (0, utils_1.decipherAES)({ preimage: preimage, successAction: data.successAction });
                        };
                        successAction = Object.assign({ decipher: decipher }, data.successAction);
                    }
                    return [2 /*return*/, {
                            params: params,
                            invoice: invoice,
                            successAction: successAction,
                            hasValidAmount: hasValidAmount,
                            hasValidDescriptionHash: hasValidDescriptionHash,
                            validatePreimage: function (preimage) {
                                return (0, utils_1.isValidPreimage)({ invoice: invoice, preimage: preimage });
                            },
                        }];
            }
        });
    });
};
exports.requestInvoiceWithServiceParams = requestInvoiceWithServiceParams;
var requestInvoice = function (_a) {
    var lnUrlOrAddress = _a.lnUrlOrAddress, tokens = _a.tokens, comment = _a.comment, nostr = _a.nostr, _b = _a.onionAllowed, onionAllowed = _b === void 0 ? false : _b, _c = _a.validateInvoice, validateInvoice = _c === void 0 ? false : _c, _d = _a.fetchGet, fetchGet = _d === void 0 ? utils_1.getJson : _d;
    return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var params;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, request_pay_service_params_1.requestPayServiceParams)({
                        lnUrlOrAddress: lnUrlOrAddress,
                        onionAllowed: onionAllowed,
                        fetchGet: fetchGet,
                    })];
                case 1:
                    params = _e.sent();
                    return [2 /*return*/, (0, exports.requestInvoiceWithServiceParams)({
                            params: params,
                            tokens: tokens,
                            comment: comment,
                            nostr: nostr,
                            onionAllowed: onionAllowed,
                            validateInvoice: validateInvoice,
                            fetchGet: fetchGet,
                        })];
            }
        });
    });
};
exports.requestInvoice = requestInvoice;
