import 'source-map-support/register'
import * as Joi from '@hapi/joi'
import Wreck from '@hapi/wreck';

const internals = {
    phone: /^\+(?:[0-9]?){6,14}[0-9]$/
};

const schemas = {
    createContact: Joi.object({
        phone: Joi.string().regex(internals.phone).required()
    }).required()
};

const wreck = Wreck.defaults({
    json: true
});

export class OM {

    baseUrl: string;
    apiKey: string;
    apiSecret: string;
    token?: string;
    authorized: boolean;

    constructor(apiKey: string, apiSecret: string, baseUrl?: string) {

        if(!apiKey || !apiSecret) {
            throw new Error('credentials are required');
        }

        this.baseUrl = baseUrl || 'https://api.omsg.io/auth/token';
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.authorized = false;

        this.authorize().then((token: string) => {

            this.token = token;
        });
    }

    async createContact(contact: object) {

        Joi.assert(contact, schemas.createContact, '[OM] Create Contact', { allowUnknown: true });

        if(!this.authorized) {
            throw new Error('[OM] Not authorized');
        }

        const { payload } = await wreck.post(`${this.baseUrl}/contacts`, {
            payload: contact,
            headers: {
                authorization: `Bearer ${this.token}`
            }
        });

        return payload;
    };

    async authorize() {

        const { payload } = await wreck.post(`${this.baseUrl}/auth/token`, {
            payload: {
                apiKey: this.apiKey,
                apiSecret: this.apiSecret
            }
        });

        if(payload.accessToken) {
            this.authorized = true;
            this.token = payload.accessToken;
            console.log('[OM] - Authorized', payload.accessToken);
        }

        return payload.accessToken;
    };

};

