import { useState } from 'react';

const FileCrypto = () => {
  const [encryptFile, setEncryptFile] = useState(null);
  const [decryptFile, setDecryptFile] = useState(null);

  const handleEncrypt = async () => {
    if (!encryptFile) return;

    try {
      // Step 1: Get the public key for asymmetric encryption
      const publicKey = await window.crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        },
        true,
        ['encrypt', 'decrypt']
      );

      // Step 2: Encrypt the file with the public key
      const fileArrayBuffer = await encryptFile.arrayBuffer();
      const encryptedData = await window.crypto.subtle.encrypt(
        {
          name: 'RSA-OAEP',
        },
        publicKey.publicKey,
        fileArrayBuffer
      );

      // Step 3: Save the encrypted file
      const encryptedBlob = new Blob([new Uint8Array(encryptedData)], { type: encryptFile.type });
      saveBlob(encryptedBlob, 'encrypted_file');
    } catch (error) {
      console.error('Encryption failed:', error);
      // Handle encryption error appropriately
    }
  };

  const handleDecrypt = async () => {
    if (!decryptFile) return;

    try {
      // Step 1: Get the private key for asymmetric decryption
      const privateKey = await window.crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        },
        true,
        ['decrypt']
      );

      // Step 2: Read the encrypted data from the file
      const encryptedArrayBuffer = await decryptFile.arrayBuffer();

      // Step 3: Decrypt the file with the private key
      const decryptedData = await window.crypto.subtle.decrypt(
        {
          name: 'RSA-OAEP',
        },
        privateKey.privateKey,
        encryptedArrayBuffer
      );

      // Step 4: Save the decrypted file
      const decryptedBlob = new Blob([new Uint8Array(decryptedData)], { type: decryptFile.type });
      saveBlob(decryptedBlob, 'decrypted_file');
    } catch (error) {
      console.error('Decryption failed:', error);
      // Handle decryption error appropriately
    }
  };

  const handleFileChange = (event, setFile) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const saveBlob = (blob, fileName) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  return (
    <div className="w-full h-screen bg-blue-400">
      {/* title */}
      <div className="mx-auto container">
        <h1 className="text-5xl font-bold pt-10 text-center">Asymmetric File Crypto</h1>
      </div>
      {/* Content */}
      <div className="mx-auto container w-full flex items-center justify-around mt-14">
        {/* encryption */}
        <div className="w-5/12 bg-white rounded-md p-8">
          <div className="flex flex-col items-start justify-between mb-6">
            <label className="text-xl font-semibold mb-2" htmlFor="encrypt">
              Encrypt file:
            </label>
            <input
              type="file"
              name="encryptFile"
              id="encrypt"
              accept=".txt,.docx,.pdf"
              onChange={(e) => handleFileChange(e, setEncryptFile)}
            />
          </div>
          <div className="flex items-center justify-around">
            <button className="bg-blue-400 rounded-md w-48 py-2" onClick={handleEncrypt}>
              Encrypt
            </button>
            <button className="bg-blue-400 rounded-md w-48 py-2">Download</button>
          </div>
        </div>
        {/* decryption */}
        <div className="w-5/12 bg-white rounded-md p-8">
          <div className="flex flex-col items-start justify-between mb-6">
            <label className="text-xl font-semibold mb-2" htmlFor="decrypt">
              Decrypt file:
            </label>
            <input
              type="file"
              name="decryptFile"
              id="decrypt"
              accept=".txt,.docx,.pdf"
              onChange={(e) => handleFileChange(e, setDecryptFile)}
            />
          </div>
          <div className="flex items-center justify-around">
            <button className="bg-blue-400 rounded-md w-48 py-2" onClick={handleDecrypt}>
              Decrypt
            </button>
            <button className="bg-blue-400 rounded-md w-48 py-2">Download</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileCrypto;
