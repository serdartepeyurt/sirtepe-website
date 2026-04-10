export interface IAuthProvider {
  getAuthUrl(): string;
  validateToken(token: string): Promise<AuthUser>;
  getUserFromSession(sessionToken: string): Promise<AuthUser | null>;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}
