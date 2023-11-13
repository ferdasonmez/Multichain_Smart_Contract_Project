import { Decoder } from './Decoder';

import Web3 from 'web3';

class SolidityInspector {
  provider: any;
  decoder: Decoder;
  storageLayout: any;
  tasks: any[];

  constructor(provider: any, storageLayout: any, address: string) {
    this.provider = provider;
    this.decoder = new Decoder(this);
    this.storageLayout = storageLayout;
    this.tasks = [];
  }

  listVars(): string[] {
    return this.storageLayout.storage.map((s: any) => s.label);
  }

  getVars(address: string): Promise<any[]> {
    return Promise.all(
      this.storageLayout.storage.map((s: any) => this.getVar(address, s.label))
    );
  }

  getVar(address: string, name: string): Promise<any> {
    let svar = this.storageLayout.storage.find((s: any) => s.label === name);

    if (!svar) {
      throw new Error('Invalid varname');
    }

    let svarType = this.storageLayout.types[svar.type];

    let that = this;

    function _storageAtCurrentAddress(slot: any): Promise<any> {
      return that.getStorageAt(address, slot);
    }

    return new Promise((resolve, reject) => {
      this.getStorageAt(address, svar.slot).then((slotData: any) => {
        let resultVar = {
          var: svar,
          type: svarType,
          slotData: slotData,
          decoded: this.decoder.decode(
            svar,
            svarType,
            slotData,
            _storageAtCurrentAddress
          ),
        };

        Promise.all(this.tasks).then(() => {
          this.tasks = [];
          return resolve(resultVar);
        });
      });
    });
  }

  getStorageAt(address: string, slot: any): Promise<any> {
    try {
      const web3 = new Web3(this.provider);

      return web3.eth
        .getStorageAt(address, web3.utils.toHex(slot))
        .catch((e: any) => {
          console.log('Error: ', e);
          // This is due to a Ganache bug: https://github.com/ethers-io/ethers.js/issues/1132
          return "0x0";
        });
    } catch (e) {
      console.log('Error: ', e);
      return Promise.reject(e);
    }
  }
}

export { SolidityInspector };
