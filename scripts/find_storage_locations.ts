const { ethers } = require("ethers");

//the bytecode may not be the latest version, should be replaced
const bytecode = "0x6080604052346200003457620000226200001862000264565b9291909162000dde565b60405161310a6200133b823961310a90f35b600080fd5b634e487b7160e01b600052604160045260246000fd5b90601f01601f191681019081106001600160401b038211176200007157604052565b62000039565b906200008e6200008660405190565b92836200004f565b565b6001600160401b0381116200007157602090601f01601f19160190565b0190565b60005b838110620000c55750506000910152565b8181015183820152602001620000b4565b90929192620000ef620000e98262000090565b62000077565b9381855260208501908284011162000034576200008e92620000b1565b9080601f83011215620000345781516200012992602001620000d6565b90565b6001600160a01b031690565b6001600160a01b0381165b036200003457565b905051906200008e8262000138565b6001600160401b038111620000715760208091020190565b92919062000184620000e9826200015a565b9381855260208086019202810191838311620000345781905b838210620001ac575050505050565b81516001600160401b0381116200003457602091620001cf87849387016200010c565b8152019101906200019d565b9080601f8301121562000034578151620001299260200162000172565b90608082820312620000345781516001600160401b038111620000345781620002239184016200010c565b926200023382602085016200014b565b9260409262000245818584016200014b565b936001806060850151921b0381116200003457620001299201620001db565b6200028762004445803803806200027b8162000077565b928339810190620001f8565b90919293565b62000129906200012c906001600160a01b031682565b62000129906200028d565b6200012990620002a3565b906001600160a01b03905b9181191691161790565b90620002e262000129620002ea92620002ae565b8254620002b9565b9055565b634e487b7160e01b600052600060045260246000fd5b634e487b7160e01b600052602260045260246000fd5b90600160028304921680156200033d575b60208310146200033757565b62000304565b91607f16916200032b565b9160001960089290920291821b911b620002c4565b6200012962000129620001299290565b91906200038262000129620002ea936200035d565b90835462000348565b6200008e916000916200036d565b818110620003a5575050565b80620003b560006001936200038b565b0162000399565b9190601f8111620003cc57505050565b620003e06200008e93600052602060002090565b906020601f84018190048301931062000405575b6020601f909101045b019062000399565b9091508190620003f4565b906200041a815190565b906001600160401b038211620000715762000442826200043b85546200031a565b85620003bc565b602090601f83116001146200048157620002ea92916000918362000475575b5050600019600883021c1916906002021790565b01519050388062000461565b601f198316916200049785600052602060002090565b9260005b818110620004d957509160029391856001969410620004be575b50505002019055565b01516000196008601f8516021c19165b9055388080620004b5565b919360206001819287870151815501950192016200049b565b906200008e9162000410565b9060001990620002c4565b906200051d62000129620002ea926200035d565b8254620004fe565b62000129906200012c565b62000129905462000525565b8062000143565b905051906200008e826200053c565b906020828203126200003457620001299162000543565b6040513d6000823e3d90fd5b62000129606062000077565b634e487b7160e01b600052603260045260246000fd5b8054821015620005bc57620005b3600391600052602060002090565b91020190600090565b62000581565b634e487b7160e01b600052601160045260246000fd5b81810292918115918404141715620005ec57565b620005c2565b906200060690600019906020036008021c90565b8154169055565b906000916200063a6200062582600052602060002090565b928354600019600883021c1916906002021790565b905555565b9192906020821015620006ad57601f84116001146200067157620002ea929350600019600883021c1916906002021790565b5090620006a76200008e9360016200069d6200069285600052602060002090565b92601f602091010490565b8201910162000399565b6200060d565b50620006ea8293620006c6600194600052602060002090565b620003fd6020601f860104820192601f861680620006f2575b50601f602091010490565b600202179055565b6200070090888603620005f2565b38620006df565b929091680100000000000000008211620000715760201115620007655760208110156200074557620002ea91600019600883021c1916906002021790565b60019160ff19166200075c84600052602060002090565b55600202019055565b60019150600202019055565b9081546200077f816200031a565b90818311620007ad575b81831062000798575b50505050565b620007a3936200063f565b3880808062000792565b620007bb8383838762000707565b62000789565b60006200008e9162000771565b90600003620007e2576200008e90620007c1565b620002ee565b818110620007f4575050565b80620008046000600193620007ce565b01620007e8565b90918281106200081a57505050565b6200008e929062000832905b92600052602060002090565b9081019101620007e8565b906801000000000000000081116200007157816200085d6200008e935490565b908281556200080b565b620008976200088b62000878845190565b936200088585856200083d565b60200190565b91600052602060002090565b6000915b838310620008a95750505050565b6001602082620008c3620008bc84955190565b86620004f2565b019201920191906200089b565b906200008e9162000867565b6200008e91906200092d906040906002906200090b816200090487516001600160a01b031690565b90620002ce565b62000926600182016200091f602088015190565b9062000509565b0192015190565b90620008d0565b9190620007e2576200008e91620008dc565b9081549168010000000000000000831015620000715782620009729160016200008e9501815562000597565b9062000934565b62000129906003620005d8565b60006200008e916200083d565b90600003620007e2576200008e9062000986565b60008082556200008e91600290620009c383600183016200038b565b0162000993565b90600003620007e2576200008e90620009a7565b818110620009ea575050565b80620009fa6000600393620009ca565b01620009de565b909182811062000a1057505050565b62000a2e6200082662000a276200008e9562000979565b9262000979565b9081019101620009de565b9068010000000000000000811162000071578162000a596200008e935490565b9082815562000a01565b620001299081565b62000129905462000a63565b6200012990546200031a565b9080821462000b705762000a978162000a77565b906001600160401b038211620000715762000ab8826200043b85546200031a565b600090601f831160011462000af657620002ea92916000918362000aea575050600019600883021c1916906002021790565b01549050388062000461565b9062000b0c601f19841692600052602060002090565b9062000b1d85600052602060002090565b92815b81811062000b575750916002939185600196941062000b425750505002019055565b01546000196008601f8516021c1916620004ce565b9193600180602092878701548155019501920162000b20565b5050565b906200008e9162000a83565b81811462000b705762000bb16200088b62000b99845490565b9362000ba685856200083d565b600052602060002090565b6000915b83831062000bc35750505050565b6001808262000bd482948662000b74565b0192019201919062000bb5565b906200008e9162000b80565b9080820362000bfa575050565b6200008e91600290819062000c1481620009048662000530565b62000c2a600182016200091f6001870162000a6b565b0191019062000be1565b906200008e9162000bed565b81811462000b705762000c666200088b62000c59845490565b9362000ba6858562000a39565b6000915b83831062000c785750505050565b6003808262000c8a6001948662000c34565b0192019201919062000c6a565b906200008e9162000c40565b62000cbc600c62000cb583546200031a565b83620003bc565b7f44756d6d7920537472696e6700000000000000000000000000000000000000189055565b6200008e9062000ca3565b90602082820312620000345781516001600160401b03811162000034576200012992016200010c565b8054600093929162000d3562000d2b836200031a565b8085529360200190565b916001811690811562000d8c575060011462000d5057505050565b62000d649192939450600052602060002090565b916000925b81841062000d775750500190565b80548484015260209093019260010162000d69565b92949550505060ff1916825215156020020190565b90620001299162000d15565b906200008e62000dcb9262000dc160405190565b9384809262000da1565b03836200004f565b620001299062000dad565b929162000e1462000e1462000e1462000e229362000e1462000e1a62000e1462000e1462000e1462000e2a9a62000e146200113c565b620002ae565b6009620002ce565b6008620002ce565b60019162000e3a906002620004f2565b62000e8462000e4b61022b6200035d565b839062000e59908262000509565b602062000e6b62000e14600962000530565b63e8f5ceb59062000e7b60405190565b94859260e01b90565b825260049082906000905af1908115620010ba5762000ead9260009262001117575b5062000509565b6002820180339262000ec462000e14600962000530565b92633408e47092602062000ed760405190565b809662000ee48760e01b90565b825260049082905afa948515620010ba5762000f789662000f4362000f509562000f3c60209962000f4a95600091620010f5575b5062000f3662000f2762000575565b6001600160a01b039096168652565b8a850152565b6040830152565b8362000946565b62000c97565b62000f5c600762000ce1565b62000f6c62000e14600962000530565b60405193849260e01b90565b825260049082905afa8015620010ba5762000f9f91600091620010c0575b50600e62000509565b62000ff1600062000fb562000e14600962000530565b63bbce148c9062000fe362000fcb600e62000a6b565b9262000fd660405190565b9586948593849360e01b90565b835260048301526024820190565b03915afa8015620010ba57620010139160009162001094575b50600d620004f2565b6200102962001023600d62000dd3565b620012d7565b6200104c62001039600e62000a6b565b6200104560026200035d565b90620011ec565b5060066103e88190527ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f5490546200008e91906200108c90600b62000509565b600c62000509565b620010b3913d8091833e620010aa81836200004f565b81019062000cec565b386200100a565b62000569565b620010e6915060203d8111620010ed575b620010dd81836200004f565b81019062000552565b3862000f96565b503d620010d1565b6200111091508b3d8111620010ed57620010dd81836200004f565b3862000f18565b6200113491925060203d8111620010ed57620010dd81836200004f565b903862000ea6565b6200008e336200114d600062000530565b906200115b816000620002ce565b620011926200118b7f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e093620002ae565b91620002ae565b916200119d60405190565b600090a3565b906200008e91620011b36200124e565b620011d3565b90620011c5906200035d565b600052602052604060002090565b6200008e9190620011e6906004620011b9565b62000509565b906200008e91620011a3565b156200120057565b60405162461bcd60e51b8152806200124a600482016020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b0390fd5b6200008e6200125c6200127f565b620012786200126b336200012c565b916001600160a01b031690565b14620011f8565b62000129600062000530565b620012b0620012ba602093620000ad93620012a4815190565b80835293849260200190565b95869101620000b1565b601f01601f191690565b602080825262000129929101906200128b565b62001308620013186200008e92620012ee60405190565b63104c13eb60e21b602082015292839160248301620012c4565b602082018103825203826200004f565b6000809162001325815190565b906020016a636f6e736f6c652e6c6f675afa5056fe6080604052600436101561001257600080fd5b60003560e01c80630f1d225f146101925780631a267b4a1461018d5780631ac0ef5a146101885780632550b90a14610183578063302fa3a81461017e57806331b0886a146101795780633c9135bf146101745780635020189d1461016f57806351a297aa1461016a57806357e3572514610165578063664197ff14610160578063715018a61461015b57806376ddddb7146101565780638418cd991461015157806385752d031461014c5780638da5cb5b146101475780639d7dd2f114610142578063bff3b1761461013d578063c785042214610138578063e603963714610133578063f2fde38b1461012e578063f61cd6b914610129578063f87289bf146101245763f8a8fd6d0361019757610aa9565b610a90565b610a45565b610a21565b6109f1565b61099d565b610944565b61090b565b6108cc565b61089e565b610885565b610850565b610838565b61081d565b6107c3565b610790565b610728565b6105ac565b61057c565b610540565b6104f6565b610447565b610326565b6102c1565b600080fd5b6001600160a01b031690565b90565b6001600160a01b0381165b0361019757565b905035906101ca826101ab565b565b806101b6565b905035906101ca826101cc565b909182601f830112156101975781359167ffffffffffffffff831161019757602001926020830284011161019757565b916060838303126101975761022482846101bd565b9261023283602083016101d2565b92604082013567ffffffffffffffff81116101975761025192016101df565b9091565b60005b8381106102685750506000910152565b8181015183820152602001610258565b6102996102a26020936102ac9361028d815190565b80835293849260200190565b95869101610255565b601f01601f191690565b0190565b60208082526101a892910190610278565b34610197576102ec6102e06102d736600461020f565b92919091611eca565b604051918291826102b0565b0390f35b9190916040818403126101975761030783826101d2565b92602082013567ffffffffffffffff81116101975761025192016101df565b346101975761033f6103393660046102f0565b91612c9c565b604051005b909182601f830112156101975781359167ffffffffffffffff831161019757602001926001830284011161019757565b908160a09103126101975790565b91906101208382031261019757823567ffffffffffffffff811161019757816103ac918501610344565b9290936103bc83602083016101d2565b92604082013567ffffffffffffffff811161019757816103dd918401610374565b926103eb82606085016101d2565b926103f983608083016101d2565b926104078160a084016101bd565b926104158260c085016101d2565b926104238360e083016101d2565b9261010082013567ffffffffffffffff81116101975761025192016101df565b9052565b34610197576102ec61046f61045d366004610382565b9998909897919796929695939561291a565b6040519182918290815260200190565b600091031261019757565b6101a8916008021c6001600160a01b031690565b906101a8915461048a565b6101a86000600861049e565b61019c6101a86101a8926001600160a01b031690565b6101a8906104b5565b6101a8906104cb565b610443906104d4565b6020810192916101ca91906104dd565b346101975761050636600461047f565b6102ec6105116104a9565b604051918291826104e6565b9190604083820312610197576101a89061053781856101d2565b936020016101d2565b346101975761033f61055336600461051d565b906125a9565b9190604083820312610197576101a89061057381856101bd565b936020016101bd565b34610197576102ec61046f610592366004610559565b90611236565b90602082820312610197576101a8916101d2565b346101975761033f6105bf366004610598565b612574565b634e487b7160e01b600052600060045260246000fd5b634e487b7160e01b600052602260045260246000fd5b9060016002830492168015610610575b602083101461060b57565b6105da565b91607f1691610600565b8054600093929161063761062d836105f0565b8085529360200190565b9160018116908115610689575060011461065057505050565b6106639192939450600052602060002090565b916000925b8184106106755750500190565b805484840152602090930192600101610668565b92949550505060ff1916825215156020020190565b906101a89161061a565b634e487b7160e01b600052604160045260246000fd5b90601f01601f1916810190811067ffffffffffffffff8211176106e057604052565b6106a8565b906101ca6106ff926106f660405190565b9384809261069e565b03836106be565b90600010610717576101a8906106e5565b6105c4565b6101a860006007610706565b346101975761073836600461047f565b6102ec6102e061071c565b9061074d906104d4565b600052602052604060002090565b6101a8916008021c81565b906101a8915461075b565b61078b6101a892610786600693600094610743565b610743565b610766565b34610197576102ec61046f6107a6366004610559565b90610771565b9081526040810192916101ca9160200152565b0152565b34610197576107d336600461047f565b60016006906102ec6107e460405190565b928392836107ac565b6001600160a01b0381166101b6565b905035906101ca826107ed565b90602082820312610197576101a8916107fc565b34610197576102ec61046f610833366004610809565b610cf5565b346101975761084836600461047f565b61033f610afc565b346101975761086036600461047f565b6102ec6102e061141f565b9190604083820312610197576101a89061053781856101bd565b346101975761033f61089836600461086b565b90611067565b34610197576102ec6108ba6108b436600461086b565b90612671565b60405191829182901515815260200190565b34610197576108dc36600461047f565b6102ec6108f16000546001600160a01b031690565b604051918291826001600160a01b03909116815260200190565b34610197576102ec6102e061092136600461020f565b929190916123e5565b9190604083820312610197576101a89061053781856107fc565b346101975761033f61095736600461092a565b90610e77565b6101a89081565b6101a8905461095d565b6001906101a861097d83610964565b9280016106e5565b9081526040602082018190526101a892910190610278565b34610197576109ad36600461047f565b6109b561096e565b906102ec6109c260405190565b92839283610985565b9060208282031261019757813567ffffffffffffffff8111610197576102519201610344565b34610197576102ec6102e0610a073660046109cb565b906115fd565b90602082820312610197576101a8916101bd565b346101975761033f610a34366004610a0d565b610c34565b6101a86000600a610706565b3461019757610a5536600461047f565b6102ec6102e0610a39565b9091606082840312610197576101a8610a7984846101d2565b93610a8781602086016101d2565b936040016101d2565b346101975761033f610aa3366004610a60565b91612666565b3461019757610ab936600461047f565b6102ec6102e061128c565b610acc610b58565b6101ca610aea565b61019c6101a86101a89290565b6101a890610ad4565b6101ca610af76000610ae1565b610c6d565b6101ca610ac4565b15610b0b57565b60405162461bcd60e51b815280610b54600482016020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b0390fd5b6101ca610b6d6000546001600160a01b031690565b610b86610b793361019c565b916001600160a01b031690565b14610b04565b6101ca90610b98610b58565b610c0f565b15610ba457565b60405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152608490fd5b6101ca90610af7610c2361019c6000610ae1565b6001600160a01b0383161415610b9d565b6101ca90610b8c565b906001600160a01b03905b9181191691161790565b90610c626101a8610c69926104d4565b8254610c3d565b9055565b6000546001600160a01b031690610c85816000610c52565b610cb8610cb27f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0936104d4565b916104d4565b91610cc260405190565b600090a3565b905051906101ca826101cc565b90602082820312610197576101a891610cc8565b6040513d6000823e3d90fd5b6020610d0c610d4c92610d06600090565b506104d4565b6370a0823190610d35610d1e306104d4565b92610d2860405190565b9586948593849360e01b90565b83526001600160a01b031660048301526024820190565b03915afa908115610d8a57600091610d62575090565b6101a8915060203d8111610d83575b610d7b81836106be565b810190610cd5565b503d610d71565b610ce9565b15610d9657565b60405162461bcd60e51b815260206004820152601a60248201527f496e73756666696369656e7420746f6b656e2062616c616e63650000000000006044820152606490fd5b634e487b7160e01b600052601160045260246000fd5b91908203918211610dfe57565b610ddb565b9060001990610c48565b6101a86101a86101a89290565b90610e2a6101a8610c6992610e0d565b8254610e03565b8015156101b6565b905051906101ca82610e31565b90602082820312610197576101a891610e39565b6001600160a01b0390911681526040810192916101ca9160200152565b610e80906104d4565b6370a08231906020610d35610e94306104d4565b93610eac610ea160405190565b958693849360e01b90565b0381845afa8015610d8a57610ecc610ed591602094600091610f83575090565b845b1115610d8f565b3390610f1a610f028261078685600682610efc6101a8610ef787848787610743565b610964565b8b610ece565b610f1486610f0f83610964565b610df1565b90610e1a565b610f3d600063a9059cbb610f48610f3060405190565b9788968795869460e01b90565b845260048401610e5a565b03925af18015610d8a57610f595750565b610f799060203d8111610f7c575b610f7181836106be565b810190610e46565b50565b503d610f67565b6101a89150853d8111610d8357610d7b81836106be565b15610fa157565b60405162461bcd60e51b815280610b54600482016020808252818101527f4f6e6c7920455243323020636f6e747269627574696f6e7320616c6c6f776564604082015260600190565b6001600160a01b039182168152911660208201526060810192916101ca9160400152565b1561101557565b60405162461bcd60e51b815260206004820152601560248201527f546f6b656e207472616e73666572206661696c656400000000000000000000006044820152606490fd5b91908201809211610dfe57565b90611079611074836111b9565b610f9a565b61108a611085836104d4565b6104d4565b8160206323b872dd33936110af60006110a2306104d4565b936110bb610f3060405190565b84528a60048501610fea565b03925af1938415610d8a57610786610f14936110e66101ca976110ed956000916110fc575b5061100e565b6006610743565b916110f783610964565b61105a565b611114915060203d8111610f7c57610f7181836106be565b386110e0565b61112d6111276101a89290565b60e01b90565b7fffffffff000000000000000000000000000000000000000000000000000000001690565b906101ca61115f60405190565b92836106be565b67ffffffffffffffff81116106e057602090601f01601f19160190565b9061119561119083611166565b611152565b918252565b3d156111b4576111a93d611183565b903d6000602084013e565b606090565b600080916111c5600090565b5060046112046111d86395d89b4161111a565b6111f56111e460405190565b938492602084019081520160000190565b602082018103825203826106be565b602081019051915afa61121561119a565b8161121e575090565b51905061123261122e6000610e0d565b9190565b1190565b6101a891610786610ef792611249600090565b506006610743565b61125b6005611183565b7f48656c6c6f000000000000000000000000000000000000000000000000000000602082015290565b6101a8611251565b6101a8611284565b61129e6027611183565b7f64656e656d65576974686f7574506172616d2066756e6374696f6e206973206560208201527f7865637574656400000000000000000000000000000000000000000000000000604082015290565b6101a8611294565b91906008610c4891029161130a600019841b90565b921b90565b91906113206101a8610c6993610e0d565b9083546112f5565b6101ca9160009161130f565b81811061133f575050565b8061134d6000600193611328565b01611334565b9190601f811161136257505050565b6113746101ca93600052602060002090565b906020601f840181900483019310611397575b6020601f909101045b0190611334565b9091508190611387565b6113b660056113b083546105f0565b83611353565b7f48656c6c6f00000000000000000000000000000000000000000000000000000a9055565b6101ca906113a1565b6113ee601b611183565b7f64656e656d65576974686f757420506172616d2043616c697374690000000000602082015290565b6101a86113e4565b61142f61142a6112ed565b613003565b61143960076113db565b6101a8611417565b90826000939282370152565b91906102a281611464816102ac9560209181520190565b8095611441565b60208082526101a89391019161144d565b919067ffffffffffffffff82116106e0576114a18261149b85546105f0565b85611353565b600090601f83116001146114dc57610c699291600091836114d1575b5050600019600883021c1916906002021790565b0135905038806114bd565b601f198316916114f185600052602060002090565b92815b81811061152f57509160029391856001969410611515575b50505002019055565b0135600019601f84166008021c19165b905538808061150c565b919360206001819287870135815501950192016114f4565b906101ca929161147c565b61155c601b611183565b7f44656e656d6557697468506172616d20454d6974204564696c64690000000000602082015290565b6101a8611552565b9092919261159d61119082611166565b93818552602085019082840111610197576101ca92611441565b6101a891369161158d565b6115cc6018611183565b7f64656e656d655769746820506172616d2043616c697374690000000000000000602082015290565b6101a86115c2565b6116606116669261160c606090565b507f6befd909086d4cbba6bdcbd9400924c4fe261990f6d21e7291f7868c97e6741f61163760405190565b8061164384878361146b565b0390a161165281846007611547565b61165a611585565b926115b7565b9061308e565b6101a86115f5565b906101a89493929161167e610b58565b611ddb565b61168d600d611183565b7f416464696e67206d656d62657200000000000000000000000000000000000000602082015290565b6101a8611683565b156116c557565b60405162461bcd60e51b815260206004820152601760248201527f496e76616c6964206163636f756e7420616464726573730000000000000000006044820152606490fd5b1561171157565b60405162461bcd60e51b815260206004820152601060248201527f496e76616c696420636861696e204944000000000000000000000000000000006044820152606490fd5b1561175d57565b60405162461bcd60e51b815260206004820152601c60248201527f4174206c65617374206f6e6520746167206973207265717569726564000000006044820152606490fd5b6101a86060611152565b67ffffffffffffffff81116106e05760208091020190565b9080601f83011215610197578160206101a89335910161158d565b9291906117ee611190826117ac565b93818552602080860192028101918383116101975781905b838210611814575050505050565b813567ffffffffffffffff81116101975760209161183587849387016117c4565b815201910190611806565b6101a89136916117df565b634e487b7160e01b600052603260045260246000fd5b80548210156118845761187b600391600052602060002090565b91020190600090565b61184b565b5190565b9060001961189f916020036008021c90565b8154169055565b906000916118d16118bc82600052602060002090565b928354600019600883021c1916906002021790565b905555565b919290602082101561193b57601f841160011461190557610c69929350600019600883021c1916906002021790565b50906119366101ca93600161192d61192285600052602060002090565b92601f602091010490565b82019101611334565b6118a6565b506119748293611952600194600052602060002090565b6113906020601f860104820192601f86168061197c575b50601f602091010490565b600202179055565b6119889088860361188d565b38611969565b9290916801000000000000000082116106e057602011156119e75760208110156119c857610c6991600019600883021c1916906002021790565b60019160ff19166119de84600052602060002090565b55600202019055565b60019150600202019055565b9081546119ff816105f0565b90818311611a28575b818310611a16575b50505050565b611a1f936118d6565b38808080611a10565b611a348383838761198e565b611a08565b60006101ca916119f3565b90600003610717576101ca90611a39565b818110611a60575050565b80611a6e6000600193611a44565b01611a55565b9091828110611a8257505050565b6101ca9290611a979092600052602060002090565b9081019101611a55565b906801000000000000000081116106e05781611abe6101ca935490565b90828155611a74565b90611ad0815190565b9067ffffffffffffffff82116106e057611aee8261149b85546105f0565b602090601f8311600114611b2857610c69929160009183611b1d575050600019600883021c1916906002021790565b0151905038806114bd565b601f19831691611b3d85600052602060002090565b9260005b818110611b7557509160029391856001969410611b615750505002019055565b01516000196008601f8516021c1916611525565b91936020600181928787015181550195019201611b41565b906101ca91611ac7565b611bc2611bb6611ba5845190565b93611bb08585611aa1565b60200190565b91600052602060002090565b6000915b838310611bd35750505050565b6001602082611bea611be484955190565b86611b8d565b01920192019190611bc6565b906101ca91611b97565b6101ca9190611c4390604090600290611c2a81611c2487516001600160a01b031690565b90610c52565b611c3c60018201610f14602088015190565b0192015190565b90611bf6565b9190610717576101ca91611c00565b90815491680100000000000000008310156106e05782611c809160016101ca95018155611861565b90611c49565b906101a8929161144d565b9035601e19368390030181121561019757016020813591019167ffffffffffffffff82116101975736829003831361019757565b818352916020019081611cdb6020830284019490565b92836000925b848410611cf15750505050505090565b9091929394956020611d1e611d178385600195038852611d118b88611c91565b90611c86565b9860200190565b940194019294939190611ce1565b611d586101a89593949294611d51606084019660008501906001600160a01b03169052565b6020830152565b6040818503910152611cc5565b611d6f6019611183565b7f4d656d6265724164646564206576656e7420656d697474656400000000000000602082015290565b6101a8611d65565b611daa6007611183565b7f456b6c6564696d00000000000000000000000000000000000000000000000000602082015290565b6101a8611da0565b93611eb49192939450611def61142a6116b6565b611e806000611e14611e0361019c83610ae1565b6001600160a01b03871614156116be565b611e27611e2082610e0d565b871161170a565b611e3d83611e3761122e84610e0d565b11611756565b6003611e5c86611e4b6117a2565b938401906001600160a01b03169052565b611e67876020840152565b611e7b611e74858a611840565b6040840152565b611c58565b7f0d0142bd8e1660ba803946c35121ac959db54a10e5174b392f33d1913d1f9c0f94611eab60405190565b94859485611d2c565b0390a1611ec261142a611d98565b6101a8611dd3565b6101a893929190606061166e565b906101a894939291611ee8610b58565b612255565b611ef7600f611183565b7f52656d6f76696e67206d656d6265720000000000000000000000000000000000602082015290565b6101a8611eed565b6000198114610dfe5760010190565b90611195611190836117ac565b6101a8906106e5565b90611f56825490565b611f5f81611f37565b92611f736020850191600052602060002090565b6000915b838310611f845750505050565b600160208192611f9385611f44565b815201920192019190611f77565b6101a890611f4d565b6101a890546105f0565b9080821461209157611fc581611faa565b9067ffffffffffffffff82116106e057611fe38261149b85546105f0565b600090601f831160011461201d57610c69929160009183612012575050600019600883021c1916906002021790565b0154905038806114bd565b90612032601f19841692600052602060002090565b9061204285600052602060002090565b92815b818110612079575091600293918560019694106120655750505002019055565b01546000196008601f8516021c1916611525565b91936001806020928787015481550195019201612045565b5050565b906101ca91611fb4565b818114612091576120ca611bb66120b4845490565b936120bf8585611aa1565b600052602060002090565b6000915b8383106120db5750505050565b600180826120ea829486612095565b019201920191906120ce565b906101ca9161209f565b9080820361210c575050565b6101ca91600290819061212a81611c2486546001600160a01b031690565b61213d60018201610f1460018701610964565b019101906120f6565b9190610717576101ca91612100565b634e487b7160e01b600052603160045260246000fd5b60006101ca91611aa1565b90600003610717576101ca9061216b565b60008082556101ca916002906121a08360018301611328565b01612176565b90600003610717576101ca90612187565b805480156121da5760001901906121d76121d18383611861565b906121a6565b55565b612155565b6121e9601b611183565b7f4d656d62657252656d6f766564206576656e7420656d69747465640000000000602082015290565b6101a86121df565b6122246008611183565b7f43696b617264696d000000000000000000000000000000000000000000000000602082015290565b6101a861221a565b50919261226361142a611f20565b60009360009161227283610e0d565b6001600281016122836101a8825490565b8310156123d157806122a98761229a868095611861565b5001546001600160a01b031690565b6122bb6001600160a01b038b16610b79565b1492836123b1575b508261237f575b50506122de576122d990611f28565b612272565b9150506123329293945061232d91505b6101a860019161232761231f612319600286019561231361230d885490565b91610e0d565b90610df1565b85611861565b509184611861565b90612146565b6121b7565b7f3ac963493df564de734d98633f1145d21512e282ba4c02d3c1011119bf7f28629161236961236060405190565b92839283610e5a565b0390a161237761142a612212565b6101a861224d565b6123aa925061239361239a92600292611861565b5001611fa1565b6123a48486611840565b9061240d565b81386122ca565b8193506123c1836123c893611861565b5001610964565b871491386122c3565b505050505050909161232d612332916122ee565b6101a8939291906060611ed8565b906123fc825190565b811015611884576020809102010190565b90815161241e61122e6101a8845190565b036124a65760009061242f82610e0d565b61243a6101a8855190565b81101561249d5761244e61188982866123f3565b612460612459825190565b9160200190565b2061248361122e61247461188985876123f3565b61247f612459825190565b2090565b036124965761249190611f28565b61242f565b5050905090565b50505050600190565b5050600090565b6101ca906124b9610b58565b612521565b634e487b7160e01b600052602160045260246000fd5b600711156124de57565b6124be565b906101ca826124d4565b6101a8906124e3565b60ff1660ff8114610dfe5760010190565b6101a86101a86101a89260ff1690565b9061074d90612507565b9061252c60006124ed565b600161254061253a826124ed565b60ff1690565b60ff8316101561256e57906125648461255f8360036125699601612517565b610e1a565b6124f6565b61252c565b50509050565b6101ca906124ad565b906101ca9161258a610b58565b612599565b9061074d90610e0d565b6101ca919061255f90600461258f565b906101ca9161257d565b906101ca92916125c1610b58565b612621565b01918252565b6102ac6125e4926020926125de815190565b94859290565b93849101610255565b6111956102ac91602094936125cc565b61261261260960405190565b928392836125ed565b03902090565b6101a8916125fd565b61265361265f6101ca949361255f9361263960405190565b9384926020840192836020816125c66102ac938396959052565b908103825203826106be565b6005612618565b906101ca92916125b3565b600061267c81610e0d565b60016002810161268d6101a8825490565b8310156126f55781836126a48661229a8386611861565b6126b66001600160a01b038916610b79565b1492836126dc575b5050506126d457506126cf90611f28565b61267c565b935050505090565b6126eb9350906123c191611861565b85148183386126be565b50505091505090565b1561270557565b60405162461bcd60e51b815260206004820152601e60248201527f4e6f742061206d656d626572206f662074686520636f6d6d756e6974792e00006044820152606490fd5b9035601e19368390030181121561019757016020813591019167ffffffffffffffff821161019757602082023603831361019757565b6003111561019757565b905035906101ca82612780565b506101a890602081019061278a565b600311156124de57565b906101ca826127a6565b6101a8906127b0565b610443906127ba565b506101a89060208101906101bd565b506101a89060208101906101d2565b906101a890608061286b61281060a08401612805878061274a565b868303875290611cc5565b9461282b6128216020830183612797565b60208601906127c3565b61284b61283b60408301836127cc565b6001600160a01b03166040860152565b61286261285b60608301836127db565b6060860152565b828101906127db565b910152565b98926128dd6128e5916101a89f9d999e9c97986128d06128fb9a60608f61290c9f986128f39c6128c96128b76107bf936128ec9e610160870191878303600089015261144d565b6001600160a01b039099166020850152565b6040830152565b8c820360808e01526127ea565b9c60a08b0152565b60c0890152565b60e0870152565b610100850152565b6001600160a01b0316610120830152565b610140818503910152611cc5565b9592969994919893909761292c600090565b50339a6129446110856009546001600160a01b031690565b986129636020633408e470809c61295a60405190565b93849260e01b90565b825260049082905afa908115610d8a5761298f918f61298a92600092612a41575b50612671565b6126fe565b6129a46110856008546001600160a01b031690565b9b6129cd602063322f86a69c6129c56110856009546001600160a01b031690565b60405161295a565b825260049082905afa908115610d8a57600091612a23575b506040519e8f9d8e6129f8819f60e01b90565b81526004019c612a079d612870565b03815a602094600091f1908115610d8a57600091610d62575090565b612a3b915060203d8111610d8357610d7b81836106be565b386129e5565b612a5a91925060203d8111610d8357610d7b81836106be565b9038612984565b15612a6857565b60405162461bcd60e51b815280610b54600482016020808252818101527f566f74696e6720776569676874206f662074686520636861696e20697320302e604082015260600190565b6101a860a0611152565b612ac3612ab1565b906000825260208080808086016060815201600081520160008152016000905250565b6101a8612abb565b91909160408184031261019757612b056040611152565b926000612b1282846101d2565b90850152602082013567ffffffffffffffff811161019757611d5192016117c4565b929190612b43611190826117ac565b93818552602080860192028101918383116101975781905b838210612b69575050505050565b813567ffffffffffffffff811161019757602091612b8a8784938701612aee565b815201910190612b5b565b6101a8913691612b34565b805182526101a891604081019160200151906020818403910152610278565b906101a891612ba0565b90612bdf612bd5835190565b8083529160200190565b9081612bf16020830284019460200190565b926000915b838310612c0557505050505090565b90919293946020612c28612c2183856001950387528951612bbf565b9760200190565b9301930191939290612bf6565b80518252906101a890608080612c5a60a0840160208701518582036020870152612bc9565b6040808701516001600160a01b03169085015294612c7d60608201516060860152565b0151910152565b9081526040602082018190526101a892910190612c35565b339291612cb46110856009546001600160a01b031690565b90633408e470916020612cc660405190565b8092612cd28660e01b90565b825260049082905afa908115610d8a57612cf99161298a91600091612fe5575b5087612671565b600194600492612d146110856009546001600160a01b031690565b6020612d1f60405190565b8092612d2b8560e01b90565b825260049082905afa908115610d8a57612d5291610ef791600091612fc7575b508661258f565b96600097612d6261122e8a610e0d565b11908115612f06575b50612d7590612a61565b612d8a6110856009546001600160a01b031690565b916020612d9660405190565b8094612da28560e01b90565b825260049082905afa908115610d8a57612dd0610ef7612e0293612e23986020978d92612ee7575b5061258f565b94612df0612ddc612ae6565b99612de78a8d8d0152565b868b0192612b95565b90526001600160a01b03166040880152565b612e176110856009546001600160a01b031690565b60405194859260e01b90565b825260049082905afa918215610d8a57612e5192612e4a918791612ec9575b506060860152565b6080840152565b612e666110856008546001600160a01b031690565b9063c3a3d43b91803b1561019757612e86858094612e91610f3060405190565b845260048401612c84565b03925af18015610d8a57612ea3575050565b816101ca92903d10612ec2575b612eba81836106be565b81019061047f565b503d612eb0565b612ee1915060203d8111610d8357610d7b81836106be565b38612e42565b612eff919250883d8111610d8357610d7b81836106be565b9038612dca565b6004915001612f206110856009546001600160a01b031690565b906020612f2c60405190565b8093612f388660e01b90565b825260049082905afa918215610d8a57612d7592612f9492610ef7928c92612fa7575b50612f8f612f6860405190565b602080820194855290938491612f83908e6102ac82856125c6565b908103825203836106be565b612618565b612fa061122e8a610e0d565b1190612d6b565b612fc091925060203d8111610d8357610d7b81836106be565b9038612f5b565b612fdf915060203d8111610d8357610d7b81836106be565b38612d4b565b612ffd915060203d8111610d8357610d7b81836106be565b38612cf2565b6111f56130486101ca9261301660405190565b9283916004602084017f41304fac000000000000000000000000000000000000000000000000000000008152016102b0565b60008091613054815190565b906020016a636f6e736f6c652e6c6f675afa50565b60408082526101a893919261308091840190610278565b916020818403910152610278565b906130486101ca926111f56130a260405190565b9384926004602085017f4b5c42770000000000000000000000000000000000000000000000000000000081520161306956fea2646970667358221220873a6db00a75064dfb7c740ed9ffd0d5541dc07b0c455e13258c57f2b376b94a64736f6c63430008120033";


// Disassemble the bytecode
//const parsedBytecode = ethers.utils.parseBytecode(bytecode);

// Log the parsed bytecode
//console.log(parsedBytecode);

const variableName = "denemeString";
const variablePosition = bytecode.indexOf(variableName);

console.log(`Variable ${variableName} position: ${variablePosition}`);