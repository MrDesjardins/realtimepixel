export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserLoginResponse {
  email: string;
  token: string;
  timestamp: number;
}

export interface CreateUserRequest {
  email: string;
  password: string;
}

export interface CreateUserResponse {
  email: string;
  token: string;
  timestamp: number;
}
