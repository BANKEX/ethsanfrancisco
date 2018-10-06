const 
request = require('request'),
config=require('../config/config');

function sendHiMessage(recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: `
  Congrats on setting up your Messenger Bot!
  
  Right now, your bot can only respond to a few words. Try out "quick reply", "typing on", "button", or "image" to see how they work. You'll find a complete list of these commands in the "app.js" file. Anything else you type will just be mirrored until you create additional commands.
  
  For more details on how to create commands, go to https://developers.facebook.com/docs/messenger-platform/reference/send-api.
        `
      }
    }
  
    callSendAPI(messageData);
  }

  /*
 * Send an image using the Send API.
 *
 */
function sendImageMessage(recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: "image",
          payload: {
            url: config.SERVER_URL + "/assets/rift.png"
          }
        }
      }
    };
  
    callSendAPI(messageData);
  }

  /*
 * Send a Gif using the Send API.
 *
 */
function sendGifMessage(recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: "image",
          payload: {
            url: confgi.SERVER_URL + "/assets/instagram_logo.gif"
          }
        }
      }
    };
  
    callSendAPI(messageData);
  }
  
  /*
   * Send audio using the Send API.
   *
   */
  function sendAudioMessage(recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: "audio",
          payload: {
            url: config.SERVER_URL + "/assets/sample.mp3"
          }
        }
      }
    };
  
    callSendAPI(messageData);
  }
  
  /*
   * Send a video using the Send API.
   *
   */
  function sendVideoMessage(recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: "video",
          payload: {
            url: config.SERVER_URL + "/assets/allofus480.mov"
          }
        }
      }
    };
  
    callSendAPI(messageData);
  }
  
  /*
   * Send a file using the Send API.
   *
   */
  function sendFileMessage(recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: "file",
          payload: {
            url: config.SERVER_URL + "/assets/test.txt"
          }
        }
      }
    };
  
    callSendAPI(messageData);
  }
  
  /*
   * Send a text message using the Send API.
   *
   */
  function sendTextMessage(recipientId, messageText) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: messageText,
        metadata: "DEVELOPER_DEFINED_METADATA"
      }
    };
  
    callSendAPI(messageData);
  }
  
  /*
   * Send a button message using the Send API.
   *
   */
  function sendButtonMessage(recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: "This is test text",
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
  
  /*
   * Send a Structured Message (Generic Message type) using the Send API.
   *
   */
  function sendGenericMessage(recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: [{
              title: "rift",
              subtitle: "Next-generation virtual reality",
              item_url: "https://www.oculus.com/en-us/rift/",
              image_url: config.SERVER_URL + "/assets/rift.png",
              buttons: [{
                type: "web_url",
                url: "https://www.oculus.com/en-us/rift/",
                title: "Open Web URL"
              }, {
                type: "postback",
                title: "Call Postback",
                payload: "Payload for first bubble",
              }],
            }, {
              title: "touch",
              subtitle: "Your Hands, Now in VR",
              item_url: "https://www.oculus.com/en-us/touch/",
              image_url: config.SERVER_URL + "/assets/touch.png",
              buttons: [{
                type: "web_url",
                url: "https://www.oculus.com/en-us/touch/",
                title: "Open Web URL"
              }, {
                type: "postback",
                title: "Call Postback",
                payload: "Payload for second bubble",
              }]
            }]
          }
        }
      }
    };
  
    callSendAPI(messageData);
  }
  
  /*
   * Send a receipt message using the Send API.
   *
   */
  function sendReceiptMessage(recipientId) {
    // Generate a random receipt ID as the API requires a unique ID
    var receiptId = "order" + Math.floor(Math.random()*1000);
  
    var messageData = {
      recipient: {
        id: recipientId
      },
      message:{
        attachment: {
          type: "template",
          payload: {
            template_type: "receipt",
            recipient_name: "Peter Chang",
            order_number: receiptId,
            currency: "USD",
            payment_method: "Visa 1234",
            timestamp: "1428444852",
            elements: [{
              title: "Oculus Rift",
              subtitle: "Includes: headset, sensor, remote",
              quantity: 1,
              price: 599.00,
              currency: "USD",
              image_url: config.SERVER_URL + "/assets/riftsq.png"
            }, {
              title: "Samsung Gear VR",
              subtitle: "Frost White",
              quantity: 1,
              price: 99.99,
              currency: "USD",
              image_url: config.SERVER_URL + "/assets/gearvrsq.png"
            }],
            address: {
              street_1: "1 Hacker Way",
              street_2: "",
              city: "Menlo Park",
              postal_code: "94025",
              state: "CA",
              country: "US"
            },
            summary: {
              subtotal: 698.99,
              shipping_cost: 20.00,
              total_tax: 57.67,
              total_cost: 626.66
            },
            adjustments: [{
              name: "New Customer Discount",
              amount: -50
            }, {
              name: "$100 Off Coupon",
              amount: -100
            }]
          }
        }
      }
    };
  
    callSendAPI(messageData);
  }
  
  /*
   * Send a message with Quick Reply buttons.
   *
   */
  function sendQuickReply(recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: "What's your favorite movie genre?",
        quick_replies: [
          {
            "content_type":"text",
            "title":"Action",
            "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_ACTION"
          },
          {
            "content_type":"text",
            "title":"Comedy",
            "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_COMEDY"
          },
          {
            "content_type":"text",
            "title":"Drama",
            "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_DRAMA"
          }
        ]
      }
    };
  
    callSendAPI(messageData);
  }
  
  /*
   * Send a read receipt to indicate the message has been read
   *
   */
  function sendReadReceipt(recipientId) {
    console.log("Sending a read receipt to mark message as seen");
  
    var messageData = {
      recipient: {
        id: recipientId
      },
      sender_action: "mark_seen"
    };
  
    callSendAPI(messageData);
  }
  
  /*
   * Turn typing indicator on
   *
   */
  function sendTypingOn(recipientId) {
    console.log("Turning typing indicator on");
  
    var messageData = {
      recipient: {
        id: recipientId
      },
      sender_action: "typing_on"
    };
  
    callSendAPI(messageData);
  }
  
  /*
   * Turn typing indicator off
   *
   */
  function sendTypingOff(recipientId) {
    console.log("Turning typing indicator off");
  
    var messageData = {
      recipient: {
        id: recipientId
      },
      sender_action: "typing_off"
    };
  
    callSendAPI(messageData);
  }
  
  /*
   * Send a message with the account linking call-to-action
   *
   */
  function sendAccountLinking(recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: "Welcome. Link your account.",
            buttons:[{
              type: "account_link",
              url: config.SERVER_URL + "/authorize"
            }]
          }
        }
      }
    };
  
    callSendAPI(messageData);
  }
  
  /*
 * If users came here through testdrive, they need to configure the server URL
 * in default.json before they can access local resources likes images/videos.
 */
