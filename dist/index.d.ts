import 'source-map-support/register';
declare enum AuthStatus {
    Unauthorized = 0,
    Authorizing = 1,
    Authorized = 2
}
export declare class OM {
    baseUrl: string;
    apiKey: string;
    apiSecret: string;
    token?: string;
    authstatus: AuthStatus;
    constructor(apiKey: string, apiSecret: string, baseUrl?: string);
    untilAuthorizationIsDone(): Promise<unknown>;
    createContact(contact: object): Promise<any>;
    authorize(): Promise<any>;
}
export {};
