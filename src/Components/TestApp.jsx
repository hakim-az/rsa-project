import { useState, useEffect } from 'react';
import { decryptSymmetricKey, importPublicKey, importPrivateKey, importSymmetricKey } from './utils/cryptoUtils';


const TestApp = () => {
    // States
    const [file, setFile] = useState(null);
    const [encryptedFile, setEncryptedFile] = useState(null);
    const [decryptedFile, setDecryptedFile] = useState(null);
    const [publicKey, setPublicKey] = useState()
    const [privateKey, setPrivateKey] = useState()
    const [symmetricKey, setSymmetricKey] = useState()
    const [decryptedSymmetricKey, setDecryptedSymmetricKey] = useState()
    // backend keys
    const backendKeys = {
        "public_key": "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1DCz4o9gFA0HnNl7ZhoaLDaURFzAWG03VdBc5UrUHme7vssRABLg31nE9eIp1JdTFApz8Rtrlh6ArtVyEkl4m315yTdk4+dvabrdGLAQqeQGYx9qnXe3QbvSBnm2kN7ua8jNBA+uTJT08wDBOUvYM5yAaireWUfbD8HnOhLn4Ahtlfpsol+mVLE1318r+wh7cggbCJahF+OSpUQCr4P+S4Z5bCX2OEF5X0Q9gPLOtf5femcc7BMOuWofdeljEOQYr4t7Sg5cibBQITcKZl9QksTpqcwgq2gSEf40i6i3BZuU64bp56fS5VdPlMYvzBQJUhla+4d+oyvi5nHD4TcTdQIDAQAB-----END PUBLIC KEY-----",
        "private_key": "-----BEGIN PRIVATE KEY-----MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDUMLPij2AUDQec2XtmGhosNpREXMBYbTdV0FzlStQeZ7u+yxEAEuDfWcT14inUl1MUCnPxG2uWHoCu1XISSXibfXnJN2Tj529put0YsBCp5AZjH2qdd7dBu9IGebaQ3u5ryM0ED65MlPTzAME5S9gznIBqKt5ZR9sPwec6EufgCG2V+myiX6ZUsTXfXyv7CHtyCBsIlqEX45KlRAKvg/5LhnlsJfY4QXlfRD2A8s61/l96ZxzsEw65ah916WMQ5Bivi3tKDlyJsFAhNwpmX1CSxOmpzCCraBIR/jSLqLcFm5Trhunnp9LlV0+Uxi/MFAlSGVr7h36jK+LmccPhNxN1AgMBAAECggEADCFOn0SH/w1xondSVRdn6KAkILZWrpdrwuWa8eaxsp1Gf9U2/xSVM1974XyQ3Jzb/HjOgPmK0HWk8Jm2IDKACQ+Gv0iB5X9tAJPUoN0rzrKA5Pi+TQszeDgG/STHGYgNBC9h/PnygmE/kYa5BQ//Z4/qTWdu95aigMeactjy1X07MGXYBgfkXzxqfapMYc2imB2q57FHoJtbYySBEMLt2yLeQdAHOpkLHudIu7zucg5ILKEO5cCk3tWfsSeNYXvK2g02rjddo3HH/z823BL+3hUglf69D0r5RXHDjNPesiVeo8N3bdymQ6Nt0HZh3Jj4IeIYavSRW4mhDhtJW04OAQKBgQDxiKVTeCf5TCbgPqFvLuSmPKQ3x7dO7FXExo0Rw1IaVRkReo76ecATddoLl9yws9fhyfEkWmX2ggibgjLeBLZElxnTwAlxink3rcCue6U3Zegk6CGmCG33Q2RLpoxLxk9cw8Gc5m9sIfHVqzViJOKT2mNCnsMaPKNf5kI9I4jQdQKBgQDg5iSFTnA52ojIE2n+zDUGY6qKOniHtvu2zvjMJIigwVG9T2wRq2wzYpI6LU2WyIhBkIjczj+NcEzyN+PaxAKe6TBiDUdhFbxPSMaJnDmkHq8lgQmOnwLy+dobSExRJNlwWRkYTK+YYrrS/Q9//zbgG3vbaHyftEKRtbdeqKzXAQKBgQCZsdE6LyCIs5udYF1LqbRX0AjTcePEdgER6SKFZhvNo88C31EyM900xO6OKAGH87jw9ZbcAiYV2aLuicginS76sIf/xZh8xpfiBU+x9/4nJVK2gXw/8ec/y4N73Cw0X6nKpsqCM+Q9E9CWnY6nuD7xxKsbDnmqLWHsuVH3I7CArQKBgCxdOdcSIhFHirPtIHuizNL11i5uWlhrQDxPl8StcEZF3Fn70NWreyynxTC0vxl/dWF5oYXtKZw9CvC9FbWR9PJkDadJ90qvfvYk5QVATB6T7vj2+2um8m3724qGOIfJPRtseAbTGdB1qWT1hpk5Pxn2Ufh2JB9c78TOk92YaIABAoGAW30IjvZP0LXpe/KBnL5hkMMSRn7YJZWr2lSC8HicjnyaNYaZOI21IWJmDqcEX4HyCKTo0xzzgsXktbIaqQsKt36p85Fq0zvaVLdBXuyI2qzhBVxnfMb+7TILHNhG5PT/Oi1wmcYKuhQeC0flU2n5lw8TF2xEm4OnK9oafvJPKCM=-----END PRIVATE KEY-----",
        "symmetric_key_encrypted": "wT87kSePw9Cetn1RNTHz7SuFgEq1HcGLreUmokLJAKfsyWHgVP5/R/SBqV5OBl9/11TExpcf9+9N6wcrp1yjk8rqgAuAMLg8v8qBDHaUG03uyzT1UXBBUY722YnZkKQGZPcD0/ImWi0zR3VZ3FX5ftQ7Fd1C2UnSXuBuNQJbwKwdASLK74qX9WM4HbugjUzwVnYayGZX5VhFpakuN4GSyPwFQXOvchWmsiSDx7cTuvDfhOJK5mLXY9k3k+ZepPIBjKDJ1b5ckI7wKqonNrafCOFaYK/HhUQkRFG4TPmZk+Jzg7zUKIl8B2uwdA7CHzEsT6z0dwvPa3IUxDZDLMPcCQ==",
        "symmetric_key_decrypted": "S4asLUFvXZDt26VQADaBK4zP5f3Z/TcwCKcJ5zPuuxc="
    }

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
            // Decrypt symmetric key
            const decryptedSymmetricKey = await decryptSymmetricKey(
                backendKeys.symmetric_key_encrypted,
                backendKeys.private_key
            );

            // Import public key
            const publicKeyImported = await importPublicKey(backendKeys.public_key);
    
            // Import private key
            const privateKeyImported = await importPrivateKey(backendKeys.private_key);

            // Import symmetric key
            const symmetricKeyImported = await importSymmetricKey(decryptedSymmetricKey);
    
            // Set the keys
            setDecryptedSymmetricKey(decryptedSymmetricKey)
            setPublicKey(publicKeyImported);
            setPrivateKey(privateKeyImported);
            setSymmetricKey(symmetricKeyImported);
                
          } catch (error) {
            console.error('Error fetching keys:', error);
          }
        };
    
        fetchKeys();
      }, [backendKeys.private_key, backendKeys.public_key, backendKeys.symmetric_key_encrypted, decryptedSymmetricKey]);


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

export default TestApp;
