export interface GoogleUser {
  displayName: string;
  emails: { value: string }[];
  photos: { value: string }[];
}

export interface AuthContextType {
  user: GoogleUser | null;
  loading: boolean;
  logout: () => void;
}
