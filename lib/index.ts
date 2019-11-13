import 'source-map-support/register'
import * as Joi from '@hapi/joi'
import Wreck from '@hapi/wreck';

const internals = {
    phone: /^\+(?:[0-9]?){6,14}[0-9]$/
};

const schemas = {
    createContact: Joi.object({
        phone: Joi.string().regex(internals.phone).required()
    }).required(),
    sendMessage: Joi.object().keys({
        templateId: Joi.number().integer().positive().allow(null),
        contactId: Joi.number().integer().positive().allow(null),
        phone: Joi.string().allow(null),
        context: Joi.object().keys({
            text: Joi.string().allow(null)
        }).default({}).unknown(true)
    })
};

const wreck = Wreck.defaults({
    json: true
});

export async function OM (
        apiKey: string,
        apiSecret: string,
        baseUrl: string = 'https://api.omsg.io'
    ) {

    if(!apiKey || !apiSecret) {
        throw new Error('credentials are required');
    }

    const result: any = await wreck.post(`${baseUrl}/auth/token`, {
        payload: { apiKey, apiSecret }
    });

    const token = result.payload.accessToken;

    return {

        createContact: async (contact: object) => {

            Joi.assert(contact, schemas.createContact, '[OM] Create Contact', { allowUnknown: true });

            const { payload } = await wreck.post(`${baseUrl}/contacts`, {
                payload: contact,
                headers: {
                    authorization: `Bearer ${token}`
                }
            });

            return payload;
        },
        sendMessage: async (message: object) => {
            
            Joi.assert(message, schemas.sendMessage, '[OM] Send Message', { allowUnknown: true });

            const { payload } = await wreck.post(`${baseUrl}/messages/send`, {
                payload: message,
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
        }
    };
};
