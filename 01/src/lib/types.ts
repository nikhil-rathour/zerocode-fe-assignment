export interface User {
  id: number;
  email: string;
  name: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData extends LoginFormData {
  name: string;
}