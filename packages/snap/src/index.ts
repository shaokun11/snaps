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
  let provider = getProvider()
  let data = await provider.getFeeData()
  return data.gasPrice!!
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
      let { bytecode, newBytecode }: any = request.params
      let gas = await estmateGas(bytecode)
      let feeBefore = ethers.formatEther((ethers.toBigInt(gasPrice) * ethers.toBigInt(gas)).toString())
      gas = await estmateGas(newBytecode)
      let feeAfter = ethers.formatEther((ethers.toBigInt(gasPrice) * ethers.toBigInt(gas)).toString())
      let fb = +parseFloat(feeBefore).toFixed(6)
      let fa = +parseFloat(feeAfter).toFixed(6)
      const per = (a: number, b: number) => {
        return ((a - b) * 100 / a).toFixed(2) + "%"
      }
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            heading("EthZip Report"),
            divider(),
            text(`Original Contract Size: ${bytecode.length / 2} bytes`),
            text(`Original Depoly fee: ${fb} ETH `),
            divider(),
            text(`Contract Size:**${newBytecode.length / 2} bytes**`),
            text(`Compressed Size:**${per(bytecode.length, newBytecode.length)}**`),
            text(`Deploy Fee with EthZip:**${fa} ETH**`),
            text(`Compressed Fee:**${per(fb, fa)}**`),
          ]),
        },
      });

    default:
      throw new Error('Method not found.');
  }
};
