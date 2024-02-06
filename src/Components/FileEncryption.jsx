import { useState, useEffect, useCallback } from 'react';

const FileEncryption = () => {
  const [file, setFile] = useState(null);
  const [encryptedData, setEncryptedData] = useState(null);
  const [decryptedData, setDecryptedData] = useState(null);
  const [encryptedFile, setEncryptedFile] = useState(null);

  // ------------------------Function to generate RSA key pair and save it to local storage--------------------------------
  const generateKeyPair = useCallback(async () => {
    try {
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        },
        true,
        ['encrypt', 'decrypt']
      );

      // Save keys to local storage
      const publicKeyExported = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
      const privateKeyExported = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

      localStorage.setItem('publicKey', btoa(String.fromCharCode.apply(null, new Uint8Array(publicKeyExported))));
      localStorage.setItem('privateKey', btoa(String.fromCharCode.apply(null, new Uint8Array(privateKeyExported))));

      return keyPair;
    } catch (error) {
      console.error('Key pair generation error:', error);
    }
  }, []);

  // --------------------------Function to load RSA key pair from local storage------------------------------------
  const loadKeys = useCallback(async () => {
    const publicKeyBase64 = localStorage.getItem('publicKey');
    const privateKeyBase64 = localStorage.getItem('privateKey');

    if (publicKeyBase64 && privateKeyBase64) {
      try {
        const publicKeyImported = await window.crypto.subtle.importKey(
          'spki',
          Uint8Array.from(atob(publicKeyBase64), (c) => c.charCodeAt(0)),
          {
            name: 'RSA-OAEP',
            hash: 'SHA-256',
          },
          true,
          ['encrypt']
        );

        const privateKeyImported = await window.crypto.subtle.importKey(
          'pkcs8',
          Uint8Array.from(atob(privateKeyBase64), (c) => c.charCodeAt(0)),
          {
            name: 'RSA-OAEP',
            hash: 'SHA-256',
          },
          true,
          ['decrypt']
        );

        return { publicKey: publicKeyImported, privateKey: privateKeyImported };
      } catch (error) {
        console.error('Key pair import error:', error);
      }
    } else {
      // Generate keys if not found in local storage
      return generateKeyPair();
    }
  }, [generateKeyPair]);

  // State to hold the key pair
  const [keyPair, setKeyPair] = useState(null);

  // Load keys from local storage on component mount
  useEffect(() => {
    const fetchData = async () => {
      const loadedKeyPair = await loadKeys();
      setKeyPair(loadedKeyPair);
    };

    fetchData();
  }, [loadKeys]); // Ensure this effect runs only once

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleEncryptedFileChange = (event) => {
    const selectedEncryptedFile = event.target.files[0];
    setEncryptedFile(selectedEncryptedFile);
  };

  // ------------------------------------ function to encrypt file ---------------------------------------------
  const handleEncrypt = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }
    // Check if key pair exists, generate if not
    if (!keyPair) {
      await generateKeyPair();
      const loadedKeyPair = await loadKeys(); // Reload keys after generation
      setKeyPair(loadedKeyPair);
    }
    try {
      // Read file content
      const fileBuffer = await file.arrayBuffer();

      // Encrypt file content
      const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
          name: 'RSA-OAEP',
        },
        keyPair.publicKey,
        fileBuffer
      );

      setEncryptedData(new Uint8Array(encryptedBuffer));
    } catch (error) {
      console.error('Encryption error:', error);
    }
  };

  // ------------------------------------- function to decrypt file -------------------------------------------------
  const handleDecrypt = async () => {
    if (!encryptedFile) {
      alert('Please select an encrypted file');
      return;
    }
    // Check if key pair exists, generate if not
    if (!keyPair) {
      await generateKeyPair();
      const loadedKeyPair = await loadKeys(); // Reload keys after generation
      setKeyPair(loadedKeyPair);
    }
    try {
      // Read encrypted file content
      const encryptedFileBuffer = await encryptedFile.arrayBuffer();

      // Decrypt the encrypted file content
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: 'RSA-OAEP',
        },
        keyPair.privateKey,
        encryptedFileBuffer
      );

      setDecryptedData(new Uint8Array(decryptedBuffer));
    } catch (error) {
      console.error('Decryption error:', error);
    }
  };

  return (
    <div className='w-full h-screen bg-blue-400'>
        {/* Title */}
        <h1 className='text-5xl text-center font-bold py-10'>Simple RSA File Encryption/Decryption in JavaScript</h1>
        <div className='container mx-auto flex items-center justify-evenly mt-14'>
            {/* Encryption */}
            <div className='w-5/12 flex flex-col bg-white p-5 rounded-md'>
                <h3 className='text-xl font-bold mb-2'>Encryption :</h3>
                <input type="file" onChange={handleFileChange} />
                <button className='bg-blue-400 h-10 rounded-md inline-block w-48 self-center text-lg mt-10' onClick={handleEncrypt}>Encrypt</button>
                {encryptedData && (
                <div>
                    <a
                    className='bg-blue-400 flex items-center justify-center rounded-md h-10 px-6 self-center text-lg mt-10'
                    href={`data:application/octet-stream;base64,${btoa(
                        String.fromCharCode.apply(null, encryptedData)
                    )}`}
                    download="encryptedFile.txt"
                    >
                    Download Encrypted File
                    </a>
                </div>
                )}
            </div>
            {/* Decryption */}
            <div className='w-5/12 flex flex-col bg-white p-5 rounded-md'>
                <h3 className='text-xl font-bold mb-2'>Decryption</h3>
                <input type="file" onChange={handleEncryptedFileChange} />
                <button className='bg-blue-400 py-2 rounded-md inline-block w-48 self-center text-lg mt-10' onClick={handleDecrypt}>Decrypt</button>
                {decryptedData && (
                <div>
                    <a
                    className='bg-blue-400 flex items-center justify-center rounded-md h-10 px-6 self-center text-lg mt-10'
                    href={`data:application/octet-stream;base64,${btoa(
                        String.fromCharCode.apply(null, decryptedData)
                    )}`}
                    download="decryptedFile.txt"
                    >
                    Download Decrypted File
                    </a>
                </div>
                )}
            </div> 
        </div>
    </div>
  );
};

export default FileEncryption;

