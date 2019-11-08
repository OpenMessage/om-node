import 'source-map-support/register';
export declare function OM(apiKey: string, apiSecret: string, baseUrl?: string): Promise<{
    createContact: (contact: object) => Promise<any>;
}>;
