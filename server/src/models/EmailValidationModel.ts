import mongoose, { Schema } from 'mongoose';

export interface EmailValidationDocument extends mongoose.Document {
  email: string;
  validationCode: string;
  createdAt: Date;
  expiresAt: Date;
  validationTries: number;
}
const EmailValidationSchema = new Schema<EmailValidationDocument>({
  email: { type: String, required: true },
  validationCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now(), expires: 1200 },
  validationTries: { type: Number, default: 0 },
});

EmailValidationSchema.path('createdAt').options;

const EmailValidation = mongoose.model('EmailValidation', EmailValidationSchema);
//
// EmailValidationSchema.pre('save', function (next) {
//   const doc = this;
//   EmailValidation.findByIdAndUpdate({ _id: this._id }, { $inc: { seq: 1 } }, function (error: any) {
//     if (error) return next(error);
//     next();
//   });
// });
//
export default EmailValidation;
