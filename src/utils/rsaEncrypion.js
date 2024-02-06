// 1. Prepare key pair into pem string
const encryptAlgorithm = {
    name: "RSA-OAEP",
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    extractable: true,
    hash: {
      name: "SHA-256"
    }
  };
  
  function addNewLines(input) {
    // Implement addNewLines function logic here if needed
  }
  
  function _arrayBufferToBase64(buffer) {
    // Implement _arrayBufferToBase64 function logic here if needed
  }
  
  function _toPrivatePem(privateKey) {
    const b64 = addNewLines(_arrayBufferToBase64(privateKey));
    const pem = "-----BEGIN RSA PRIVATE KEY-----\n" + b64 + "-----END RSA PRIVATE KEY-----";
  
    return pem;
  }
  
  function _toPublicPem(privateKey) {
    const b64 = addNewLines(_arrayBufferToBase64(privateKey));
    const pem = "-----BEGIN PUBLIC KEY-----\n" + b64 + "-----END PUBLIC KEY-----";
  
    return pem;
  }
  
  async function generateRSAKeyPair() {
    const keyPair = await window.crypto.subtle.generateKey(
      encryptAlgorithm,
      true,
      ["encrypt", "decrypt"]
    );
  
    const keyPairPem = {
      publicKey: '',
      privateKey: '',
    };
    const exportedPrivateKey = await window.crypto.subtle.exportKey(
      "pkcs8",
      keyPair.privateKey
    );
    keyPairPem.privateKey = _toPrivatePem(exportedPrivateKey);
  
    const exportedPublicKey = await window.crypto.subtle.exportKey(
      "spki",
      keyPair.publicKey
    );
    keyPairPem.publicKey = _toPublicPem(exportedPublicKey);
  
    return keyPairPem;
  }
  
  // 2. Encrypt string with public key
  function _base64StringToArrayBuffer(base64) {
    // Implement _base64StringToArrayBuffer function logic here if needed
  }
  
  function _convertPemToArrayBuffer(pem) {
    const lines = pem.split('\n');
    let encoded = '';
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().length > 0 &&
        lines[i].indexOf('-----BEGIN RSA PRIVATE KEY-----') < 0 &&
        lines[i].indexOf('-----BEGIN PUBLIC KEY-----') < 0 &&
        lines[i].indexOf('-----END RSA PRIVATE KEY-----') < 0 &&
        lines[i].indexOf('-----END PUBLIC KEY-----') < 0) {
        encoded += lines[i].trim();
      }
    }
    return _base64StringToArrayBuffer(encoded);
  }
  
  async function encryptRsa(fileArrayBuffer, pemString) {
    const keyArrayBuffer = _convertPemToArrayBuffer(pemString);
    // import public key
    const secretKey = await crypto.subtle.importKey('spki', keyArrayBuffer, encryptAlgorithm, true, ['encrypt']);
    // encrypt the text with the public key
    const ciphertextArrayBuffer = await crypto.subtle.encrypt({
      name: 'RSA-OAEP',
    }, secretKey, fileArrayBuffer);
  
    return ciphertextArrayBuffer;
  }
  
  async function encryptStringRsa(str, pemString) {
    // convert string into ArrayBuffer
    const encodedPlaintext = new TextEncoder().encode(str).buffer;
    const encrypted = await encryptRsa(encodedPlaintext, pemString);
    // store data into base64 string
    return _arrayBufferToBase64(encrypted);
  }
  
  // 3. Decrypt string with private key
  async function decryptRsa(fileArrayBuffer, pemString) {
    const keyArrayBuffer = _convertPemToArrayBuffer(pemString);
    // import private key
    const secretKey = await crypto.subtle.importKey('pkcs8', keyArrayBuffer, encryptAlgorithm, true, ['decrypt']);
    // decrypt the text with the public key
    const decryptedBuffer = await crypto.subtle.decrypt({
      name: 'RSA-OAEP',
    }, secretKey, fileArrayBuffer);
  
    return decryptedBuffer;
  }
  
  async function decryptStringRsa(str, pemString) {
    // convert base64 encoded input string into ArrayBuffer
    const encodedPlaintext = _base64StringToArrayBuffer(str);
    const decrypted = await decryptRsa(encodedPlaintext, pemString);
    // decode the decrypted ArrayBuffer output
    const uint8Array = new Uint8Array(decrypted);
    const textDecoder = new TextDecoder();
    const decodedString = textDecoder.decode(uint8Array);
    return decodedString;
  }
  