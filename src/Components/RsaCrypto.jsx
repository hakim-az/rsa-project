import { useState } from 'react';

const RsaCrypto = () => {
  const [publicKey, setPublicKey] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [fileInput, setFileInput] = useState(null);
  const [encryptedFile, setEncryptedFile] = useState(null);
  const [decryptedFile, setDecryptedFile] = useState(null);

  const generateKeyPair = async () => {
    const keys = await crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true,
      ['encrypt', 'decrypt']
    );

    setPublicKey(await crypto.subtle.exportKey('spki', keys.publicKey));
    setPrivateKey(await crypto.subtle.exportKey('pkcs8', keys.privateKey));
  };

  const encryptFile = async () => {
    const fileArrayBuffer = await fileInput.arrayBuffer();
    const publicKeyObject = await crypto.subtle.importKey(
      'spki',
      publicKey,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false,
      ['encrypt']
    );
  
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      publicKeyObject,
      new Uint8Array(fileArrayBuffer)
    );
  
    setEncryptedFile(new Blob([encryptedData]));
  };
  

  const decryptFile = async () => {
    const privateKeyObject = await crypto.subtle.importKey(
      'pkcs8',
      privateKey,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false,
      ['decrypt']
    );

    const encryptedArrayBuffer = await encryptedFile.arrayBuffer();
    const decryptedData = await crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      privateKeyObject,
      encryptedArrayBuffer
    );

    setDecryptedFile(new Blob([decryptedData]));
  };

  const handleFileChange = (e) => {
    setFileInput(e.target.files[0]);
  };

  const downloadFile = (file, fileName) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h1>Web Crypto API Asymmetric Encryption</h1>
      <button onClick={generateKeyPair}>Generate Key Pair</button>
      <br />
      <input type="file" onChange={handleFileChange} />
      <br />
      <button onClick={encryptFile} disabled={!publicKey || !fileInput}>
        Encrypt File
      </button>
      <button onClick={decryptFile} disabled={!privateKey || !encryptedFile}>
        Decrypt File
      </button>
      <br />
      {encryptedFile && (
        <button onClick={() => downloadFile(encryptedFile, 'encryptedFile')}>
          Download Encrypted File
        </button>
      )}
      {decryptedFile && (
        <button onClick={() => downloadFile(decryptedFile, 'decryptedFile')}>
          Download Decrypted File
        </button>
      )}
    </div>
  );
};

export default RsaCrypto;
