import type { Service } from "./types";

export const audio: Service[] = [
  { id: "clyp", name: "Clyp", category: "audio", templates: [{ url: "https://clyp.it/{id}" }] },
  {
    id: "vocaroo",
    name: "Vocaroo",
    category: "audio",
    templates: [
      { label: "short", url: "https://voca.ro/{id}" },
      { label: "full", url: "https://vocaroo.com/{id}" },
    ],
    verify: false,
  },
  { id: "picosong", name: "Picosong", category: "audio", templates: [{ url: "https://picosong.com/{id}" }], notFound: ["upload a mp3 or song"] },
  { id: "soundcloud", name: "SoundCloud", category: "audio", templates: [{ url: "https://soundcloud.com/{id}" }], verify: false },
  { id: "audiomack", name: "Audiomack", category: "audio", templates: [{ url: "https://audiomack.com/{id}" }], notFound: ["audiomack - music platform empowering"] },
  { id: "bandcamp", name: "Bandcamp", category: "audio", templates: [{ url: "https://{id}.bandcamp.com" }], notFound: ["signup?new_domain"] },
  { id: "mixcloud", name: "Mixcloud", category: "audio", templates: [{ url: "https://www.mixcloud.com/{id}" }], notFound: ["mixcloud - this is audio culture"] },
  { id: "lastfm", name: "Last.fm", category: "audio", templates: [{ url: "https://www.last.fm/user/{id}" }] },
  { id: "genius", name: "Genius", category: "audio", templates: [{ url: "https://genius.com/{id}" }] },
  { id: "audius", name: "Audius", category: "audio", templates: [{ url: "https://audius.co/{id}" }], check: "https://api.audius.co/v1/users/handle/{id}?app_name=blid" },
  { id: "reverbnation", name: "ReverbNation", category: "audio", templates: [{ url: "https://www.reverbnation.com/{id}" }] },
  { id: "newgrounds", name: "Newgrounds", category: "audio", templates: [{ url: "https://{id}.newgrounds.com" }] },
  { id: "jamendo", name: "Jamendo", category: "audio", templates: [{ url: "https://www.jamendo.com/artist/{id}" }], numeric: true },
];
