import CryptoJS from 'crypto-js';
const secretKey = 'N)9j-3x9E^_npFU4';
export const encryptText = (text) => {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
};

export const decryptText = (cipherText) => {
    const bytes  = CryptoJS.AES.decrypt(cipherText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};
