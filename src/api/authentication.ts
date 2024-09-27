import api from "@/axios";

export function loginUser(credentials: { userEmail: string, userPassword: string }) {
  return api.post(`/auth/login`, credentials);
}

export function registerUser(credentials: { userEmail: string, userPassword: string, userRole: string }) {
  return api.post(`/auth/register`, credentials);
}

export function validateUserAccessToken(accessToken: string) {
  return api.post(`/auth/validate`, {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
}

export function getLocalStoredUser(): UserDataType | undefined {
  const user = localStorage.getItem("user");
  if (user) {
    return JSON.parse(user) as UserDataType;
  }
  return undefined;
}

export function getLocalStoredTokens(): TokenDataType | undefined {
  const tokens = localStorage.getItem("tokens");
  if (tokens) {
    return JSON.parse(tokens) as TokenDataType;
  }
  return undefined;
}

export function setLocalStoredUser(user: UserDataType) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function setLocalStoredTokens(tokens: TokenDataType) {
  localStorage.setItem("tokens", JSON.stringify(tokens));
}

export function removeLocalStoredUser() {
  localStorage.removeItem("user");
}

export function removeLocalStoredTokens() {
  localStorage.removeItem("tokens");
}