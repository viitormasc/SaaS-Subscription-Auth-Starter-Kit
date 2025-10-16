import bcryptjs from 'bcryptjs';
import mongoose from 'mongoose';
import { UserDocument } from '../types/interfaces';

const UserSchema = new mongoose.Schema<UserDocument>({
  email: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  password: { type: String },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: new Date() },
  source: { type: String, default: 'local' },
  profilePhoto: { type: String },
  userPlan: { type: String, default: 'free' },
  stripeCustomerId: { type: String },
  subscriptionId: { type: String },
  subscriptionStatus: { type: String },
})

// Password hash middleware.

UserSchema.pre<UserDocument>('save', async function save(next) {
  const user = this;
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcryptjs.genSalt(10);

  user.password = await bcryptjs.hash(user.password, salt);
  next();
});

// Helper method for validating user's password.
//
UserSchema.methods.comparePassword = function comparePassword(candidatePassword: string, cb: (err: Error | null, isMatch?: boolean) => void) {
  bcryptjs.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

// UserSchema.methods.comparePassword = function comparePassword(candidatePassword: string): Promise<boolean> {
//   return new Promise((resolve, reject) => {
//     bcryptjs.compare(candidatePassword, this.password, (err, isMatch) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(isMatch as boolean);
//       }
//     });
//   });
// };
//
export default mongoose.model('User', UserSchema);
