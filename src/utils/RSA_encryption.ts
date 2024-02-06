// key generation
const encryptAlgorithm = {
    name: "RSA-OAEP",
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    extractable: true,
    hash: {
      name: "SHA-256"
    }
  }
  
  function _toPrivatePem(privateKey: ArrayBuffer) {
    const b64 = addNewLines(_arrayBufferToBase64(privateKey));
    const pem = "-----BEGIN RSA PRIVATE KEY-----\n" + b64 + "-----END RSA PRIVATE KEY-----";
    
    return pem;
  }
  
  function _toPublicPem(privateKey: ArrayBuffer) {
    const b64 = addNewLines(_arrayBufferToBase64(privateKey));
    const pem = "-----BEGIN PUBLIC KEY-----\n" + b64 + "-----END PUBLIC KEY-----";
    
    return pem;
  }
  
  
  export const generateRSAKeyPair = async () => {
    const keyPair = await window.crypto.subtle.generateKey(
        encryptAlgorithm,
        true,
        ["encrypt", "decrypt"]
      )
        
      const keyPairPem = {
        publicKey: '',
        privateKey: '',
      }
      const exportedPrivateKey = await window.crypto.subtle.exportKey(
        "pkcs8",
        keyPair.privateKey
      )
      keyPairPem.privateKey = _toPrivatePem(exportedPrivateKey);
        
      const exportedPublicKey = await window.crypto.subtle.exportKey(
        "spki",
        keyPair.publicKey
      )
      keyPairPem.publicKey = _toPublicPem(exportedPublicKey);
        
    return keyPairPem;
  }