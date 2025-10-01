import { useState, useCallback } from 'react';

interface BiometricAuthResult {
  success: boolean;
  error?: string;
  data?: any;
}

interface StoredCredentials {
  email: string;
  hashedId: string;
}

export const useBiometricAuth = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  // Check if WebAuthn is supported
  const checkWebAuthnSupport = useCallback(() => {
    const supported = window.PublicKeyCredential && 
                     navigator.credentials && 
                     navigator.credentials.create;
    setIsSupported(!!supported);
    return !!supported;
  }, []);

  // Check if biometric authentication is available
  const checkBiometricAvailability = useCallback(async () => {
    if (!checkWebAuthnSupport()) return false;

    try {
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      setIsAvailable(available);
      return available;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      setIsAvailable(false);
      return false;
    }
  }, [checkWebAuthnSupport]);

  // Create a new passkey
  const createPasskey = useCallback(async (email: string, userName: string): Promise<BiometricAuthResult> => {
    if (!isSupported || !isAvailable) {
      return { success: false, error: 'المصادقة الحيوية غير مدعومة على هذا الجهاز' };
    }

    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: challenge,
          rp: {
            name: 'كلية الآمال الجامعية',
            id: window.location.hostname,
          },
          user: {
            id: new TextEncoder().encode(email),
            name: email,
            displayName: userName,
          },
          pubKeyCredParams: [
            { alg: -7, type: 'public-key' }, // ES256
            { alg: -257, type: 'public-key' }, // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
            requireResidentKey: false,
          },
          timeout: 60000,
        },
      }) as PublicKeyCredential;

      if (credential) {
        // Store credential info locally
        const credentialInfo = {
          email,
          credentialId: Array.from(new Uint8Array(credential.rawId)),
          userName,
          createdAt: new Date().toISOString(),
        };
        
        localStorage.setItem('biometric_credential', JSON.stringify(credentialInfo));
        
        return { success: true, data: credentialInfo };
      }

      return { success: false, error: 'فشل في إنشاء مفتاح المرور' };
    } catch (error: any) {
      console.error('Error creating passkey:', error);
      let errorMessage = 'حدث خطأ في إنشاء مفتاح المرور';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'تم إلغاء العملية أو انتهت صلاحيتها';
      } else if (error.name === 'InvalidStateError') {
        errorMessage = 'مفتاح المرور موجود بالفعل';
      }
      
      return { success: false, error: errorMessage };
    }
  }, [isSupported, isAvailable]);

  // Authenticate with passkey
  const authenticateWithPasskey = useCallback(async (): Promise<BiometricAuthResult> => {
    if (!isSupported || !isAvailable) {
      return { success: false, error: 'المصادقة الحيوية غير مدعومة على هذا الجهاز' };
    }

    try {
      const storedCredential = localStorage.getItem('biometric_credential');
      if (!storedCredential) {
        return { success: false, error: 'لم يتم العثور على مفتاح مرور محفوظ' };
      }

      const credInfo = JSON.parse(storedCredential);
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge: challenge,
          rpId: window.location.hostname,
          allowCredentials: [{
            type: 'public-key',
            id: new Uint8Array(credInfo.credentialId),
          }],
          userVerification: 'required',
          timeout: 60000,
        },
      }) as PublicKeyCredential;

      if (assertion) {
        return { 
          success: true, 
          data: { 
            email: credInfo.email,
            userName: credInfo.userName,
            authenticatedAt: new Date().toISOString()
          }
        };
      }

      return { success: false, error: 'فشل في المصادقة' };
    } catch (error: any) {
      console.error('Error authenticating with passkey:', error);
      let errorMessage = 'حدث خطأ في المصادقة';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'تم إلغاء المصادقة أو انتهت صلاحيتها';
      } else if (error.name === 'InvalidStateError') {
        errorMessage = 'حالة المصادقة غير صحيحة';
      }
      
      return { success: false, error: errorMessage };
    }
  }, [isSupported, isAvailable]);

  // Get stored credentials info
  const getStoredCredentials = useCallback((): StoredCredentials | null => {
    const stored = localStorage.getItem('biometric_credential');
    if (!stored) return null;
    
    try {
      const parsed = JSON.parse(stored);
      return {
        email: parsed.email,
        hashedId: parsed.credentialId.slice(0, 8).join('') // First 8 bytes as identifier
      };
    } catch {
      return null;
    }
  }, []);

  // Remove stored credentials
  const removeStoredCredentials = useCallback(() => {
    localStorage.removeItem('biometric_credential');
  }, []);

  return {
    isSupported,
    isAvailable,
    checkWebAuthnSupport,
    checkBiometricAvailability,
    createPasskey,
    authenticateWithPasskey,
    getStoredCredentials,
    removeStoredCredentials,
  };
};