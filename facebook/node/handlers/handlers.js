
const
  utils = require('./utils'),
  dialog = require('./dialog');


/*
 * Authorization Event
 *
 * The value for 'optin.ref' is defined in the entry point. For the "Send to
 * Messenger" plugin, it is the 'data-ref' field. Read more at
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/authentication
 *
 */
function receivedAuthentication(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfAuth = event.timestamp;
  
    // The 'ref' field is set in the 'Send to Messenger' plugin, in the 'data-ref'
    // The developer can set this to an arbitrary value to associate the
    // authentication callback with the 'Send to Messenger' click event. This is
    // a way to do account linking when the user clicks the 'Send to Messenger'
    // plugin.
    var passThroughParam = event.optin.ref;
  
    console.log("Received authentication for user %d and page %d with pass " +
      "through param '%s' at %d", senderID, recipientID, passThroughParam,
      timeOfAuth);
  
    // When an authentication is received, we'll send a message back to the sender
    // to let them know it was successful.
    utils.sendTextMessage(senderID, "Authentication successful");
  }

  /*
 * Message Event
 *
 * This event is called when a message is sent to your page. The 'message'
 * object format can vary depending on the kind of message that was received.
 * Read more at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-received
 *
 * For this example, we're going to echo any text that we get. If we get some
 * special keywords ('button', 'generic', 'receipt'), then we'll send back
 * examples of those bubbles to illustrate the special message bubbles we've
 * created. If we receive a message with an attachment (image, video, audio),
 * then we'll simply confirm that we've received the attachment.
 *
 */
function receivedMessage(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;
  
    console.log("Received message for user %d and page %d at %d with message:",
      senderID, recipientID, timeOfMessage);
    console.log(JSON.stringify(message));
  
    var isEcho = message.is_echo;
    var messageId = message.mid;
    var appId = message.app_id;
    var metadata = message.metadata;
  
    // You may get a text or attachment but not both
    var messageText = message.text;
    var messageAttachments = message.attachments;
    var quickReply = message.quick_reply;
  
    if (isEcho) {
      // Just logging message echoes to console
      console.log("Received echo for message %s and app %d with metadata %s",
        messageId, appId, metadata);
      return;
    } else if (quickReply) {
      var quickReplyPayload = quickReply.payload;
      console.log("Quick reply for message %s with payload %s",
        messageId, quickReplyPayload);
  
      utils.sendTextMessage(senderID, "Quick reply tapped");
      return;
    }
  
    if (messageText) {
  
      // If we receive a text message, check to see if it matches any special
      // keywords and send back the corresponding example. Otherwise, just echo
      // the text we received.
      switch (messageText.replace(/[^\w\s]/gi, '').trim().toLowerCase()) {
        case 'hi':
          dialog.sendStartMenu(senderID);
          break;
        case 'main menu':
          dialog.sendMainMenu(senderID);
          break;
        case 'account':
          dialog.sendAccount(senderID);
          break;
        case 'balance':
          dialog.sendBalance(senderID);
          break;
        case 'address':
          dialog.sendAddress(senderID);
          break;
        case 'send money':
          dialog.sendTxCreate(senderID);
          break;
        case 'Ethereum':
          dialog.sendEthereum(senderID);
          break;
        case 'Bitcoin':
          dialog.sendBitcoin(senderID);
          break;
        case messageText.includes("Eth 0x"):
          dialog.sendBitcoin(senderID);
          break;
        case messageText.includes("Btc 0x"):
          dialog.sendBitcoin(senderID);
          break;
        case 'test button':
          utils.sendButtonMessage(senderID);
          break;
        default:
            dialog.sendStartMenu(senderID);
      }
    } else if (messageAttachments) {
        utils.sendTextMessage(senderID, "Message with attachment received");
    }
  }


  /*
 * Delivery Confirmation Event
 *
 * This event is sent to confirm the delivery of a message. Read more about
 * these fields at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-delivered
 *
 */
function receivedDeliveryConfirmation(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var delivery = event.delivery;
    var messageIDs = delivery.mids;
    var watermark = delivery.watermark;
    var sequenceNumber = delivery.seq;
  
    if (messageIDs) {
      messageIDs.forEach(function(messageID) {
        console.log("Received delivery confirmation for message ID: %s",
          messageID);
      });
    }
  
    console.log("All message before %d were delivered.", watermark);
  }

  /*
 * Postback Event
 *
 * This event is called when a postback is tapped on a Structured Message.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
 *
 */
function receivedPostback(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfPostback = event.timestamp;
  
    // The 'payload' param is a developer-defined field which is set in a postback
    // button for Structured Messages.
    
    let text = JSON.stringify(event.postback);
    console.log(text);
    var payload = event.postback.payload;
  
    console.log("Received postback for user %d and page %d with payload '%s' " +
      "at %d", senderID, recipientID, payload, timeOfPostback);
  
    // When a postback is called, we'll send a message back to the sender to
    // let them know it was successful
    utils.sendTextMessage(senderID, "Postback called");
  }


/*
 * Message Read Event
 *
 * This event is called when a previously-sent message has been read.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-read
 *
 */
function receivedMessageRead(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
  
    // All messages before watermark (a timestamp) or sequence have been seen.
    var watermark = event.read.watermark;
    var sequenceNumber = event.read.seq;
  
    console.log("Received message read event for watermark %d and sequence " +
      "number %d", watermark, sequenceNumber);
  }
  
  /*
   * Account Link Event
   *
   * This event is called when the Link Account or UnLink Account action has been
   * tapped.
   * https://developers.facebook.com/docs/messenger-platform/webhook-reference/account-linking
   *
   */
  function receivedAccountLink(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
  
    var status = event.account_linking.status;
    var authCode = event.account_linking.authorization_code;
  
    console.log("Received account link event with for user %d with status %s " +
      "and auth code %s ", senderID, status, authCode);
  }
  
  module.exports = {
    receivedAuthentication:receivedAuthentication,
    receivedMessage:receivedMessage,
    receivedDeliveryConfirmation:receivedDeliveryConfirmation,
    receivedPostback:receivedPostback,
    receivedMessageRead:receivedMessageRead,
    receivedAccountLink:receivedAccountLink
}