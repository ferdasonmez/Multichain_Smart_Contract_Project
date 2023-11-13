import * as PushAPI from "@pushprotocol/restapi";


const fetchNotifs = async() => {
    const notifications = await PushAPI.user.getFeeds({

        user: 'eip155:5:0x6f8f6D4AEd9A94ca0d6DDBCE06482c6ed28bD95A', // user address in CAIP-10
        spam: false,
        env: 'staging'
    });

    console.log('Notifications: \n', notifications);
}



async function main() {
const _signer = await ethers.getSigners(); 
  fetchNotifs();

} 