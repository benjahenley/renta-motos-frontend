import {
  ActionCodeSettings,
  ApplicationVerifier,
  AuthCredential,
  AuthProvider,
  ConfirmationResult,
  MultiFactorAssertion,
  MultiFactorInfo,
  MultiFactorSession,
  User,
  UserCredential,
} from 'firebase/auth';

interface UserInfo {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  providerId: string;
  phoneNumber: string | null;
  avatar: string;
}

interface UserMetadata {
  creationTime?: string;
  lastSignInTime?: string;
}

interface MultiFactorUser {
  enrolledFactors: MultiFactorInfo[];
  enroll(
    assertion: MultiFactorAssertion,
    displayName?: string | null,
  ): Promise<void>;
  getSession(): Promise<MultiFactorSession>;
  unenroll(options: MultiFactorInfo | string): Promise<void>;
}

interface IdTokenResult {
  token: string;
  expirationTime: string;
  authTime: string;
  issuedAtTime: string;
  signInProvider: string | null;
  claims: {
    [key: string]: any;
  };
}

export interface UserType {
  // Basic user properties
  uid: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  isAnonymous: boolean;
  photoURL: string | null;
  providerData: (UserInfo | null)[];
  phoneNumber: string | null;
  tenantId: string | null;

  // Additional properties and methods
  data: UserMetadata;
  refreshToken: string;
  providerId: string;
  multiFactor: MultiFactorUser;

  delete(): Promise<void>;
  getIdToken(forceRefresh?: boolean): Promise<string>;
  getIdTokenResult(forceRefresh?: boolean): Promise<IdTokenResult>;
  linkAndRetrieveDataWithCredential(
    credential: AuthCredential,
  ): Promise<UserCredential>;
  linkWithCredential(credential: AuthCredential): Promise<UserCredential>;
  linkWithPhoneNumber(
    phoneNumber: string,
    applicationVerifier: ApplicationVerifier,
  ): Promise<ConfirmationResult>;
  linkWithPopup(provider: AuthProvider): Promise<UserCredential>;
  linkWithRedirect(provider: AuthProvider): Promise<void>;
  reauthenticateAndRetrieveDataWithCredential(
    credential: AuthCredential,
  ): Promise<UserCredential>;
  reauthenticateWithCredential(
    credential: AuthCredential,
  ): Promise<UserCredential>;
  reauthenticateWithPhoneNumber(
    phoneNumber: string,
    applicationVerifier: ApplicationVerifier,
  ): Promise<ConfirmationResult>;
  reauthenticateWithPopup(provider: AuthProvider): Promise<UserCredential>;
  reauthenticateWithRedirect(provider: AuthProvider): Promise<void>;
  reload(): Promise<void>;
  sendEmailVerification(actionCodeSettings?: ActionCodeSettings): Promise<void>;
  toJSON(): object;
  unlink(providerId: string): Promise<User>;
  updateEmail(newEmail: string): Promise<void>;
  updatePassword(newPassword: string): Promise<void>;
  updatePhoneNumber(phoneCredential: AuthCredential): Promise<void>;
  updateProfile(profile: {
    displayName?: string | null;
    photoURL?: string | null;
  }): Promise<void>;
  verifyBeforeUpdateEmail(
    newEmail: string,
    actionCodeSettings?: ActionCodeSettings,
  ): Promise<void>;
}
