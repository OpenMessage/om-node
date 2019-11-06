import 'source-map-support/register';
export declare class OM {
    baseUrl: string;
    apiKey: string;
    apiSecret: string;
    token?: string;
    authorized: boolean;
    constructor(apiKey: string, apiSecret: string, baseUrl: string);
    createContact(contact: object): Promise<any>;
    authorize(): Promise<any>;
}
