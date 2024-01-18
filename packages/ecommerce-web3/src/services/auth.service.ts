import { recover } from 'web3-eth-accounts';

export const verifySignature = async (
  signature: string,
  message: string,
  address: string
): Promise<boolean> => {
  const signer = recover(message, signature);
  return signer.toLowerCase() === address.toLowerCase();
};

// {
//   "message": "Login",
//   "address": "0xdaC8d078646f1a0Edf3dc700e044fA57eF17b928",
//   "signature": "0xfb1b50e6bc78f6d6acf42a54304f8824e07796c2723beeac3f17c7d02d304a1110d6b32d819da8714e5514d11cb791e52d710b7014c7efebb24a78b0433c30471b"
// }
