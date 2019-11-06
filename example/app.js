const { OM } = require('../');

const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;


const om = new OM(apiKey, apiSecret, 'http://localhost:3200');

(async () => {

    await om.createContact({ phone: 123123123 }).catch(console.error);

    setTimeout(async () => {
        const contact = await om.createContact({ phone: '+18724000824', email: 'david@roncancio.me' }).catch(console.error);
        console.log({ contact });
    }, 2000);

    await om.createContact({ phone: '+18724000824', email: 'david@roncancio.me' }).catch(console.error);

})();

