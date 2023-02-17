/// <reference types="node" />
import * as bolt11 from 'bolt11';
import type { LightningAddress, LNURLPaySuccessAction, Satoshis } from './types';
/**
 * Decode a bech32 encoded url (lnurl) or lightning address and return a url
 * @method decodeUrlOrAddress
 * @param  lnUrlOrAddress string to decode
 * @return  plain url or null if is an invalid url or lightning address
 */
export declare const decodeUrlOrAddress: (lnUrlOrAddress: string) => string | null;
/**
 * Parse an url and return a bech32 encoded url (lnurl)
 * @method parseLnUrl
 * @param  url string to parse
 * @return  bech32 encoded url (lnurl) or null if is an invalid url
 */
export declare const parseLnUrl: (url: string) => string | null;
/**
 * Verify if a string is a valid lnurl value
 * @method isLnurl
 * @param  url string to validate
 * @return  true if is a valid lnurl value
 */
export declare const isLnurl: (url: string) => boolean;
/**
 * Verify if a string is a lightning adress
 * @method isLightningAddress
 * @param  address string to validate
 * @return  true if is a lightning address
 */
export declare const isLightningAddress: (address: string) => boolean;
/**
 * Parse an address and return username and domain
 * @method parseLightningAddress
 * @param  address string to parse
 * @return  LightningAddress { username, domain }
 */
export declare const parseLightningAddress: (address: string) => LightningAddress | null;
/**
 * Verify if a string is an url
 * @method isUrl
 * @param  url string to validate
 * @return  true if is an url
 */
export declare const isUrl: (url: string | null) => url is string;
/**
 * Verify if a string is an onion url
 * @method isOnionUrl
 * @param  url string to validate
 * @return  true if is an onion url
 */
export declare const isOnionUrl: (url: string | null) => boolean;
/**
 * Parse a number to Satoshis
 * @method checkedToSats
 * @param  value number to parse
 * @return  Satoshis or null
 */
export declare const checkedToSats: (value: number) => Satoshis | null;
/**
 * Cast a number to Satoshis type
 * @method toSats
 * @param  value number to cast
 * @return  Satoshis
 */
export declare const toSats: (value: number) => Satoshis;
export declare const isValidAmount: ({ amount, min, max, }: {
    amount: number;
    min: number;
    max: number;
}) => boolean;
export declare const getJson: ({ url, params, }: {
    url: string;
    params?: {
        [key: string]: string | number;
    } | undefined;
}) => Promise<{
    [key: string]: string | number;
}>;
export declare const sha256: (data: string, encoding?: BufferEncoding) => string;
export declare const decodeInvoice: (invoice: string) => (bolt11.PaymentRequestObject & {
    tagsObject: bolt11.TagsObject;
}) | null;
export declare const getHashFromInvoice: (invoice: string) => string | null;
export declare const isValidPreimage: ({ invoice, preimage, }: {
    invoice: string;
    preimage: string;
}) => boolean;
export declare const decipherAES: ({ successAction, preimage, }: {
    successAction: LNURLPaySuccessAction;
    preimage: string;
}) => string | null;
