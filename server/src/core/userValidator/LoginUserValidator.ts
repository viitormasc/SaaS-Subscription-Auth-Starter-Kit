import validator from 'validator';

interface validateLogin {
  errors: string[];
  validated: boolean;

  validateEmail(): void;
  validatePasswordLength(): void;
  checkValidation(): string[];
}

export class LoginUserValidator implements validateLogin {
  errors: string[] = [];
  validated: boolean = true;

  constructor(
    private readonly email: string,
    private readonly password: string,
  ) {
    this.email = validator.normalizeEmail(email, { gmail_remove_dots: false }) as string;
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

  checkValidation() {
    this.validateEmail();
    this.validatePasswordLength();

    return this.errors;
    
  }
}
