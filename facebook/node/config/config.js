
const config = require('config');

// App Secret can be retrieved from the App Dashboard
const APP_SECRET = (process.env.MESSENGER_APP_SECRET) ?
  process.env.MESSENGER_APP_SECRET :
  config.get('appSecret');

const VALIDATION_TOKEN = (process.env.MESSENGER_VALIDATION_TOKEN) ?
  (process.env.MESSENGER_VALIDATION_TOKEN) :
  config.get('validationToken');
  console.log(VALIDATION_TOKEN);

// Generate a page access token for your page from the App Dashboard
const PAGE_ACCESS_TOKEN = (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ?
  (process.env.MESSENGER_PAGE_ACCESS_TOKEN) :
  config.get('pageAccessToken');

// URL where the app is running (include protocol). Used to point to scripts and
// assets located at this address.
const SERVER_URL = (process.env.SERVER_URL) ?
  (process.env.SERVER_URL) :
  config.get('serverURL');

  const BACKEND_PORT = (process.env.BACKEND_PORT) ?
  (process.env.BACKEND_PORT) :
  config.get('backendPort');

module.exports = {
    APP_SECRET:APP_SECRET,
    VALIDATION_TOKEN:VALIDATION_TOKEN,
    PAGE_ACCESS_TOKEN:PAGE_ACCESS_TOKEN,
    SERVER_URL:SERVER_URL,
    BACKEND_PORT:BACKEND_PORT
}