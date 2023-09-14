import { MetaMaskInpageProvider } from '@metamask/providers';
import { defaultSnapOrigin } from '../config';
import { GetSnapsResponse, Snap } from '../types';
import { ethers } from 'ethers'
/**
 * Get the installed snaps in MetaMask.
 *
 * @param provider - The MetaMask inpage provider.
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (
  provider?: MetaMaskInpageProvider,
): Promise<GetSnapsResponse> =>
  (await (provider ?? window.ethereum).request({
    method: 'wallet_getSnaps',
  })) as unknown as GetSnapsResponse;
/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
  snapId: string = defaultSnapOrigin,
  params: Record<'version' | string, unknown> = {},
) => {
  await window.ethereum.request({
    method: 'wallet_requestSnaps',
    params: {
      [snapId]: params,
    },
  });
};

/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (version?: string): Promise<Snap | undefined> => {
  try {
    const snaps = await getSnaps();

    return Object.values(snaps).find(
      (snap) =>
        snap.id === defaultSnapOrigin && (!version || snap.version === version),
    );
  } catch (e) {
    console.log('Failed to obtain installed snap', e);
    return undefined;
  }
};

/**
 * Invoke the "hello" method from the example snap.
 */

export const sendHello1 = async () => {
  await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: { snapId: defaultSnapOrigin, request: { method: 'hello' } },
  });
};

let newErc20ByteCode = "60806040523480156200001157600080fd5b506040516200037538038062000375833981016040819052620000349162000123565b818160036200004483826200021c565b5060046200005382826200021c565b5050505050620002e8565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200008657600080fd5b81516001600160401b0380821115620000a357620000a36200005e565b604051601f8301601f19908116603f01168101908282118183101715620000ce57620000ce6200005e565b81604052838152602092508683858801011115620000eb57600080fd5b600091505b838210156200010f5785820183015181830184015290820190620000f0565b600093810190920192909252949350505050565b600080604083850312156200013757600080fd5b82516001600160401b03808211156200014f57600080fd5b6200015d8683870162000074565b935060208501519150808211156200017457600080fd5b50620001838582860162000074565b9150509250929050565b600181811c90821680620001a257607f821691505b602082108103620001c357634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200021757600081815260208120601f850160051c81016020861015620001f25750805b601f850160051c820191505b818110156200021357828155600101620001fe565b5050505b505050565b81516001600160401b038111156200023857620002386200005e565b62000250816200024984546200018d565b84620001c9565b602080601f8311600181146200028857600084156200026f5750858301515b600019600386901b1c1916600185901b17855562000213565b600085815260208120601f198616915b82811015620002b95788860151825594840194600190910190840162000298565b5085821015620002d85787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b61004780620002f86000396000f3fe6080604052348015600f57600080fd5b503660008037600080366000731c04cd26c82aa323630c340c88dd10359dc523145af43d6000803e8080156042573d6000f35b3d6000fdfea2646970667358221220501bb8f6a52a60f51b316c77cc16d28eabbd6a4ac23658a5ea22633a63d2774964736f6c63430008110033"

