import { AbiItem } from 'web3-utils'
export const COMMUNITY_ABI : AbiItem[] =  [
  {
    inputs: [ [Object], [Object], [Object] ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [ [Object] ],
    name: 'DenemeWithOutParam',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [ [Object] ],
    name: 'DenemeWithParam',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [ [Object], [Object], [Object] ],
    name: 'MemberAdded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [ [Object], [Object] ],
    name: 'MemberRemoved',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [ [Object], [Object] ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [ [Object], [Object], [Object] ],
    name: 'TokenTransferred',
    type: 'event'
  },
  {
    inputs: [ [Object], [Object], [Object] ],
    name: 'addMember',
    outputs: [ [Object] ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'communityData',
    outputs: [ [Object], [Object] ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [ [Object], [Object] ],
    name: 'contribute',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'decisionManagerImpl',
    outputs: [ [Object] ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [ [Object] ],
    name: 'denemeWithParam',
    outputs: [ [Object] ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'denemeWithoutParam',
    outputs: [ [Object] ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [ [Object] ],
    name: 'getCommunityBalance',
    outputs: [ [Object] ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [ [Object], [Object] ],
    name: 'getMemberTokenContribute',
    outputs: [ [Object] ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [ [Object] ],
    name: 'initializeAllChainDefaultWeights',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [ [Object], [Object] ],
    name: 'isMember',
    outputs: [ [Object] ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object]
    ],
    name: 'makeProposal',
    outputs: [ [Object] ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [ [Object], [Object] ],
    name: 'memberTokenBalances',
    outputs: [ [Object] ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [ [Object] ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [ [Object], [Object], [Object] ],
    name: 'removeMember',
    outputs: [ [Object] ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [ [Object], [Object] ],
    name: 'setChainDefaultWeight',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [ [Object], [Object], [Object] ],
    name: 'setChainProposalWeight',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'test',
    outputs: [ [Object] ],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [ [Object] ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [ [Object], [Object] ],
    name: 'voteForAProposal',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [ [Object], [Object] ],
    name: 'withdrawERC20TokenFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
]