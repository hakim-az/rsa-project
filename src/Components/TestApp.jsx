import { useState } from 'react';


const TestApp = () => {
    // states
    const [file, setFile] = useState(null);
    const [encryptedFile, setEncryptedFile] = useState(null);
    const [decryptedFile, setDecryptedFile] = useState(null);

    const backendKey = {
        "public_key": "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2lMRGrUkEmEL022NkMmffoo/tjI1+iSdpaqwPOF7BYYrYhjVFzVojrPGCL6Dxc93py3RL0fxhAm+h1poMFm0XrvQWt4cgWj8mjqgU5jS/T5heG+rfLqCRFfBzdqYOG7+JPVbHfy2SJkDcAWeO7gbk7/gArwzOiMVYioqIYC2e2pjeQU5mJnsuAfgpelciU+orGJTFSG/Mw48GkHt8DMzzYojXr3my2P9zc+HliVNnRBOiWyhxd0zsHNP2MFPWJkIBx7k5BQ/4DI7EKDcUegfEGZr/NKqR217YHunNiqe4zaBZNzSYOuFJCxA4/MFZznY9JaAhXjBLcPtJv+VEcVIIQIDAQAB-----END PUBLIC KEY-----",
        "symmetric_key": "eyJpdiI6IjRnWFRUTDNpWWt3bVAzcjc3MzFPblE9PSIsInZhbHVlIjoiV0lpLzJxMlBOR1pYTHJjVUdHZUZvVFhWVGNjTDNrcUdFN2lHTWRRbGdvVUpCWUdwVXowQmVlUjBCc0ZWaE9qcSIsIm1hYyI6IjZmNTVjY2Q3OWQwODIwMzM1OGQ0NTczYzdmZWE0NzAwZTc4MzJlNGQ1ZDY1NmIxY2JjMGM2OTZlN2EzMmIzN2IiLCJ0YWciOiIifQ==",
        "private_key": "-----BEGIN PRIVATE KEY-----MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDaUxEatSQSYQvTbY2QyZ9+ij+2MjX6JJ2lqrA84XsFhitiGNUXNWiOs8YIvoPFz3enLdEvR/GECb6HWmgwWbReu9Ba3hyBaPyaOqBTmNL9PmF4b6t8uoJEV8HN2pg4bv4k9Vsd/LZImQNwBZ47uBuTv+ACvDM6IxViKiohgLZ7amN5BTmYmey4B+Cl6VyJT6isYlMVIb8zDjwaQe3wMzPNiiNevebLY/3Nz4eWJU2dEE6JbKHF3TOwc0/YwU9YmQgHHuTkFD/gMjsQoNxR6B8QZmv80qpHbXtge6c2Kp7jNoFk3NJg64UkLEDj8wVnOdj0loCFeMEtw+0m/5URxUghAgMBAAECggEAH8F6WOylGQlFm5SxRTCWguTf/IPUJxTBW3H23XwclUKdN9EN2ajakvsiIG55o0GYkVgQN7Tas85pCK4FPpclrava1AS/l7EqINLLNC2j7tLugYKYqnVEcmVjWqpjfr3iOIT5omR6LRgYkGg4yk3usPB1SGCQgPHOb+9bHnFm2Y9sqktNmN1oRK0vGrfy5qV16Kt/mDbK6vHa7wZuXbbiuAgvOUvTEkApvTmVML3MQTTK2zC/OxtIZIoymZRADbrkQrfh9lyBQcAafjHNEOEQP4TOPnnD1nFz/GDXpCjquKhqSR72Yl0vEACD3Kjy9RqcGZrXWRPldAZ+B+tkhbW5ewKBgQDyGtpzabFEM49/DOHapV+3VWaZEJNNPo0N4ZCTa/rcDRcA42W8meqGEximENOtBD2kt9grZe2Bj0RuT9c0XnpBI//RuNuU0UUC2LYtWjEGlIIlfinz3FfkUFy6echSGGnPZym5aNEQsiL5dg/YNQPH0ICzzGpVG0F3j/ZeAEHRWwKBgQDm2tFVuKn5VjnytswWHeG4pPKCEnUJSvjTNh5ISocZKtBDPvxBZPauhH93huB1WJjC4BRBom4eOk3UBOIqgAJ/kckh5+wgeiM0vv3x/n4lKFRSpxppCsJhV9RflVWkCy6Vx0HA9+ZsoCGxvtW+4sHl5dlgSFZXIIsGVH15XzMpMwKBgGQVHcEgLBuZhPRsiuEsBAlx0FvuMjZ4aS8X1ABdXvKgpqXDW0dACWcrdcEQq7CWVDVHmqE2HZy1cQB5GOmZNMjA7PvxgzRd3j1zALx20FV8BuEg6o7Yw6yqW+rqdRka5oLKjsEKx4IzYanmWF50a/+p/cpV8o8EGWgnpxzs1kiJAoGAQyZNE8kmL++j5XTEgn5opOPd4nXp8y0Kma05O7/p8ikg8R6GE6OBmZvS0/q4mYmOzciOO9U6gLJm5xAQlVos39yRC7rBVWURjosrpNNo7/f+JxiSNxG5HsWEcdUnVxMlls2h07aIIPqnMmOXGvIsgmnMRBRmgOtnZQz4fnBxmj8CgYB5HDxhbfeAcIBFP3DyOBTqavcQTam95hQGQ48rJ7A6E5tpTRf4SPiTUX9dpTP9nEgo2c2+ymtqvaapvgS/Jkn2omaGdjegrUqB01Wc5IgAtNAPV9R2gv+ai+Gd3RRpcYrtEY7AAsKu9FePdmFBPtgRyrrZ3AMuseLEd/jZSKppvQ==-----END PRIVATE KEY-----",
        "symmetric_key_decrypted": "ez9Vn+Yj8UXnLqasE8luvaLpn99Ns0O2+7U2AHptCgo=",
    }


    // handle file change
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };

    // Convert PEM public key to CryptoKey
    const importPublicKey = async (pemKey) => {
        const keyData = pemKey
            .replace('-----BEGIN PUBLIC KEY-----', '')
            .replace('-----END PUBLIC KEY-----', '')
            .replace(/\s/g, '');

        const arrayBuffer = new Uint8Array(atob(keyData).split('').map(char => char.charCodeAt(0))).buffer;

        return window.crypto.subtle.importKey(
            'spki', // SubjectPublicKeyInfo format
            arrayBuffer,
            { name: 'RSA-OAEP', hash: 'SHA-256' },
            true,
            ['encrypt']
        );
    };

    const importPrivateKey = async (pemPrivateKey) => {
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
            hash: { name: 'SHA-256' }, // Specify the hash algorithm used
          },
          false,
          ['decrypt'] // Key can be used for decryption
        );
      };

    // const importSymmetricKey = async (base64SymmetricKey) => {
    //     // Decode the Base64-encoded key
    //     const decodedKey = atob(base64SymmetricKey);
    
    //     // Convert the decoded key to a Uint8Array
    //     const keyArray = new Uint8Array(decodedKey.length);
    //     for (let i = 0; i < decodedKey.length; ++i) {
    //         keyArray[i] = decodedKey.charCodeAt(i);
    //     }
    
    //     // Import the key using crypto.subtle.importKey
    //     return window.crypto.subtle.importKey(
    //         'raw', // Key format is raw
    //         keyArray, // The key data
    //         { name: 'AES-GCM' }, // Algorithm details
    //         false, // The key is not extractable
    //         ['encrypt', 'decrypt'] // Key can be used for encryption and decryption
    //     );
    // };

    const importSymmetricKey = async (base64SymmetricKey) => {
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
    


    // encrypt files using hybrid cryptography
    const encryptFile = async () => {
        if (!file || !backendKey.public_key || !backendKey.symmetric_key) return;

        const publicKeyConverted = await importPublicKey(backendKey.public_key);
        console.log('publicKeyConverted', publicKeyConverted);
        const symetrucKeyConverted = await importSymmetricKey(backendKey.symmetric_key_decrypted);
        console.log('symetrucKeyConverted', symetrucKeyConverted);

        // Generate a random IV (Initialization Vector)
        const iv = window.crypto.getRandomValues(new Uint8Array(12));

        // Get the raw symmetric key data
        const rawSymmetricKey = await window.crypto.subtle.exportKey('raw', symetrucKeyConverted);

        // Encrypt the actual file content with the symmetric key
        const encryptedBuffer = await window.crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv: iv,
            },
            symetrucKeyConverted,
            await file.arrayBuffer()
        );

        // Encrypt the symmetric key with the public key
        const encryptedSymmetricKey = await window.crypto.subtle.encrypt(
            {
                name: 'RSA-OAEP',
            },
            publicKeyConverted,
            rawSymmetricKey
        );

        // Concatenate IV, encrypted symmetric key, and encrypted data
        const encryptedData = new Uint8Array([...iv, ...new Uint8Array(encryptedSymmetricKey), ...new Uint8Array(encryptedBuffer)]);
        const encryptedBlob = new Blob([encryptedData], { type: file.type });
        setEncryptedFile(encryptedBlob);
    };

    // decrypt files using hybrid cryptography
    const decryptFile = async () => {
        if (!encryptedFile || !backendKey.private_key) return;

        const privateKeyConverted = await importPrivateKey(backendKey.private_key);
        console.log('privateKeyConverted', privateKeyConverted);

        // Get the ArrayBuffer of the encrypted file
        const encryptedBuffer = await encryptedFile.arrayBuffer();

        // Extract the IV and the encrypted symmetric key
        const iv = new Uint8Array(encryptedBuffer.slice(0, 12));
        const encryptedSymmetricKey = new Uint8Array(encryptedBuffer.slice(12, 268)); // Assuming a 256-bit key size

        // Decrypt the symmetric key with the private key
        const rawSymmetricKey = await window.crypto.subtle.decrypt(
            {
                name: 'RSA-OAEP',
            },
            privateKeyConverted,
            encryptedSymmetricKey
        );

        // The actual encrypted data starts from the 269th byte
        const encryptedData = new Uint8Array(encryptedBuffer.slice(268));

        // Decrypt using the provided IV and the decrypted symmetric key
        const decryptedBuffer = await window.crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: iv,
            },
            await window.crypto.subtle.importKey('raw', rawSymmetricKey, 'AES-GCM', true, ['encrypt', 'decrypt']),
            encryptedData
        );

        const decryptedBlob = new Blob([decryptedBuffer], { type: file.type });
        setDecryptedFile(decryptedBlob);
    };

    return (
        <div className='bg-blue-400 w-full h-screen'>
            {/* title */}
            <h1 className='text-5xl text-center font-bold py-10'>Hybrid File Encryption/Decryption in JavaScript</h1>
            {/* content */}
            <div className="container mx-auto w-full flex flex-col">
                {/* input */}
                <input className='bg-white self-center w-1/3 rounded-md p-2' type="file" onChange={handleFileChange} />
                {/* Key generation and ENC/DEC buttons */}
                <div className='w-1/2 mx-auto mt-10 flex items-center justify-around space-x-2'>
                    <button className='bg-black text-white py-2 w-1/4 rounded-md hover:bg-white hover:text-black' onClick={encryptFile}>Encrypt File</button>
                    <button className='bg-black text-white py-2 w-1/4 rounded-md hover:bg-white hover:text-black' onClick={decryptFile}>Decrypt File</button>
                </div>
                {/* Download buttons */}
                <div className='flex items-center justify-around w-full mt-14'>
                    {encryptedFile && (
                        <div className='w-1/3 bg-white rounded-md p-5 flex flex-col'>
                            <h2 className='text-xl font-bold mb-2'>Encrypted File</h2>
                            <a className='bg-black text-white py-2 w-2/3 inline-block text-center mx-auto rounded-md self-center mt-10 hover:bg-blue-300 border-2 hover:text-black' href={URL.createObjectURL(encryptedFile)} download="encrypted-file">
                                Download Encrypted File
                            </a>
                        </div>
                    )}

                    {decryptedFile && (
                        <div className='w-1/3 bg-white rounded-md p-5 flex flex-col'>
                            <h2 className='text-xl font-bold mb-2'>Decrypted File</h2>
                            <a className='bg-black text-white py-2 w-2/3 inline-block text-center mx-auto rounded-md self-center mt-10 hover:bg-blue-300 border-2 hover:text-black' href={URL.createObjectURL(decryptedFile)} download="decrypted-file">
                                Download Decrypted File
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TestApp;
