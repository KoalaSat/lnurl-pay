import type { LnUrlRequestInvoiceArgs, LnUrlRequestInvoiceResponse, LnUrlrequestInvoiceWithServiceParamsArgs } from './types';
export declare const requestInvoiceWithServiceParams: ({ params, tokens, comment, nostr, onionAllowed, validateInvoice, fetchGet, }: LnUrlrequestInvoiceWithServiceParamsArgs) => Promise<LnUrlRequestInvoiceResponse>;
export declare const requestInvoice: ({ lnUrlOrAddress, tokens, comment, nostr, onionAllowed, validateInvoice, fetchGet, }: LnUrlRequestInvoiceArgs) => Promise<LnUrlRequestInvoiceResponse>;
