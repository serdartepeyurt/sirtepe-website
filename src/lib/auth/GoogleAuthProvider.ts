import { IAuthProvider, AuthUser } from '@/interfaces/IAuthProvider';

export class GoogleAuthProvider implements IAuthProvider {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientId = process.env.GOOGLE_CLIENT_ID || '';
    this.clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
    this.redirectUri = process.env.GOOGLE_REDIRECT_URI || 'https://serdartepeyurt.com/api/auth/callback';
  }

  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }

  async validateToken(token: string): Promise<AuthUser> {
    const response = await fetch('https://oauth2.googleapis.com/tokeninfo', {
      method: 'POST',
      body: new URLSearchParams({ access_token: token }),
    });
    const data = await response.json();
    return {
      id: data.sub,
      email: data.email,
      name: data.name,
      avatar: data.picture,
    };
  }

  async getUserFromSession(sessionToken: string): Promise<AuthUser | null> {
    // TODO: Implement session storage
    return null;
  }
}
