import {UserDocument} from './interfaces'

export type DoneFunction = (err: any, user?: UserDocument | false, options?: { message: string }) => void;