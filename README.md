# openmessage

## Documentation

The documentation for OpenMessage API can be found at https://docs.openmessage.io/#hello

The documentation for OpenMessage Node library can be found https://github.com/OpenMessage/om-node/wiki

## Install

`npm install @openmessage/node`

## Usage

```javascript
const OM = require('@openmessage/node');

const om = OM(process.env.API_KEY, process.env.API_SECRET);

const contact = await om.createContact({ phone, email });
```
