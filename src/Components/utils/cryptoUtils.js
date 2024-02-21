// Decrypt symmetric key
export const decryptSymmetricKey = async (symmetricKeyParams, privateKeyParams) => {
    try {
      // Convert the PEM-encoded private key to CryptoKey
      const privateKey = await importPrivateKey(privateKeyParams);
  
      // Decode the base64-encoded encrypted symmetric key
      const encryptedSymmetricKeyBuffer = base64UrlDecode(symmetricKeyParams);
  
      // Decrypt the symmetric key using RSA-OAEP algorithm
      const decryptedSymmetricKeyBuffer = await window.crypto.subtle.decrypt(
        {
          name: 'RSA-OAEP',
        },
        privateKey,
        encryptedSymmetricKeyBuffer
      );
  
      // Convert Uint8Array to base64 string
      const decryptedSymmetricKeyBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(decryptedSymmetricKeyBuffer)));
  
      return decryptedSymmetricKeyBase64;
    } catch (error) {
      console.error('Error decrypting symmetric key:', error);
      throw error; // Rethrow the error to be handled by the caller if needed
    }
  };

// Convert PEM public key to CryptoKey
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

// Convert PEM private key to CryptoKey
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

// Convert PEM symmetric key to CryptoKey
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


// Helper function to decode base64url-encoded strings
export const base64UrlDecode = (base64Url) => {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    const binaryString = atob(padded);
    const arrayBuffer = new ArrayBuffer(binaryString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
    }

    return arrayBuffer;
} 