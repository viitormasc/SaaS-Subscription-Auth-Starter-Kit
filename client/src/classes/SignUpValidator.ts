import validator from 'validator';
import type { validateSignup } from '@/types/interfaces';


export class SignUpUserValidator implements validateSignup {
  errors: string[] = [];
  validated: boolean = true;
  hasUpper: RegExp = /[A-Z]/;
  hasLower: RegExp = /[a-z]/;
  hasSymbol: RegExp = /[!@#$%\*\(\)_+<>,.:;\\|\[\]]/;
  hasNumber: RegExp = /\d/;

  constructor(
    private readonly email: string,
    private readonly password: string,
    private readonly confirmPassword: string,
  ) {
    this.errors = []
  }
  validateEmail() {
    if (!validator.isEmail(this.email)) {
      this.errors.push('Email should be a valid email');
      this.validated = false;
    }
  }

  validatePasswordLength() {
    if (this.password.length < 8) {
      this.errors.push('Password should have at least 8 caracthers');
    }
  }

  validatePasswordForce() {
    if (!this.hasUpper.test(this.password)) {
      this.errors.push('Password should have at least one uppercase letter');
      this.validated = false;
    }
    if (!this.hasLower.test(this.password)) {
      this.errors.push('Password should have at least one lowercase letter');
      this.validated = false;
    }
    if (!this.hasSymbol.test(this.password)) {
      this.errors.push('Password should have at least one of these symbols "!@#$%¨`^"');
      this.validated = false;
    }
    if (!this.hasNumber.test(this.password)) {
      this.errors.push('Password should have at least one number');
      this.validated = false;
    }
  }

  checkIfPasswordsAreEqual() {
    if (this.password !== this.confirmPassword) {
      this.errors.push('Passwords should be equal');
      this.validated = false;
    }
  }

  checkValidation() {
    this.validateEmail();
    this.validatePasswordLength();
    this.validatePasswordForce();
    this.checkIfPasswordsAreEqual();

    return this.errors;
  }
}
