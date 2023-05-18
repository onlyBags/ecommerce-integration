const crypto = require('crypto');

const generateRandomKey = (length) => {
  return crypto.randomBytes(length).toString('hex');
};

const generateRandomIV = (length) => {
  return crypto.randomBytes(length).toString('hex');
};

const key = generateRandomKey(32); // 32 bytes for AES-256
const iv = generateRandomIV(16); // 16 bytes for AES-256-CBC

console.log('key:', key);
console.log('iv:', iv);
