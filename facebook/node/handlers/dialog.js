const
  utils =require('./utils'),
  config=require('../config/config'),
  db = require('../db/db'),
 redis = require("redis"),
guid = require('guid'),
 rp = require('request-promise');
 const client = redis.createClient({
  host: config.REDIS_HOST || '127.0.0.1'
});

const keyLifeTime = 600;

function sendStartMenu(recipientId) {

  const user = db.user.find.oneByID(recipientId);
  // console.log(user);
  // if (user)
  // {
  //   console.log("found account");
  //    sendMainMenu(recipientId);
  // }
  // else
  {
    console.log("new account");
     createAccount(recipientId);
  }
  }



  function createAccount(recipientId) {
    console.log("start creating account");
    const key = guid.create().value;
    
    client.set(key, JSON.stringify({
        userID: recipientId,
        //facebookNickname: ctx.message.from.username,
        lifetime: Date.now() + (keyLifeTime * 1000)
    }), 'EX', keyLifeTime);
    console.log(key);

    var url=config.SERVER_URL+config.BACKEND_PORT+"/create?create="+recipientId+"&type=FB";
    console.log(url);
    messageData = {
      recipient: {
        id: recipientId
      },
      message: {  
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: "Welcome to our bot!",
            buttons:[{
              type: "web_url",
              url: url,
              title: "Create Wallet"
            }]
            }
          }
        }
      
    };
  
    utils.callSendAPI(messageData);
}

  function sendMainMenu(recipientId) {
    messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: "Main menu",
            buttons:[{
                type: "postback",
                title: "Account",
                payload: "Account"
              }
            ,{
               type: "postback",
               title: "Send money",
               payload: "Send money"
             }
            ]
          }
        }
      }
    };
  
    utils.callSendAPI(messageData);
  }

  function sendAccount(recipientId) {
    messageData = {
        recipient: {
          id: recipientId
        },
        message: {
          attachment: {
            type: "template",
            payload: {
              template_type: "button",
              text: "Account",
              buttons:[{
                  type: "postback",
                  title: "Address",
                  payload: "Address"
                }
              ,{
                 type: "postback",
                 title: "Balance",
                 payload: "Balance"
               }
              ]
            }
          }
        }
      };
    
      utils.callSendAPI(messageData);
}

function sendBalance(recipientId) {
  const user = db.user.find.oneByID(recipientId);
    const balanceETH = 0;//web3.eth.getBalance(user.ethereumAddress);

    const btcURL = `https://testnet.blockexplorer.com/api/addr/${user.bitcoinAddress}`;

    const balanceBTC = rp({
        method: 'GET',
        uri: btcURL,
        json: true
    });

    const msg = `Ethereum balance: ${balanceETH/1e18}\n\nBitcoin balance: ${balanceBTC.balance}`;

    //ctx.reply(msg);

    utils.sendTextMessage(recipientId, msg);


}

function sendAddress(recipientId) {
  const user = db.user.find.oneByID(recipientId);
  const text = `Ethereum address: \`\`\`${user.ethereumAddress}\`\`\`\n\nBitcoin address: \`\`\`${user.bitcoinAddress}\`\`\``;
  //return ctx.reply(text, { parse_mode: 'Markdown' });

  utils.sendTextMessage(recipientId, text);
}

function sendTxCreate(recipientId) {
    messageData = {
        recipient: {
          id: recipientId
        },
        message: {
          attachment: {
            type: "template",
            payload: {
              template_type: "button",
              text: "Send Money",
              buttons:[{
                  type: "postback",
                  title: "Ethereum",
                  payload: "Send Ethereum"
                }
              ,{
                 type: "postback",
                 title: "Bitcoin",
                 payload: "Send Bitcoin"
               }
              ]
            }
          }
        }
      };
    
      utils.callSendAPI(messageData);
}

function sendEthereum(recipientId) {
    utils.sendTextMessage(recipientId, "Input valid adress and amount, like this 'Eth 0x0000 10'");
}

function sendBitcoin(recipientId) {
    utils.sendTextMessage(recipientId, "Input valid adress and amount, like this 'Btc 0x0000 10'");
}

function sendEthTx(recipientId) {
  utils.sendTextMessage(recipientId, "Your tx was sent");
}

function sendBtcTx(recipientId) {
  utils.sendTextMessage(recipientId, "Your tx was sent");
}

  module.exports = {
    sendStartMenu:sendStartMenu,
    sendMainMenu:sendMainMenu,
    sendAccount:sendAccount,
    sendBalance:sendBalance,
    sendAddress:sendAddress,
    sendTxCreate:sendTxCreate,
    sendBitcoin:sendBitcoin,
    sendEthereum:sendEthereum,
    sendEthTx:sendEthTx,
    sendBtcTx:sendBtcTx
}