import type { ValidateChangePassword } from '@/types/interfaces';

export class ChangePasswordValidator implements ValidateChangePassword {
  errors: string[] = [];
  validated: boolean = true;
  hasUpper: RegExp = /[A-Z]/;
  hasLower: RegExp = /[a-z]/;
  hasSymbol: RegExp = /[!@#$%\*\(\)_+<>,.:;\\|\[\]]/;
  hasNumber: RegExp = /\d/;

  constructor(
    private readonly password: string,
    private readonly confirmPassword: string,
  ) {
    this.errors = [];
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
      this.errors.push(
        'Password should have at least one of these symbols "!@#$%¨`^"',
      );
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
    this.validatePasswordLength();
    this.validatePasswordForce();
    this.checkIfPasswordsAreEqual();

    return this.errors;
  }
}
