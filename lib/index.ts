import 'source-map-support/register'
import * as Joi from '@hapi/joi'
import * as API from './api';

const internals = {
    phone: /^\+(?:[0-9]?){6,14}[0-9]$/
};

const schemas = {
    createContact: Joi.object({
        phone: Joi.string().regex(internals.phone).required()
    }).required()
};

export class OM {

    baseUrl: string;

    constructor(apiKey: string, apiSecret: string, baseUrl: string) {

        if(!apiKey || !apiSecret) {
            throw new Error('credentials are required');
        }

        this.baseUrl = baseUrl || 'https://api.omsg.io/auth/token';
    }

    async createContact(contact: object) {

        Joi.assert(contact, schemas.createContact, '[OM] Create Contact', ), { allowUnknown: true };

        return await API.createContact(contact);
    };

};

