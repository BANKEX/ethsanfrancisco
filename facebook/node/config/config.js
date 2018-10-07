
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

const DB_LOGIN = (process.env.DB_LOGIN) ?
  (process.env.DB_LOGIN) :
  config.get('dbLogin');

const DB_PASSWORD = (process.env.DB_PASSWORD) ?
  (process.env.DB_PASSWORD) :
  config.get('dbPassword');

const DB_URL = (process.env.DB_URL) ?
  (process.env.DB_URL) :
  config.get('dbUrl');

const DB_NAME = (process.env.DB_NAME) ?
  (process.env.DB_NAME) :
  config.get('dbName');

const INFURA_TOKEN = (process.env.INFURA_TOKEN) ?
  (process.env.INFURA_TOKEN) :
  config.get('infuraToken');

const REDIS_HOST = (process.env.REDIS_HOST) ?
  (process.env.REDIS_HOST) :
  config.get('redisHost');

module.exports = {
    APP_SECRET:APP_SECRET,
    VALIDATION_TOKEN:VALIDATION_TOKEN,
    PAGE_ACCESS_TOKEN:PAGE_ACCESS_TOKEN,
    SERVER_URL:SERVER_URL,
    BACKEND_PORT:BACKEND_PORT,
    DB_LOGIN:DB_LOGIN,
    DB_PASSWORD:DB_PASSWORD,
    DB_URL:DB_URL,
    DB_NAME:DB_NAME,
    INFURA_TOKEN:INFURA_TOKEN,
    REDIS_HOST:REDIS_HOST
}