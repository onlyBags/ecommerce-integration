import { createCipheriv, createDecipheriv } from 'crypto';
import { ValueTransformer } from 'typeorm';
import { envConfig } from '@dg-live/ecommerce-config';

const { cypherAlgorithm, cypherKey, cypherIV } = envConfig;
const algorithm = cypherAlgorithm;
const key = Buffer.from(cypherKey, 'hex');
const iv = Buffer.from(cypherIV, 'hex');

export const stringToBool: ValueTransformer = {
  from: (dbValue) => {
    return dbValue === '1' || dbValue === 1 || dbValue === true;
  },
  to: (entityValue) => {
    return entityValue;
  },
};

export const encrypt: ValueTransformer = {
  to: (dbValue) => {
    if (!dbValue) return dbValue;
    const cipher = createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(dbValue, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  },
  from: (entityValue) => {
    if (!entityValue) return entityValue;
    const decipheriv = createDecipheriv(algorithm, key, iv);
    let decrypted = decipheriv.update(entityValue, 'hex', 'utf8');
    decrypted += decipheriv.final('utf8');
    return decrypted;
  },
};
