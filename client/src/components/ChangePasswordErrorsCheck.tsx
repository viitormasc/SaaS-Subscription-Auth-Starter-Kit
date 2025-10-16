import { ChangePasswordValidator } from '@/classes/ChangePasswordValidator';
import type { ChangePasswordErrorsProps } from '@/types/interfaces';
export const ChangePasswordErrorsCheck = ({
  password,
  confirmPassword,
}: ChangePasswordErrorsProps) => {
  const color = 'text-red-600';

  const validateSignUp = new ChangePasswordValidator(password, confirmPassword);

  const errors: string[] = validateSignUp.checkValidation();

  return (
    <div>
      <ul>
        {errors.length ? (
          errors.map((error, index) => (
            <li key={index} className={`text-xs ${color}`}>
              x {error}
            </li>
          ))
        ) : (
          <p className="text-green-600 text-xs">
            You have a secure password! Please Sign Up
          </p>
        )}
      </ul>
    </div>
  );
};
