const
  utils =require('./utils'),
  config=require('../config/config');

function sendStartMenu(recipientId) {
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
            }
            ,{
               type: "postback",
               title: "Main menu",
               payload: "Call main menu"
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
                  title: "Adress",
                  payload: "Adress"
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
    utils.sendTextMessage(recipientId, "balance");
}

function sendAddress(recipientId) {
    utils.sendTextMessage(recipientId, "adress");
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
    utils.sendTextMessage(recipientId, "Input valid adress or nickname");
}

function sendBitcoin(recipientId) {
    utils.sendTextMessage(recipientId, "Input valid adress or nickname");
}

  module.exports = {
    sendStartMenu:sendStartMenu,
    sendMainMenu:sendMainMenu,
    sendAccount:sendAccount,
    sendBalance:sendBalance,
    sendAddress:sendAddress,
    sendTxCreate:sendTxCreate,
    sendBitcoin:sendBitcoin,
    sendEthereum:sendEthereum
}