// FileEncryptor.js
import { useState } from 'react';
import { encryptFile } from '../utils/cryptoUtils';

const FileEncryptor = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleEncrypt = async () => {
    try {
      if (file) {
        const encryptedFile = await encryptFile(file);
        // Handle the encrypted file, e.g., send it to the server or do something with it
        console.log('File encrypted successfully:', encryptedFile);
      } else {
        console.error('No file selected for encryption.');
      }
    } catch (error) {
      console.error('Encryption failed:', error.message);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleEncrypt}>Encrypt File</button>
    </div>
  );
};

export default FileEncryptor;
