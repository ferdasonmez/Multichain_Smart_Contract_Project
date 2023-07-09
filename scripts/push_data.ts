import * as PushAPI from "@pushprotocol/restapi";
import * as ethers from "ethers";

const PK = 'your_channel_address_secret_key'; // channel private key
const Pkey = `0x${PK}`;
const _signer = new ethers.Wallet(Pkey);

const sendNotification = async() => {
  try {
    const apiResponse = await PushAPI.payloads.sendNotification({
      signer: _signer,
      type: 1, // broadcast
      identityType: 2, // direct payload
      notification: {
        title: `[SDK-TEST] notification TITLE:`,
        body: `[sdk-test] notification BODY`
      },
      payload: {
        title: `[sdk-test] payload title`,
        body: `sample msg body`,
        cta: '',
        img: ''
      },
      
      channel: 'eip155:5:0xB88460Bb2696CAb9D66013A05dFF29a28330689D', // your channel address
      env: 'staging'
    });
  } catch (err) {
    console.error('Error: ', err);
  }
}
//Unsupported Network, please connect to the Ethereum, Polygon, BNB or Polygon zkEVM Mainnet
sendNotification();