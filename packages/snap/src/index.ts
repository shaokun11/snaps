import { OnRpcRequestHandler, OnTransactionHandler } from '@metamask/snaps-types';
import { panel, text, copyable, heading, divider } from '@metamask/snaps-ui';


export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
  switch (request.method) {
    case 'zkConfirm':
      const params = request.params as any;
      console.log("---params----------",params)
      let from = params.from
      let to = params.to
      let token = params.token
      let fee = params.fee
      let items = params.items
      let all = params.allAmount
      let amount = params.amount
      let reward = params.reward || "Experimental"
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            heading("ZkPayroll"),
            divider(),
            text(`Network: **${from}-->${to}**`),
            text(`Amount: **${amount} ${token}**`),
            text(`Platform Fee: **${fee} ${token}**`),
            text(`Items: **${items}**`),
            text(`XLD token reward: **${reward}**`),
            divider(),
            text(`TotalAmount to Pay: **${all} ${token}**`),
          ]),
        },
      });
    default:
      throw new Error('Method not found.');
  }
};
