import api from "@/axios";

export function searchTwitchVods(searchTerm: string, cursor: string | undefined) {

  const payload = [{
    operationName: "SearchResultsPage_SearchResults",
    variables: {
      platform: "web",
      query: searchTerm,
      options: {
        targets: [{ index: "VOD", cursor: cursor || null }]
      },
      requestID: "unique-request-id", // Can vary
      includeIsDJ: true
    },
    extensions: {
      persistedQuery: {
        version: 1,
        sha256Hash: "f6c2575aee4418e8a616e03364d8bcdbf0b10a5c87b59f523569dacc963e8da5" // Based on searched term
      }
    }
  }];


  return api.post(`https://gql.twitch.tv/gql`,
    JSON.stringify(payload)
  );
}