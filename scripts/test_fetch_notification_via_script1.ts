import * as PushAPI from "@pushprotocol/restapi";
import { createSocketConnection, EVENTS } from '@pushprotocol/socket';

/*const fetchNotifs = async() => {
    const notifications = await PushAPI.user.getFeeds({

        user: 'eip155:5:0x6f8f6D4AEd9A94ca0d6DDBCE06482c6ed28bD95A', // user address in CAIP-10
        spam: false,
        env: 'staging'
    });

    console.log('Notifications: \n', notifications);
}*/


// Push Notification - Socket Connection
async function PushSDKSocket() {
  const pushSDKSocket = createSocketConnection({
    user: 'eip155:5:0x6f8f6D4AEd9A94ca0d6DDBCE06482c6ed28bD95A', // CAIP, see below
    socketOptions: { autoConnect: false },
    env:'staging',
  });

  if (!pushSDKSocket) {
    throw new Error('PushSDKSocket | Socket Connection Failed');
  }

  pushSDKSocket.connect();

  /*pushSDKSocket.on(EVENTS.CONNECT, async () => {
    console.log('Socket Connected - will disconnect after 4 seconds');

    // send a notification to see the result
    await PushAPI_payloads_sendNotification__direct_payload_single_recipient(
      true
    );
  });*/

  pushSDKSocket.on(EVENTS.DISCONNECT, () => {
    console.log('Socket Disconnected');
  });

  pushSDKSocket.on(EVENTS.USER_FEEDS, (feedItem) => {
    // feedItem is the notification data when that notification was received
    console.log('Incoming Feed from Socket');
    console.log(feedItem);


    // disconnect socket after this, not to be done in real implementations
    pushSDKSocket.disconnect();
  });

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  await delay(4000);
}


async function main() {
const _signer = await ethers.getSigners(); 
  //fetchNotifs();
  PushSDKSocket();

} 