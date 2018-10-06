const
  utils = require('./utils'),

function sendStartMenu(recipientId) {
    var messageData = {
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
              type: "web_url",
              url: "https://www.oculus.com/en-us/rift/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Trigger Postback",
              payload: "DEVELOPER_DEFINED_PAYLOAD"
            }, {
              type: "phone_number",
              title: "Call Phone Number",
              payload: "+16505551234"
            }]
          }
        }
      }
    };
  
    callSendAPI(messageData);
  }

  module.exports = {
    sendHiMessage:sendHiMessage,
    sendImageMessage:sendImageMessage,
    sendGifMessage:sendGifMessage,
    sendAudioMessage:sendAudioMessage,
    sendVideoMessage:sendVideoMessage,
    sendFileMessage:sendFileMessage,
    sendTextMessage:sendTextMessage,
    sendButtonMessage:sendButtonMessage,
    sendGenericMessage:sendGenericMessage,
    sendReceiptMessage:sendReceiptMessage,
    sendQuickReply:sendQuickReply,
    sendReadReceipt:sendReadReceipt,
    sendTypingOn:sendTypingOn,
    sendAccountLinking:sendAccountLinking,
    sendTypingOff:sendTypingOff,
    requiresServerURL:requiresServerURL
}