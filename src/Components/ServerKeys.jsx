import { useState, useEffect } from 'react';
import { importPublicKey, 
         importPrivateKey,
         generateSymmetricKey,  
         encryptSymmetricKeyWithPublicKey, 
         decryptStringWithPrivateKey,
         importSymmetricKeyFromArrayBuffer } from './utils/cryptoUtils';
import backendKeys from '../Keys.json'; 



const ServerKeys = () => {
    // files
    const [file, setFile] = useState(null);
    const [encryptedFile, setEncryptedFile] = useState(null);
    const [decryptedFile, setDecryptedFile] = useState(null);
    // asymmetric keys
    const [publicKey, setPublicKey] = useState(null)
    const [privateKey, setPrivateKey] = useState(null)
    // symmetric keys
    const [symmetricKey, setSymmetricKey] = useState(null)
    const [symmetricKeyEncrypted, setSymmetricKeyEncrypted] = useState(null)
    const [symmetricKeyDecrypted, setSymmetricKeyDecrypted] = useState(null)
    const [symmetricKeyToString, setSymmetricKeyToString] = useState(null)
    const [symmetricKeyImported, setSymmetricKeyImported] = useState(null)

    // Handle file change
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };


   
    // encrypt files using hybrid cryptography
    const encryptFile = async () => {
        if (!file || !publicKey || !symmetricKeyImported ) return;

        // Generate a random IV (Initialization Vector)
        const iv = window.crypto.getRandomValues(new Uint8Array(12));

        // Get the raw symmetric key data
        const rawSymmetricKey = await window.crypto.subtle.exportKey('raw', symmetricKeyImported);

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
    
    // STEP 01 : Import public and private keys
    useEffect(() => {
        const importKeys = async () => {
          try {
            // import public key
            const importedPublicKey = await importPublicKey(backendKeys.public_key);
            if (importedPublicKey !== null) {
              setPublicKey(importedPublicKey);
            }

            // import private key
            const importedPrivateKey = await importPrivateKey(backendKeys.private_key);
            if (importedPrivateKey !== null) {
              setPrivateKey(importedPrivateKey);
            }
          } catch (error) {
            console.error('Error importing public key:', error);
          }
        };
      
        importKeys();
      }, []);

    // STEP 02 : Generate symmetric key
    useEffect(() => {
        const generateSymKey = async () => {
          try {
            // generation
            const generatedSymmetricKey = await generateSymmetricKey();
            if (generatedSymmetricKey !== null) {
              setSymmetricKey(generatedSymmetricKey);
            }
          } catch (error) {
            console.error('Error importing public key:', error);
          }
        };
      
        generateSymKey();
      }, []);


    // STEP 03 : Encrypt symmetric key with public key
    useEffect(() => {
        const encryptSymKey = async () => {
          try {
            // generation
            if(publicKey && symmetricKey){
                const encryptedKey = await encryptSymmetricKeyWithPublicKey(publicKey, symmetricKey);
                if (encryptedKey) {
                  setSymmetricKeyEncrypted(encryptedKey);
                }
            }

          } catch (error) {
            console.error('Error importing public key:', error);
          }
        };
      
        encryptSymKey();
      }, [publicKey, symmetricKey]);

    // STEP 04 : convert the encrypted symmetric key to string
    useEffect(() => {
        const toString = (arrayBuffer) => {
            const uint8Array = new Uint8Array(arrayBuffer);
            const base64String = btoa(String.fromCharCode.apply(null, uint8Array));
            return base64String;
        };
      
        setSymmetricKeyToString(toString(symmetricKeyEncrypted));
      }, [symmetricKeyEncrypted]);

    //   POST symmetric key enctypted as string

    //   GET symmetric key enctypted as string

    // STEP 05 : decrypt  the received encrypted symmetric key using private key
    useEffect(() => {
        const decryptSymKey = async () => {
          try {
            // generation
            if(privateKey && symmetricKeyToString){
                const decryptedKey = await decryptStringWithPrivateKey(symmetricKeyToString, privateKey);
                if (decryptedKey) {
                    setSymmetricKeyDecrypted(decryptedKey);
                }
            }

          } catch (error) {
            console.error('Error importing public key:', error);
          }
        };
      
        decryptSymKey();
      }, [privateKey, symmetricKeyToString]);

    // STEP 06 : import the symmetric key
    useEffect(() => {
        const importSymKey = async () => {
          try {
            // generation
            if(symmetricKeyDecrypted){
                const decryptedKey = await importSymmetricKeyFromArrayBuffer(symmetricKeyDecrypted);
                if (decryptedKey) {
                    setSymmetricKeyImported(decryptedKey);
                }
            }

          } catch (error) {
            console.error('Error importing public key:', error);
          }
        };
      
        importSymKey();
      }, [symmetricKeyDecrypted]);


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
