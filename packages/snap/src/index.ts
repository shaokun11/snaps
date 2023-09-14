import { OnRpcRequestHandler, OnTransactionHandler } from '@metamask/snaps-types';
import { panel, text, copyable, heading, divider } from '@metamask/snaps-ui';
import { ethers } from 'ethers'

let p: ethers.Provider

function getProvider() {
  if (!p) {
    //@ts-ignore
    let e = window["ethereum"]
    p = new ethers.BrowserProvider(e)
  }
  return p
}

async function getGasPrice() {
  // let provider = getProvider()
  // let data = await provider.getFeeData()
  // return data.gasPrice!!
  // now we only support sepolia, so fixed it
  return 3 * 1e9
}

async function estmateGas(bytecode: string) {
  let provider = getProvider()
  let contract = new ethers.ContractFactory([], bytecode)
  const estimatedGas = await provider.estimateGas(await contract.getDeployTransaction())
  return estimatedGas
}

export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
  switch (request.method) {
    case 'check_bytecode':
      let gasPrice = await getGasPrice()
      let params: any = request.params
      let { bytecode, newBytecode }: any = params
      let gas = await estmateGas(bytecode)
      let feeBefore = ethers.formatEther((ethers.toBigInt(gasPrice) * ethers.toBigInt(gas)).toString())
      gas = await estmateGas(newBytecode)
      let feeAfter = ethers.formatEther((ethers.toBigInt(gasPrice) * ethers.toBigInt(gas)).toString())
      let fb = +parseFloat(feeBefore).toFixed(6)
      let fa = +parseFloat(feeAfter).toFixed(6)
      const per = (a: number, b: number) => {
        return ((a - b) * 100 / a).toFixed(2) + "%"
      }
      const name = params.name || "Tether USD"
      const symbol = params.symbol || "USDT"
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            heading("EthZip Report"),
            divider(),
            text(`Contract Type: ERC20`),
            text(`Contract Name: ${name}`),
            text(`Contract Symbol: ${symbol}`),
            divider(),
            text(`Original Contract Size: ${bytecode.length / 2} bytes`),
            text(`Original Depoly Fee: ${fb} ETH `),
            divider(),
            text(`Contract Size:**${newBytecode.length / 2} bytes**`),
            text(`Compressed Size:**${per(bytecode.length, newBytecode.length)}**`),
            text(`Deploy Fee with EthZip:**${fa} ETH**`),
            text(`Compressed Fee:**${per(fb, fa)}**`),
          ]),
        },
      });
    case 'hello':
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            text(`Hello, **${origin}**!`),
            text('This custom confirmation is just for display purposes.'),
            text(
              'But you can edit the snap source code to make it do something, if you want to!',
            ),
          ]),
        },
      });
    default:
      throw new Error('Method not found.');
  }
};
