import { recover } from 'web3-eth-accounts';

export const verifySignature = async (
  signature: string,
  message: string,
  address: string
): Promise<boolean> => {
  const signer = recover(message, signature);
  return signer.toLowerCase() === address.toLowerCase();
};

