import 'source-map-support/register';
export declare class OM {
    baseUrl: string;
    constructor(apiKey: string, apiSecret: string, baseUrl: string);
    createContact(contact: object): Promise<any>;
}
