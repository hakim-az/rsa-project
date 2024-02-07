import { useState } from 'react';

const CryptoApp = () => {
    // states
    const [file, setFile] = useState(null);
    const [encryptedFile, setEncryptedFile] = useState(null);
    const [decryptedFile, setDecryptedFile] = useState(null);
    const [symmetricKey, setSymmetricKey] = useState(null);

    // handle file change
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };

    // generate symetrique key
    const generateSymmetricKey = async () => {
        const key = await window.crypto.subtle.generateKey(
        {
            name: 'AES-GCM',
            length: 256,
        },
        true,
        ['encrypt', 'decrypt']
        );
        setSymmetricKey(key);
    };

    // encrypt files
    const encryptFile = async () => {
        if (!file || !symmetricKey) return;
    
        // Generate a random IV (Initialization Vector)
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
        const fileBuffer = await file.arrayBuffer();
        const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        symmetricKey,
        fileBuffer
        );
    
        // Concatenate IV and encrypted data
        const encryptedData = new Uint8Array([...iv, ...new Uint8Array(encryptedBuffer)]);
        const encryptedBlob = new Blob([encryptedData], { type: file.type });
        setEncryptedFile(encryptedBlob);
    };

    // decryp files
    const decryptFile = async () => {
        if (!encryptedFile || !symmetricKey) return;
    
        // Get the ArrayBuffer of the encrypted file
        const encryptedBuffer = await encryptedFile.arrayBuffer();
    
        // Extract the IV from the first 12 bytes of the encryptedBuffer
        const iv = new Uint8Array(encryptedBuffer.slice(0, 12));
    
        // The actual encrypted data starts from the 13th byte
        const encryptedData = new Uint8Array(encryptedBuffer.slice(12));
    
        // Decrypt using the provided IV
        const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        symmetricKey,
        encryptedData
        );
    
        const decryptedBlob = new Blob([decryptedBuffer], { type: file.type });
        setDecryptedFile(decryptedBlob);
    };
  
  return (
    <div className='bg-blue-400 w-full h-screen'>
    {/* title */}
    <h1 className='text-5xl text-center font-bold py-10'>Simple AES File Encryption/Decryption in JavaScript</h1>
    {/* content */}
    <div className="container mx-auto w-full flex flex-col">
        {/* input */}
        <input className='bg-white self-center w-96 rounded-md p-2' type="file" onChange={handleFileChange} />
        {/* ENC/DEC buttons */}
        <div className='w-1/2 mx-auto mt-10 flex items-center justify-evenly'>
            <button className='bg-black text-white py-2 w-1/4 rounded-md' onClick={generateSymmetricKey}>Generate Symmetric Key</button>
            <button className='bg-black text-white py-2 w-1/4 rounded-md' onClick={encryptFile}>Encrypt File</button>
            <button className='bg-black text-white py-2 w-1/4 rounded-md' onClick={decryptFile}>Decrypt File</button>
        </div>
        {/* Downlmoad buttons */}
        <div className='flex items-center justify-around w-full mt-14'>
            {encryptedFile && (
                <div className='w-1/3 bg-white rounded-md p-5 flex flex-col'>
                    <h2 className='text-xl font-bold mb-2'>Encrypted File</h2>
                    <a className='bg-black text-white py-2 w-2/3 inline-block text-center mx-auto rounded-md self-center mt-10' href={URL.createObjectURL(encryptedFile)} download="encrypted-file">
                        Download Encrypted File
                    </a>
                </div>
            )}

            {decryptedFile && (
                <div className='w-1/3 bg-white rounded-md p-5 flex flex-col'>
                    <h2 className='text-xl font-bold mb-2'>Decrypted File</h2>
                    <a className='bg-black text-white py-2 w-2/3 inline-block text-center mx-auto rounded-md self-center mt-10' href={URL.createObjectURL(decryptedFile)} download="decrypted-file">
                        Download Decrypted File
                    </a>
                </div>
            )}
        </div>

    </div>
    </div>
  );
};

export default CryptoApp;
