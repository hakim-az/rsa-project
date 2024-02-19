import { useState, useEffect } from 'react';
import backendKeys from '../keys.json'; 
import { importPublicKey, importPrivateKey, importSymmetricKey } from './utils/cryptoUtils';


const ServerKeys = () => {
    // States
    const [file, setFile] = useState(null);
    const [encryptedFile, setEncryptedFile] = useState(null);
    const [decryptedFile, setDecryptedFile] = useState(null);
    const [publicKey, setPublicKey] = useState()
    const [privateKey, setPrivateKey] = useState()
    const [symmetricKey, setSymmetricKey] = useState()

    // Handle file change
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };
    
    // encrypt files using hybrid cryptography
    const encryptFile = async () => {
        if (!file || !publicKey || !symmetricKey ) return;

        // Generate a random IV (Initialization Vector)
        const iv = window.crypto.getRandomValues(new Uint8Array(12));

        // Get the raw symmetric key data
        const rawSymmetricKey = await window.crypto.subtle.exportKey('raw', symmetricKey);

        // Encrypt the actual file content with the symmetric key
        const encryptedBuffer = await window.crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv: iv,
            },
            symmetricKey,
            await file.arrayBuffer()
        );

        // Encrypt the symmetric key with the public key
        const encryptedSymmetricKey = await window.crypto.subtle.encrypt(
            {
                name: 'RSA-OAEP',
            },
            publicKey,
            rawSymmetricKey
        );

        // Concatenate IV, encrypted symmetric key, and encrypted data
        const encryptedData = new Uint8Array([...iv, ...new Uint8Array(encryptedSymmetricKey), ...new Uint8Array(encryptedBuffer)]);
        const encryptedBlob = new Blob([encryptedData], { type: file.type });
        setEncryptedFile(encryptedBlob);
    };

    // decrypt files using hybrid cryptography
    const decryptFile = async () => {
        if (!encryptedFile || !privateKey) return;

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
            privateKey,
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

    // Fetch keys on component mount
    useEffect(() => {
        const fetchKeys = async () => {
            try {
                const publicKey = await importPublicKey(backendKeys.public_key);
                const privateKey = await importPrivateKey(backendKeys.private_key);
                const symmetricKey = await importSymmetricKey(backendKeys.symmetric_key_decrypted);

                setPublicKey(publicKey);
                setPrivateKey(privateKey);
                setSymmetricKey(symmetricKey);
            } catch (error) {
                console.error('Error fetching keys:', error);
            }
        };

        fetchKeys();
    }, []);

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
                    {/* encrypted file */}
                    {encryptedFile && (
                        <div className='w-1/3 bg-white rounded-md p-5 flex flex-col'>
                            <h2 className='text-xl font-bold mb-2'>Encrypted File</h2>
                            <a className='bg-black text-white py-2 w-2/3 inline-block text-center mx-auto rounded-md self-center mt-10 hover:bg-blue-300 border-2 hover:text-black' href={URL.createObjectURL(encryptedFile)} download="encrypted-file">
                                Download Encrypted File
                            </a>
                        </div>
                    )}
                    {/* decrypted file */}
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

export default ServerKeys;
