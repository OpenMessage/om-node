const { OM } = require('../');

const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;


const om = new OM(apiKey, apiSecret, 'https://next.omsg.io');

(async () => {

    console.log(await om.createContact({ phone: '+18724000824', email: 'david@roncancio.me' }).catch(console.error));

})();

