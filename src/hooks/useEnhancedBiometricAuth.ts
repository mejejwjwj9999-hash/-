import { useState, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';

interface BiometricAuthResult {
  success: boolean;
  error?: string;
  data?: any;
}

interface StoredCredentials {
  email: string;
  hashedId: string;
}

interface BiometricType {
  type: 'fingerprint' | 'faceId' | 'voiceId' | 'irisId' | 'unknown';
  available: boolean;
}

export const useEnhancedBiometricAuth = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [availableTypes, setAvailableTypes] = useState<BiometricType[]>([]);

  // Check platform capabilities
  const checkPlatformSupport = useCallback(() => {
    if (Capacitor.isNativePlatform()) {
      // Native mobile platform - we'll use WebAuthn on mobile too for now
      return !!(window.PublicKeyCredential && navigator.credentials);
    } else if (window.PublicKeyCredential && navigator.credentials) {
      // Web platform with WebAuthn
      return true;
    }
    return false;
  }, []);

  // Enhanced biometric availability check
  const checkBiometricAvailability = useCallback(async () => {
    const platformSupported = checkPlatformSupport();
    setIsSupported(platformSupported);

    if (!platformSupported) return false;

    try {
      // Use WebAuthn for both web and mobile
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      setIsAvailable(available);
      
      if (available) {
        // Try to determine what types are available based on platform
        const types: BiometricType[] = [];
        
        if (Capacitor.getPlatform() === 'ios') {
          // iOS typically supports Face ID and Touch ID
          types.push(
            { type: 'faceId', available: true },
            { type: 'fingerprint', available: true }
          );
        } else if (Capacitor.getPlatform() === 'android') {
          // Android typically supports fingerprint and sometimes face
          types.push(
            { type: 'fingerprint', available: true },
            { type: 'faceId', available: true }
          );
        } else {
          // Web platform
          types.push({ type: 'fingerprint', available: true });
        }
        
        setAvailableTypes(types);
      }
      
      return available;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      setIsAvailable(false);
      setAvailableTypes([]);
      return false;
    }
  }, [checkPlatformSupport]);

  // Create passkey with enhanced mobile support
  const createPasskey = useCallback(async (email: string, userName: string): Promise<BiometricAuthResult> => {
    if (!isSupported || !isAvailable) {
      return { success: false, error: 'المصادقة الحيوية غير مدعومة على هذا الجهاز' };
    }

    try {
      // Enhanced WebAuthn with mobile optimizations
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: challenge,
          rp: {
            name: 'كلية أيلول الجامعية',
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
            requireResidentKey: true, // Enhanced for mobile
          },
          timeout: 120000, // Longer timeout for mobile
          attestation: 'direct', // Better attestation for mobile
        },
      }) as PublicKeyCredential;

      if (credential) {
        const credentialInfo = {
          email,
          credentialId: Array.from(new Uint8Array(credential.rawId)),
          userName,
          createdAt: new Date().toISOString(),
          platform: Capacitor.getPlatform(),
          type: 'webauthn_enhanced'
        };
        
        localStorage.setItem('biometric_credential', JSON.stringify(credentialInfo));
        return { success: true, data: credentialInfo };
      }

      return { success: false, error: 'فشل في إنشاء مفتاح المرور' };
    } catch (error: any) {
      console.error('Error creating passkey:', error);
      let errorMessage = 'حدث خطأ في إنشاء مفتاح المرور';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'تم إلغاء العملية من قبل المستخدم أو انتهت صلاحيتها';
      } else if (error.name === 'InvalidStateError') {
        errorMessage = 'مفتاح المرور موجود بالفعل لهذا الحساب';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'المصادقة الحيوية غير مدعومة على هذا الجهاز';
      } else if (error.name === 'SecurityError') {
        errorMessage = 'خطأ أمني - تأكد من أن الموقع آمن';
      }
      
      return { success: false, error: errorMessage };
    }
  }, [isSupported, isAvailable]);

  // Enhanced authentication
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

      // Enhanced WebAuthn authentication
      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge: challenge,
          rpId: window.location.hostname,
          allowCredentials: [{
            type: 'public-key',
            id: new Uint8Array(credInfo.credentialId),
          }],
          userVerification: 'required',
          timeout: 120000, // Longer timeout for mobile
        },
        // Add conditional UI for better mobile experience
        mediation: 'conditional',
      }) as PublicKeyCredential;

      if (assertion) {
        return { 
          success: true, 
          data: { 
            email: credInfo.email,
            userName: credInfo.userName,
            authenticatedAt: new Date().toISOString(),
            platform: credInfo.platform || 'unknown',
            method: 'webauthn_enhanced'
          }
        };
      }

      return { success: false, error: 'فشل في المصادقة' };
    } catch (error: any) {
      console.error('Error authenticating with passkey:', error);
      let errorMessage = 'حدث خطأ في المصادقة الحيوية';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'تم إلغاء المصادقة من قبل المستخدم أو انتهت صلاحيتها';
      } else if (error.name === 'InvalidStateError') {
        errorMessage = 'حالة المصادقة غير صحيحة';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'المصادقة الحيوية غير مدعومة';
      } else if (error.name === 'SecurityError') {
        errorMessage = 'خطأ أمني في المصادقة';
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
        hashedId: parsed.credentialId?.slice(0, 8).join('') || 'unknown'
      };
    } catch {
      return null;
    }
  }, []);

  // Remove stored credentials
  const removeStoredCredentials = useCallback(() => {
    localStorage.removeItem('biometric_credential');
  }, []);

  // Get biometric types as string for UI
  const getBiometricTypesString = useCallback(() => {
    if (availableTypes.length === 0) return 'المصادقة الحيوية';
    
    const typeNames = availableTypes.map(type => {
      switch (type.type) {
        case 'fingerprint': return 'بصمة الإصبع';
        case 'faceId': return 'بصمة الوجه';
        case 'voiceId': return 'بصمة الصوت';
        case 'irisId': return 'بصمة العين';
        default: return 'المصادقة الحيوية';
      }
    }).filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
    
    if (typeNames.length === 1) return typeNames[0];
    if (typeNames.length === 2) return typeNames.join(' أو ');
    return typeNames.slice(0, -1).join('، ') + ' أو ' + typeNames[typeNames.length - 1];
  }, [availableTypes]);

  // Enhanced availability check with better mobile detection
  const hasEnhancedBiometrics = useCallback(() => {
    return isAvailable && availableTypes.length > 0;
  }, [isAvailable, availableTypes]);

  return {
    isSupported,
    isAvailable,
    availableTypes,
    checkPlatformSupport,
    checkBiometricAvailability,
    createPasskey,
    authenticateWithPasskey,
    getStoredCredentials,
    removeStoredCredentials,
    getBiometricTypesString,
    hasEnhancedBiometrics,
  };
};