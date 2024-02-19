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