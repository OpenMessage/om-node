import 'source-map-support/register'
import * as Joi from '@hapi/joi'
import Wreck from '@hapi/wreck';

enum AuthStatus {
    Unauthorized,
    Authorizing,
    Authorized
}

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

const requestBuffer = [];

export class OM {

    baseUrl: string;
    apiKey: string;
    apiSecret: string;
    token?: string;
    authstatus: AuthStatus;

    constructor(apiKey: string, apiSecret: string, baseUrl?: string) {

        if(!apiKey || !apiSecret) {
            throw new Error('credentials are required');
        }

        this.baseUrl = baseUrl || 'https://api.omsg.io';
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;

        this.authstatus = AuthStatus.Authorizing;

        this.authorize().then((token: string) => {

            this.token = token;
            this.authstatus = AuthStatus.Authorized;
        });
    }

    untilAuthorizationIsDone () {
        return new Promise((resolve) => {
            const checker = setInterval(() => {
                if (AuthStatus.Authorized === this.authstatus) {
                    clearInterval(checker);
                    resolve(true);
                }
            }, 100);
        });
    }

    async createContact(contact: object) {

        Joi.assert(contact, schemas.createContact, '[OM] Create Contact', { allowUnknown: true });

        if (AuthStatus.Authorizing === this.authstatus) {
            await this.untilAuthorizationIsDone();
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
            this.token = payload.accessToken;
            console.log('[OM] - Authorized', payload.accessToken);
        }

        return payload.accessToken;
    };

};