function requiresServerURL(next, [recipientId, ...args]) {
    if (config.SERVER_URL === "to_be_set_manually") {
      var messageData = {
        recipient: {
          id: recipientId
        },
        message: {
          text: `
  We have static resources like images and videos available to test, but you need to update the code you downloaded earlier to tell us your current server url.
  1. Stop your node server by typing ctrl-c
  2. Paste the result you got from running "lt —port 5000" into your config/default.json file as the "serverURL".
  3. Re-run "node app.js"
  Once you've finished these steps, try typing “video” or “image”.
          `
        }
      }
  
      callSendAPI(messageData);
    } else {
      next.apply(this, [recipientId, ...args]);
    }
  }
  /*
 * Call the Send API. The message data goes in the body. If successful, we'll
 * get the message id in a response
 *
 */
function callSendAPI(messageData) {
    console.log(config.PAGE_ACCESS_TOKEN);
    request({
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: config.PAGE_ACCESS_TOKEN },
      method: 'POST',
      json: messageData
  
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var recipientId = body.recipient_id;
        var messageId = body.message_id;
  
        if (messageId) {
          console.log("Successfully sent message with id %s to recipient %s",
            messageId, recipientId);
        } else {
        console.log("Successfully called Send API for recipient %s",
          recipientId);
        }
      } else {
        console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
      }
    });
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