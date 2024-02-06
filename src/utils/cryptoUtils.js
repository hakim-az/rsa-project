// cryptoUtils.js
import rsaPemFromModExp from 'rsa-pem-from-mod-exp';

export const encryptFile = async (file) => {
    try {
      // Generate RSA key pair
      const { publicKey, privateKey } = await crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        },
        true,
        ['encrypt', 'decrypt']
      );
  
      // Convert public key to PEM format
      const pemPublicKey = rsaPemFromModExp(publicKey.modulus, publicKey.publicExponent);
  
      // Read file as an array buffer
      const fileBuffer = await file.arrayBuffer();
  
      // Encrypt file with the public key
      const encryptedBuffer = await crypto.subtle.encrypt(
        {
          name: 'RSA-OAEP',
        },
        publicKey,
        fileBuffer
      );
  
      // You can return additional information if needed
      return {
        encryptedBuffer,
        pemPublicKey,
        privateKey,
      };
    } catch (error) {
      throw new Error('File encryption failed: ' + error.message);
    }
  };

export const decryptFile = async (file, privateKey) => {
  try {
    // Decrypt file with the private key
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'RSA-OAEP',
      },
      privateKey,
      new Uint8Array(await file.arrayBuffer())
    );

    // Convert decrypted buffer to text
    const decryptedText = new TextDecoder().decode(decryptedBuffer);

    return decryptedText;
  } catch (error) {
    throw new Error('File decryption failed: ' + error.message);
  }
};
