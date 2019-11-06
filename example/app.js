const { OM } = require('../');

const apiKey = 'TestAPIKey';
const apiSecret = 'TestAPISecret';


const om = new OM(apiKey, apiSecret, 'http://localhost:3200');

(async () => {

    await om.createContact({ phone: '+18724000824', email: 'david@roncancio.me' });

})();

