// FileDecryptor.js
import { useState } from 'react';
import { decryptFile } from '../utils/cryptoUtils';

const FileDecryptor = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDecrypt = async () => {
    try {
      if (file) {
        await decryptFile(file);
        // Handle the decryption process completion or any other logic
      } else {
        console.error('No file selected for decryption.');
      }
    } catch (error) {
      console.error('Decryption failed:', error.message);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleDecrypt}>Decrypt File</button>
    </div>
  );
};

export default FileDecryptor;
