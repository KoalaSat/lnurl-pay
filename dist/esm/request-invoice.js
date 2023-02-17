import { __awaiter, __generator } from "tslib";
import { decipherAES, decodeInvoice, getJson, isOnionUrl, isUrl, isValidAmount, isValidPreimage, } from './utils';
import { requestPayServiceParams } from './request-pay-service-params';
export var requestInvoiceWithServiceParams = function (_a) {
    var params = _a.params, tokens = _a.tokens, comment = _a.comment, nostr = _a.nostr, _b = _a.onionAllowed, onionAllowed = _b === void 0 ? false : _b, _c = _a.validateInvoice, validateInvoice = _c === void 0 ? false : _c, _d = _a.fetchGet, fetchGet = _d === void 0 ? getJson : _d;
    return __awaiter(void 0, void 0, void 0, function () {
        var callback, commentAllowed, min, max, invoiceParams, data, invoice, decodedInvoice, descriptionHash, hasValidDescriptionHash, hasValidAmount, successAction, decipher;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    callback = params.callback, commentAllowed = params.commentAllowed, min = params.min, max = params.max;
                    if (!isValidAmount({ amount: tokens, min: min, max: max }))
                        throw new Error('Invalid amount');
                    if (!isUrl(callback))
                        throw new Error('Callback must be a valid url');
                    if (!onionAllowed && isOnionUrl(callback))
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
                    decodedInvoice = decodeInvoice(invoice);
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
                            return decipherAES({ preimage: preimage, successAction: data.successAction });
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
                                return isValidPreimage({ invoice: invoice, preimage: preimage });
                            },
                        }];
            }
        });
    });
};
export var requestInvoice = function (_a) {
    var lnUrlOrAddress = _a.lnUrlOrAddress, tokens = _a.tokens, comment = _a.comment, nostr = _a.nostr, _b = _a.onionAllowed, onionAllowed = _b === void 0 ? false : _b, _c = _a.validateInvoice, validateInvoice = _c === void 0 ? false : _c, _d = _a.fetchGet, fetchGet = _d === void 0 ? getJson : _d;
    return __awaiter(void 0, void 0, void 0, function () {
        var params;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, requestPayServiceParams({
                        lnUrlOrAddress: lnUrlOrAddress,
                        onionAllowed: onionAllowed,
                        fetchGet: fetchGet,
                    })];
                case 1:
                    params = _e.sent();
                    return [2 /*return*/, requestInvoiceWithServiceParams({
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
