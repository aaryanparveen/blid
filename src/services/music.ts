import type { Service } from "./types";

export const music: Service[] = [
  { id: "spotify_track", name: "Spotify Track", category: "music", templates: [{ url: "https://open.spotify.com/track/{id}" }], len: 22, check: "https://open.spotify.com/oembed?url=https://open.spotify.com/track/{id}" },
  { id: "spotify_album", name: "Spotify Album", category: "music", templates: [{ url: "https://open.spotify.com/album/{id}" }], len: 22, check: "https://open.spotify.com/oembed?url=https://open.spotify.com/album/{id}" },
  { id: "spotify_playlist", name: "Spotify Playlist", category: "music", templates: [{ url: "https://open.spotify.com/playlist/{id}" }], len: 22, check: "https://open.spotify.com/oembed?url=https://open.spotify.com/playlist/{id}" },
  { id: "spotify_artist", name: "Spotify Artist", category: "music", templates: [{ url: "https://open.spotify.com/artist/{id}" }], len: 22, check: "https://open.spotify.com/oembed?url=https://open.spotify.com/artist/{id}" },
  { id: "spotify_user", name: "Spotify User", category: "music", templates: [{ url: "https://open.spotify.com/user/{id}" }], verify: false },
  { id: "deezer", name: "Deezer", category: "music", templates: [{ url: "https://www.deezer.com/track/{id}" }], check: "https://api.deezer.com/track/{id}", notFound: ['"error":{'] },
  { id: "applemusic", name: "Apple Music", category: "music", templates: [{ url: "https://music.apple.com/album/{id}" }] },
];
