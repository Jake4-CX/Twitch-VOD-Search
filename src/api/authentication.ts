export function getUserCredentials(): UserCredentialsType | undefined {
  const tokens = getLocalStoredUserCredentials();
  if (tokens) {
    return {
      clientId: tokens.clientId,
      authorization: tokens.authorization
    };
  }
  return undefined;
}

export function getLocalStoredUserCredentials(): UserCredentialsType | undefined {
  const tokens = localStorage.getItem("twitch-vod-tokens");
  if (tokens) {
    return JSON.parse(tokens) as UserCredentialsType;
  }
  return undefined;
}

export function setLocalStoredUserCredentials(tokens: UserCredentialsType) {
  localStorage.setItem("twitch-vod-tokens", JSON.stringify(tokens));
}