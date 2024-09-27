type UserDataType = {
  userId: string,
  userEmail: string,
  userRole: "USER" | "ADMIN",
  userUpdatedDate: string,
  userCreatedDate: string
}

type TokenDataType = {
  accessToken: string,
  refreshToken: string
}