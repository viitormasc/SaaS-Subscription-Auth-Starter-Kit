// src/core/userValidator/LoginUserValidator.spec.ts
import { LoginUserValidator } from './LoginUserValidator';

describe('LoginUserValidator', () => {
  it('accepts a valid email and password length >= 8', () => {
    const v = new LoginUserValidator('vitor6@gmail.com', 'Vitor@123');
    const errors = v.checkValidation();
    expect(errors).toHaveLength(0);
  });

  it('normalizes gmail but keeps dots when configured', () => {
    const v = new LoginUserValidator('ViToR.6@GMAIL.com', '12345678');
    const errors = v.checkValidation();
    expect(errors).toHaveLength(0);
  });

  it('rejects invalid email', () => {
    const v = new LoginUserValidator('not-an-email', '12345678');
    const errors = v.checkValidation();
    expect(errors).toContain('Email should be a valid email');
  });

  it('rejects short password', () => {
    const v = new LoginUserValidator('vitor6@gmail.com', 'short');
    const errors = v.checkValidation();
    expect(errors).toContain('Password should have at least 8 caracthers');
  });
});
