import mongoose from 'mongoose';

export interface SignupBody {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

export interface EmailValidationCodeBody {
  email: string;
  validationCode: string;
}

export interface UserDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  lastLogin: Date | Number;
  source: 'google' | 'local';
  userPlan: 'free' | 'standard' | 'pro';
  profilePhoto?: string;
  stripeCustomerId?: string;
  subscriptionId?: string;
  subscriptionStatus?: string;
  comparePassword: (candidatePassword: string, cb: (err: Error | null, isMatch?: boolean) => void) => void;
}

export interface CategoryDocument extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  name: string;
  dailyGoalMinutes: number;
  color: string;
  archived: Boolean;
  archivedAt: Date | null;
  updatedAt: number;
}

export interface ForgotPasswordParams {
  id?: string;
}
export interface StudyDataDocument extends mongoose.Document {
  userId: mongoose.Schema.Types.ObjectId;
  categoryId: mongoose.Schema.Types.ObjectId;
  startTimeStamps: number[];
  stopTimeStamps: number[];
  daykey: string;
  totalStudyTimeSec: number;
  isRunning: Boolean;
  lastHeartbeat: number;
  goalHitted: Boolean;
  goal: number;
}

export interface GoogleProfile {
  id: string;
  displayName: string;
  name?: {
    familyName: string;
    givenName: string;
  };
  emails?: Array<{ value: string; verified: boolean }>;
  photos?: Array<{ value: string }>;
  provider: string;
  _raw: string;
  _json: any;
}

export interface validateSignup {
  errors: string[];
  validated: boolean;
  hasUpper: RegExp;
  hasLower: RegExp;
  hasSymbol: RegExp;
  hasNumber: RegExp;

  validateEmail(): void;
  validatePasswordLength(): void;
  validatePasswordForce(): void;
  checkIfPasswordsAreEqual(): void;
  checkValidation(): string[];
}

export type ValidateChangePassword = Omit<validateSignup, 'validateEmail'>;

export interface SubscriptionDocument {
  stripeCostumerId: string
  subscriptionId: string
  subscriptionStatus: string;
  userId: mongoose.Schema.Types.ObjectId
  expireDate: number
}


