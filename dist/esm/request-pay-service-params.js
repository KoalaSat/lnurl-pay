import { __awaiter, __generator } from "tslib";
import { decodeUrlOrAddress, isOnionUrl, checkedToSats, getJson, isUrl, sha256, } from './utils';
var TAG_PAY_REQUEST = 'payRequest';
export var requestPayServiceParams = function (_a) {
    var lnUrlOrAddress = _a.lnUrlOrAddress, _b = _a.onionAllowed, onionAllowed = _b === void 0 ? false : _b, _c = _a.fetchGet, fetchGet = _c === void 0 ? getJson : _c;
    return __awaiter(void 0, void 0, void 0, function () {
        var url, json, params;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    url = decodeUrlOrAddress(lnUrlOrAddress);
                    if (!isUrl(url))
                        throw new Error('Invalid lnUrlOrAddress');
                    if (!onionAllowed && isOnionUrl(url))
                        throw new Error('Onion requests not allowed');
                    return [4 /*yield*/, fetchGet({ url: url })];
                case 1:
                    json = _d.sent();
                    params = parseLnUrlPayServiceResponse(json);
                    if (!params)
                        throw new Error('Invalid pay service params');
                    return [2 /*return*/, params];
            }
        });
    });
};
/**
 * Parse the ln service response to LnUrlPayServiceResponse
 * @method parseLnUrlPayServiceResponse
 * @param  data object to parse
 * @return  LnUrlPayServiceResponse
 */
var parseLnUrlPayServiceResponse = function (data) {
    if (data.tag !== TAG_PAY_REQUEST)
        return null;
    var callback = (data.callback + '').trim();
    if (!isUrl(callback))
        return null;
    var min = checkedToSats(Math.ceil(Number(data.minSendable || 0) / 1000));
    var max = checkedToSats(Math.floor(Number(data.maxSendable) / 1000));
    if (!(min && max) || min > max)
        return null;
    var metadata;
    var metadataHash;
    try {
        metadata = JSON.parse(data.metadata + '');
        metadataHash = sha256(data.metadata + '', 'utf8');
    }
    catch (_a) {
        metadata = [];
        metadataHash = sha256('[]', 'utf8');
    }
    var image = '';
    var description = '';
    var identifier = '';
    for (var i = 0; i < metadata.length; i++) {
        var _b = metadata[i], k = _b[0], v = _b[1];
        switch (k) {
            case 'text/plain':
                description = v;
                break;
            case 'text/identifier':
                identifier = v;
                break;
            case 'image/png;base64':
            case 'image/jpeg;base64':
                image = 'data:' + k + ',' + v;
                break;
        }
    }
    var domain;
    try {
        domain = new URL(callback).hostname;
    }
    catch (_c) {
        // fail silently and let domain remain undefined if callback is not a valid URL
    }
    return {
        callback: callback,
        fixed: min === max,
        min: min,
        max: max,
        domain: domain,
        metadata: metadata,
        metadataHash: metadataHash,
        identifier: identifier,
        description: description,
        image: image,
        commentAllowed: Number(data.commentAllowed) || 0,
        rawData: data,
    };
};
