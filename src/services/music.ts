import type { Service } from "./types";

export const music: Service[] = [
  { id: "spotify_track", name: "Spotify", group: "Spotify", category: "music", templates: [{ label: "track", url: "https://open.spotify.com/track/{id}" }], len: 22, check: "https://open.spotify.com/oembed?url=https://open.spotify.com/track/{id}" },
  { id: "spotify_album", name: "Spotify", group: "Spotify", category: "music", templates: [{ label: "album", url: "https://open.spotify.com/album/{id}" }], len: 22, check: "https://open.spotify.com/oembed?url=https://open.spotify.com/album/{id}" },
  { id: "spotify_playlist", name: "Spotify", group: "Spotify", category: "music", templates: [{ label: "playlist", url: "https://open.spotify.com/playlist/{id}" }], len: 22, check: "https://open.spotify.com/oembed?url=https://open.spotify.com/playlist/{id}" },
  { id: "spotify_artist", name: "Spotify", group: "Spotify", category: "music", templates: [{ label: "artist", url: "https://open.spotify.com/artist/{id}" }], len: 22, check: "https://open.spotify.com/oembed?url=https://open.spotify.com/artist/{id}" },
  { id: "spotify_user", name: "Spotify", group: "Spotify", category: "music", templates: [{ label: "user", url: "https://open.spotify.com/user/{id}" }], verify: false },
  { id: "deezer", name: "Deezer", category: "music", templates: [{ url: "https://www.deezer.com/track/{id}" }], check: "https://api.deezer.com/track/{id}", notFound: ['"error":{', '"preview":""'] },
  { id: "applemusic", name: "Apple Music", category: "music", templates: [
    { label: "album", url: "https://music.apple.com/in/album/{id}" },
    { label: "artist", url: "https://music.apple.com/in/artist/{id}" },
    { label: "song", url: "https://music.apple.com/in/song/{id}" },
    { label: "playlist", url: "https://music.apple.com/in/playlist/{id}" },
    { label: "video", url: "https://music.apple.com/in/music-video/{id}" },
    { label: "station", url: "https://music.apple.com/in/station/{id}" },
  ] },
];
