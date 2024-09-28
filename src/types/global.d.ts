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

type UserCredentialsType = {
  clientId: string,
  authorization: string,
}

type SearchResultsType = {
  banners: null,
  channels: unknown,
  channelsWithTag: unknown,
  games: unknown,
  relatedLiveChannels: unknown,
  videos: VideoType,
  __typename: string // "SearchFor"
}

type VideoType = {
  cursor: string | null,
  edges: VideoEdgeType[],
  score: number,
  totalMatches: number
  __typename: string // "SearchForResultVideos"
}

type VideoEdgeType = {
  item: {
    createdAt: string,
    game: {
      displayName: string,
      id: string,
      name: string,
      slug: string,
      __typename: string // "Game"
    } | null,
    id: string,
    lengthSeconds: number,
    owner: {
      displayName: string,
      id: string,
      login: string,
      roles: {
        isPartner: boolean,
        __typename: string // "UserRoles"
      },
      __typename: string // "User"
    },
    previewThumbnailProperties: {
      blurReason: string,
      __typename: string // "PreviewThumbnailProperties"
    },
    previewThumbnailURL: string,
    templatePreviewThumbnailURL: string,
    title: string,
    viewCount: number,
    __typename: string // "Video"
  },
  trackingID: string,
  __typename: string // "SearchForEdge"
}