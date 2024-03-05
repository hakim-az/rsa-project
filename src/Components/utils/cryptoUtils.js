// STEP 01 : Convert PEM public key to CryptoKey
export const importPublicKey = async (pemKey) => {
    const keyData = pemKey
        .replace('-----BEGIN PUBLIC KEY-----', '')
        .replace('-----END PUBLIC KEY-----', '')
        .replace(/\s/g, '');

    const arrayBuffer = new Uint8Array(atob(keyData).split('').map(char => char.charCodeAt(0))).buffer;

    return window.crypto.subtle.importKey(
        'spki',
        arrayBuffer,
        { name: 'RSA-OAEP', hash: 'SHA-256' },
        true,
        ['encrypt']
    );
};



// STEP 02 : Convert PEM private key to CryptoKey
export const importPrivateKey = async (pemPrivateKey) => {
    // Remove the first and last lines of the PEM string
    const pemContents = pemPrivateKey.replace(/-----BEGIN PRIVATE KEY-----/, '').replace(/-----END PRIVATE KEY-----/, '');
    
    // Decode the Base64-encoded key data
    const binaryDerKey = atob(pemContents);
    
    // Convert the binary key data to a Uint8Array
    const keyData = new Uint8Array(binaryDerKey.length);
    for (let i = 0; i < binaryDerKey.length; ++i) {
        keyData[i] = binaryDerKey.charCodeAt(i);
    }
    
    // Import the key using crypto.subtle.importKey
    return crypto.subtle.importKey(
        'pkcs8',
        keyData,
        {
        name: 'RSA-OAEP',
        hash: { name: 'SHA-256' },
        },
        false,
        ['decrypt'] // Key can be used for decryption
    );
};



// STEP 03 : generate symmetric key
export const generateSymmetricKey = async () => {
    try {
        // Generate a symmetric key using AES-GCM algorithm with a key length of 256 bits
        const key = await window.crypto.subtle.generateKey(
            {
                name: 'AES-GCM',
                length: 256,
            },
            true, // Whether the key is extractable (for export)
            ['encrypt', 'decrypt'] // Key usages
        );

        // The result is a CryptoKey object containing the generated key
        return key;
    } catch (error) {
        console.error('Error generating symmetric key:', error);
        throw error;
    }
}



// STEP 04 : encrypt symmetric key
export const encryptSymmetricKeyWithPublicKey = async (pubKey, symKey) => {
    try {
        // Export the symmetric key material
        const rawSymmetricKey = await window.crypto.subtle.exportKey('raw', symKey);

        // Encrypt the symmetric key with the public key
        const encryptedSymmetricKey = await window.crypto.subtle.encrypt(
            {
                name: 'RSA-OAEP',
            },
            pubKey,
            rawSymmetricKey
        );

        // The result is an ArrayBuffer containing the encrypted symmetric key
        return encryptedSymmetricKey;
    } catch (error) {
        console.error('Error encrypting symmetric key:', error);
        throw error;
    }
}

// STEP 06 : decrypt  encrypted symmetric key with private key
export const decryptStringWithPrivateKey = async (encryptedKeyString, privateKey) => {
    try {
      // Convert the Base64 string to ArrayBuffer
      const encryptedKeyBuffer = base64ToArrayBuffer(encryptedKeyString);
  
      // Decrypt the symmetric key with the private key
      const decryptedSymmetricKey = await window.crypto.subtle.decrypt(
        {
          name: 'RSA-OAEP',
        },
        privateKey,
        encryptedKeyBuffer
      );
  
      return decryptedSymmetricKey;
    } catch (error) {
      console.error('Error decrypting symmetric key:', error);
      throw error;
    }
  }
  
  // Utility function to convert Base64 string to ArrayBuffer
  function base64ToArrayBuffer(base64String) {
    const binaryString = window.atob(base64String);
    const length = binaryString.length;
    const uint8Array = new Uint8Array(length);
  
    for (let i = 0; i < length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }
  
    return uint8Array.buffer;
  }




  export const  importSymmetricKeyFromArrayBuffer = async (symmetricKeyArrayBuffer) => {
    try {
        // Import the ArrayBuffer as a CryptoKey
        const importedSymmetricKey = await window.crypto.subtle.importKey(
          'raw',
          symmetricKeyArrayBuffer,
          { name: 'AES-GCM', length: 256 }, // Assuming a 256-bit AES key
          true,
          ['encrypt', 'decrypt']
        );
    
        return importedSymmetricKey;
      } catch (error) {
        console.error('Error importing symmetric key:', error);
        throw error;
      }
  }






























// STEP 06 : Convert PEM symmetric key to CryptoKey
export const importSymmetricKey = async (base64SymmetricKey) => {
    // Decode the Base64-encoded key
    const decodedKey = atob(base64SymmetricKey);

    // Convert the decoded key to a Uint8Array
    const keyArray = new Uint8Array(decodedKey.length);
    for (let i = 0; i < decodedKey.length; ++i) {
        keyArray[i] = decodedKey.charCodeAt(i);
    }

    // Import the key using crypto.subtle.importKey
    return window.crypto.subtle.importKey(
        'raw', // Key format is raw
        keyArray, // The key data
        { name: 'AES-GCM' }, // Algorithm details
        true, // The key is extractable
        ['encrypt', 'decrypt'] // Key can be used for encryption and decryption
    );
};