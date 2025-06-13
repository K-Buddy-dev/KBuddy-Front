interface LoginBaseData {
  emailOrUserId: string;
  password: string;
}

export interface LoginFormData extends LoginBaseData {}

export interface LoginRequest extends LoginBaseData {}
