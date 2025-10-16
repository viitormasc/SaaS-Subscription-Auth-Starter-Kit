import { SignUpUserValidator } from '@/classes/SignUpValidator'
import type { SignUpCheckErrorsProps } from '@/types/interfaces';


export default function SignUpCheckErrors({ password, confirmPassword, email }: SignUpCheckErrorsProps) {
  const color = 'text-red-600'

  const validateSignUp = new SignUpUserValidator(email, password, confirmPassword)

  const errors: string[] = validateSignUp.checkValidation()

  return (
    <div>
      <ul>
        {(errors.length) ? errors.map((error, index) => <li key={index} className={`text-xs ${color}`}>x {error}</li>) : <p className="text-green-600 text-xs">You have a secure password! Please Sign Up</p>}
      </ul>
    </div>
  )
}
