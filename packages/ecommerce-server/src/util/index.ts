// import { getRandomValues } from 'crypto';
import crypto from 'crypto';
const CHARS =
  '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const getPassword = (length: number = 16) => {
  let password = '';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    password += CHARS[array[i] % CHARS.length];
  }
  return password;
};
