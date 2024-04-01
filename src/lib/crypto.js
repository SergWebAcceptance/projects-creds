import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';

const secretKey = 'secret'; 

export function encryptData(text) {
  return AES.encrypt(text, secretKey).toString();
}

export function decryptData(ciphertext) {
  const bytes = AES.decrypt(ciphertext, secretKey);
  return bytes.toString(Utf8);
}