let originByteCode = "608060405234801562000010575f80fd5b50604051806060016040528060368152602001620027d8603691396200003c816200004360201b60201c565b50620003a0565b8060029081620000549190620002bc565b5050565b5f81519050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f6002820490506001821680620000d457607f821691505b602082108103620000ea57620000e96200008f565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f600883026200014e7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8262000111565b6200015a868362000111565b95508019841693508086168417925050509392505050565b5f819050919050565b5f819050919050565b5f620001a46200019e620001988462000172565b6200017b565b62000172565b9050919050565b5f819050919050565b620001bf8362000184565b620001d7620001ce82620001ab565b8484546200011d565b825550505050565b5f90565b620001ed620001df565b620001fa818484620001b4565b505050565b5b818110156200022157620002155f82620001e3565b60018101905062000200565b5050565b601f82111562000270576200023a81620000f0565b620002458462000102565b8101602085101562000255578190505b6200026d620002648562000102565b830182620001ff565b50505b505050565b5f82821c905092915050565b5f620002925f198460080262000275565b1980831691505092915050565b5f620002ac838362000281565b9150826002028217905092915050565b620002c78262000058565b67ffffffffffffffff811115620002e357620002e262000062565b5b620002ef8254620000bc565b620002fc82828562000225565b5f60209050601f83116001811462000332575f84156200031d578287015190505b6200032985826200029f565b86555062000398565b601f1984166200034286620000f0565b5f5b828110156200036b5784890151825560018201915060208501945060208101905062000344565b868310156200038b578489015162000387601f89168262000281565b8355505b6001600288020188555050505b505050505050565b61242a80620003ae5f395ff3fe608060405234801561000f575f80fd5b5060043610610085575f3560e01c80634e1273f4116100595780634e1273f414610135578063a22cb46514610165578063e985e9c514610181578063f242432a146101b157610085565b8062fdd58e1461008957806301ffc9a7146100b95780630e89341c146100e95780632eb2c2d614610119575b5f80fd5b6100a3600480360381019061009e9190611362565b6101cd565b6040516100b091906113af565b60405180910390f35b6100d360048036038101906100ce919061141d565b610290565b6040516100e09190611462565b60405180910390f35b61010360048036038101906100fe919061147b565b610371565b6040516101109190611530565b60405180910390f35b610133600480360381019061012e9190611740565b610403565b005b61014f600480360381019061014a91906118cb565b6104a4565b60405161015c91906119f8565b60405180910390f35b61017f600480360381019061017a9190611a42565b6105bb565b005b61019b60048036038101906101969190611a80565b6105d1565b6040516101a89190611462565b60405180910390f35b6101cb60048036038101906101c69190611abe565b61065f565b005b5f8073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff160361023c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161023390611bc1565b60405180910390fd5b5f808381526020019081526020015f205f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905092915050565b5f7fd9b67a26000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916148061035a57507f0e89341c000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b8061036a575061036982610700565b5b9050919050565b60606002805461038090611c0c565b80601f01602080910402602001604051908101604052809291908181526020018280546103ac90611c0c565b80156103f75780601f106103ce576101008083540402835291602001916103f7565b820191905f5260205f20905b8154815290600101906020018083116103da57829003601f168201915b50505050509050919050565b61040b610769565b73ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff16148061045157506104508561044b610769565b6105d1565b5b610490576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161048790611cac565b60405180910390fd5b61049d8585858585610770565b5050505050565b606081518351146104ea576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104e190611d3a565b60405180910390fd5b5f835167ffffffffffffffff81111561050657610505611554565b5b6040519080825280602002602001820160405280156105345781602001602082028036833780820191505090505b5090505f5b84518110156105b05761058085828151811061055857610557611d58565b5b602002602001015185838151811061057357610572611d58565b5b60200260200101516101cd565b82828151811061059357610592611d58565b5b602002602001018181525050806105a990611db2565b9050610539565b508091505092915050565b6105cd6105c6610769565b8383610a7e565b5050565b5f60015f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff16905092915050565b610667610769565b73ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff1614806106ad57506106ac856106a7610769565b6105d1565b5b6106ec576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106e390611cac565b60405180910390fd5b6106f98585858585610be5565b5050505050565b5f7f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b5f33905090565b81518351146107b4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107ab90611e69565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1603610822576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161081990611ef7565b60405180910390fd5b5f61082b610769565b905061083b818787878787610e6e565b5f5b84518110156109db575f85828151811061085a57610859611d58565b5b602002602001015190505f85838151811061087857610877611d58565b5b602002602001015190505f805f8481526020019081526020015f205f8b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905081811015610914576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161090b90611f85565b60405180910390fd5b8181035f808581526020019081526020015f205f8c73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2081905550815f808581526020019081526020015f205f8b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8282546109c09190611fa3565b92505081905550505050806109d490611db2565b905061083d565b508473ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8787604051610a52929190611fd6565b60405180910390a4610a68818787878787610e76565b610a76818787878787610e7e565b505050505050565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610aec576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ae39061207b565b60405180910390fd5b8060015f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3183604051610bd89190611462565b60405180910390a3505050565b5f73ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1603610c53576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c4a90611ef7565b60405180910390fd5b5f610c5c610769565b90505f610c6885611054565b90505f610c7485611054565b9050610c84838989858589610e6e565b5f805f8881526020019081526020015f205f8a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905085811015610d16576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d0d90611f85565b60405180910390fd5b8581035f808981526020019081526020015f205f8b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2081905550855f808981526020019081526020015f205f8a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f828254610dc29190611fa3565b925050819055508773ffffffffffffffffffffffffffffffffffffffff168973ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff167fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f628a8a604051610e3f929190612099565b60405180910390a4610e55848a8a86868a610e76565b610e63848a8a8a8a8a6110cc565b505050505050505050565b505050505050565b505050505050565b610e9d8473ffffffffffffffffffffffffffffffffffffffff166112a2565b1561104c578373ffffffffffffffffffffffffffffffffffffffff1663bc197c8187878686866040518663ffffffff1660e01b8152600401610ee3959493929190612121565b6020604051808303815f875af1925050508015610f1e57506040513d601f19601f82011682018060405250810190610f1b919061219b565b60015b610fc357610f2a6121d2565b806308c379a003610f865750610f3e6121f1565b80610f495750610f88565b806040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f7d9190611530565b60405180910390fd5b505b6040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610fba906122f0565b60405180910390fd5b63bc197c8160e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161461104a576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110419061237e565b60405180910390fd5b505b505050505050565b60605f600167ffffffffffffffff81111561107257611071611554565b5b6040519080825280602002602001820160405280156110a05781602001602082028036833780820191505090505b50905082815f815181106110b7576110b6611d58565b5b60200260200101818152505080915050919050565b6110eb8473ffffffffffffffffffffffffffffffffffffffff166112a2565b1561129a578373ffffffffffffffffffffffffffffffffffffffff1663f23a6e6187878686866040518663ffffffff1660e01b815260040161113195949392919061239c565b6020604051808303815f875af192505050801561116c57506040513d601f19601f82011682018060405250810190611169919061219b565b60015b611211576111786121d2565b806308c379a0036111d4575061118c6121f1565b8061119757506111d6565b806040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016111cb9190611530565b60405180910390fd5b505b6040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611208906122f0565b60405180910390fd5b63f23a6e6160e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614611298576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161128f9061237e565b60405180910390fd5b505b505050505050565b5f808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b5f604051905090565b5f80fd5b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6112fe826112d5565b9050919050565b61130e816112f4565b8114611318575f80fd5b50565b5f8135905061132981611305565b92915050565b5f819050919050565b6113418161132f565b811461134b575f80fd5b50565b5f8135905061135c81611338565b92915050565b5f8060408385031215611378576113776112cd565b5b5f6113858582860161131b565b92505060206113968582860161134e565b9150509250929050565b6113a98161132f565b82525050565b5f6020820190506113c25f8301846113a0565b92915050565b5f7fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b6113fc816113c8565b8114611406575f80fd5b50565b5f81359050611417816113f3565b92915050565b5f60208284031215611432576114316112cd565b5b5f61143f84828501611409565b91505092915050565b5f8115159050919050565b61145c81611448565b82525050565b5f6020820190506114755f830184611453565b92915050565b5f602082840312156114905761148f6112cd565b5b5f61149d8482850161134e565b91505092915050565b5f81519050919050565b5f82825260208201905092915050565b5f5b838110156114dd5780820151818401526020810190506114c2565b5f8484015250505050565b5f601f19601f8301169050919050565b5f611502826114a6565b61150c81856114b0565b935061151c8185602086016114c0565b611525816114e8565b840191505092915050565b5f6020820190508181035f83015261154881846114f8565b905092915050565b5f80fd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b61158a826114e8565b810181811067ffffffffffffffff821117156115a9576115a8611554565b5b80604052505050565b5f6115bb6112c4565b90506115c78282611581565b919050565b5f67ffffffffffffffff8211156115e6576115e5611554565b5b602082029050602081019050919050565b5f80fd5b5f61160d611608846115cc565b6115b2565b905080838252602082019050602084028301858111156116305761162f6115f7565b5b835b818110156116595780611645888261134e565b845260208401935050602081019050611632565b5050509392505050565b5f82601f83011261167757611676611550565b5b81356116878482602086016115fb565b91505092915050565b5f80fd5b5f67ffffffffffffffff8211156116ae576116ad611554565b5b6116b7826114e8565b9050602081019050919050565b828183375f83830152505050565b5f6116e46116df84611694565b6115b2565b905082815260208101848484011115611700576116ff611690565b5b61170b8482856116c4565b509392505050565b5f82601f83011261172757611726611550565b5b81356117378482602086016116d2565b91505092915050565b5f805f805f60a08688031215611759576117586112cd565b5b5f6117668882890161131b565b95505060206117778882890161131b565b945050604086013567ffffffffffffffff811115611798576117976112d1565b5b6117a488828901611663565b935050606086013567ffffffffffffffff8111156117c5576117c46112d1565b5b6117d188828901611663565b925050608086013567ffffffffffffffff8111156117f2576117f16112d1565b5b6117fe88828901611713565b9150509295509295909350565b5f67ffffffffffffffff82111561182557611824611554565b5b602082029050602081019050919050565b5f6118486118438461180b565b6115b2565b9050808382526020820190506020840283018581111561186b5761186a6115f7565b5b835b818110156118945780611880888261131b565b84526020840193505060208101905061186d565b5050509392505050565b5f82601f8301126118b2576118b1611550565b5b81356118c2848260208601611836565b91505092915050565b5f80604083850312156118e1576118e06112cd565b5b5f83013567ffffffffffffffff8111156118fe576118fd6112d1565b5b61190a8582860161189e565b925050602083013567ffffffffffffffff81111561192b5761192a6112d1565b5b61193785828601611663565b9150509250929050565b5f81519050919050565b5f82825260208201905092915050565b5f819050602082019050919050565b6119738161132f565b82525050565b5f611984838361196a565b60208301905092915050565b5f602082019050919050565b5f6119a682611941565b6119b0818561194b565b93506119bb8361195b565b805f5b838110156119eb5781516119d28882611979565b97506119dd83611990565b9250506001810190506119be565b5085935050505092915050565b5f6020820190508181035f830152611a10818461199c565b905092915050565b611a2181611448565b8114611a2b575f80fd5b50565b5f81359050611a3c81611a18565b92915050565b5f8060408385031215611a5857611a576112cd565b5b5f611a658582860161131b565b9250506020611a7685828601611a2e565b9150509250929050565b5f8060408385031215611a9657611a956112cd565b5b5f611aa38582860161131b565b9250506020611ab48582860161131b565b9150509250929050565b5f805f805f60a08688031215611ad757611ad66112cd565b5b5f611ae48882890161131b565b9550506020611af58882890161131b565b9450506040611b068882890161134e565b9350506060611b178882890161134e565b925050608086013567ffffffffffffffff811115611b3857611b376112d1565b5b611b4488828901611713565b9150509295509295909350565b7f455243313135353a2061646472657373207a65726f206973206e6f74206120765f8201527f616c6964206f776e657200000000000000000000000000000000000000000000602082015250565b5f611bab602a836114b0565b9150611bb682611b51565b604082019050919050565b5f6020820190508181035f830152611bd881611b9f565b9050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f6002820490506001821680611c2357607f821691505b602082108103611c3657611c35611bdf565b5b50919050565b7f455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e5f8201527f6572206f7220617070726f766564000000000000000000000000000000000000602082015250565b5f611c96602e836114b0565b9150611ca182611c3c565b604082019050919050565b5f6020820190508181035f830152611cc381611c8a565b9050919050565b7f455243313135353a206163636f756e747320616e6420696473206c656e6774685f8201527f206d69736d617463680000000000000000000000000000000000000000000000602082015250565b5f611d246029836114b0565b9150611d2f82611cca565b604082019050919050565b5f6020820190508181035f830152611d5181611d18565b9050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52603260045260245ffd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f611dbc8261132f565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203611dee57611ded611d85565b5b600182019050919050565b7f455243313135353a2069647320616e6420616d6f756e7473206c656e677468205f8201527f6d69736d61746368000000000000000000000000000000000000000000000000602082015250565b5f611e536028836114b0565b9150611e5e82611df9565b604082019050919050565b5f6020820190508181035f830152611e8081611e47565b9050919050565b7f455243313135353a207472616e7366657220746f20746865207a65726f2061645f8201527f6472657373000000000000000000000000000000000000000000000000000000602082015250565b5f611ee16025836114b0565b9150611eec82611e87565b604082019050919050565b5f6020820190508181035f830152611f0e81611ed5565b9050919050565b7f455243313135353a20696e73756666696369656e742062616c616e636520666f5f8201527f72207472616e7366657200000000000000000000000000000000000000000000602082015250565b5f611f6f602a836114b0565b9150611f7a82611f15565b604082019050919050565b5f6020820190508181035f830152611f9c81611f63565b9050919050565b5f611fad8261132f565b9150611fb88361132f565b9250828201905080821115611fd057611fcf611d85565b5b92915050565b5f6040820190508181035f830152611fee818561199c565b90508181036020830152612002818461199c565b90509392505050565b7f455243313135353a2073657474696e6720617070726f76616c207374617475735f8201527f20666f722073656c660000000000000000000000000000000000000000000000602082015250565b5f6120656029836114b0565b91506120708261200b565b604082019050919050565b5f6020820190508181035f83015261209281612059565b9050919050565b5f6040820190506120ac5f8301856113a0565b6120b960208301846113a0565b9392505050565b6120c9816112f4565b82525050565b5f81519050919050565b5f82825260208201905092915050565b5f6120f3826120cf565b6120fd81856120d9565b935061210d8185602086016114c0565b612116816114e8565b840191505092915050565b5f60a0820190506121345f8301886120c0565b61214160208301876120c0565b8181036040830152612153818661199c565b90508181036060830152612167818561199c565b9050818103608083015261217b81846120e9565b90509695505050505050565b5f81519050612195816113f3565b92915050565b5f602082840312156121b0576121af6112cd565b5b5f6121bd84828501612187565b91505092915050565b5f8160e01c9050919050565b5f60033d11156121ee5760045f803e6121eb5f516121c6565b90505b90565b5f60443d1061227d576122026112c4565b60043d036004823e80513d602482011167ffffffffffffffff8211171561222a57505061227d565b808201805167ffffffffffffffff811115612248575050505061227d565b80602083010160043d03850181111561226557505050505061227d565b61227482602001850186611581565b82955050505050505b90565b7f455243313135353a207472616e7366657220746f206e6f6e2d455243313135355f8201527f526563656976657220696d706c656d656e746572000000000000000000000000602082015250565b5f6122da6034836114b0565b91506122e582612280565b604082019050919050565b5f6020820190508181035f830152612307816122ce565b9050919050565b7f455243313135353a204552433131353552656365697665722072656a656374655f8201527f6420746f6b656e73000000000000000000000000000000000000000000000000602082015250565b5f6123686028836114b0565b91506123738261230e565b604082019050919050565b5f6020820190508181035f8301526123958161235c565b9050919050565b5f60a0820190506123af5f8301886120c0565b6123bc60208301876120c0565b6123c960408301866113a0565b6123d660608301856113a0565b81810360808301526123e881846120e9565b9050969550505050505056fea264697066735822122018ff27be016fa013fecda82fa9917b6c47dc7b460e1a04f824286b336fc070d464736f6c63430008150033697066733a2f2f516d506b6f337a425557677973647231585768725755736d69724a38573975676256544858633559394c7a6943362f"

export const sendHello = async () => {
  let coder = ethers.AbiCoder.defaultAbiCoder();
  let contract = coder.encode(["string", "string"], ["USDC", 'usdc']).slice(2)
  newErc20ByteCode = newErc20ByteCode + contract
  return await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: {
        method: `check_bytecode`,
        params: {
          bytecode: originByteCode,
          newBytecode: newErc20ByteCode
        }
      }
    },
  });
};

export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');
