import type { LnUrlPayServiceArgs, LnUrlPayServiceResponse } from './types';
export declare const requestPayServiceParams: ({ lnUrlOrAddress, onionAllowed, fetchGet, }: LnUrlPayServiceArgs) => Promise<LnUrlPayServiceResponse>;
