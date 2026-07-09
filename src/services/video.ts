import type { Service } from "./types";

export const video: Service[] = [
  {
    id: "youtube",
    name: "YouTube",
    category: "video",
    templates: [
      { label: "short", url: "https://youtu.be/{id}" },
      { label: "watch", url: "https://www.youtube.com/watch?v={id}" },
    ],
    len: 11,
    notFound: ['playabilitystatus":{"status":"error"'],
  },
  { id: "youtube_playlist", name: "YouTube Playlist", category: "video", templates: [{ url: "https://www.youtube.com/playlist?list={id}" }] },
  { id: "youtube_channel", name: "YouTube Channel", category: "video", templates: [{ url: "https://www.youtube.com/channel/{id}" }], len: 24 },
  { id: "vimeo", name: "Vimeo", category: "video", templates: [{ url: "https://vimeo.com/{id}" }] },
  { id: "dailymotion", name: "Dailymotion", category: "video", templates: [{ url: "https://www.dailymotion.com/video/{id}" }], check: "https://www.dailymotion.com/services/oembed?url=https://www.dailymotion.com/video/{id}", notFound: ["invalid video url"] },
  { id: "streamable", name: "Streamable", category: "video", templates: [{ url: "https://streamable.com/{id}" }] },
  { id: "twitch", name: "Twitch", category: "video", templates: [{ url: "https://www.twitch.tv/{id}" }], notFound: ["leading video platform and community for gamers"] },
  { id: "twitch_clip", name: "Twitch Clip", category: "video", templates: [{ url: "https://clips.twitch.tv/{id}" }], notFound: ["leading video platform and community for gamers"] },
  { id: "rumble", name: "Rumble", category: "video", templates: [{ url: "https://rumble.com/{id}" }] },
  { id: "bitchute", name: "BitChute", category: "video", templates: [{ url: "https://www.bitchute.com/video/{id}" }], notFound: ["prioritizes creators and champions users"] },
  { id: "loom", name: "Loom", category: "video", templates: [{ url: "https://www.loom.com/share/{id}" }] },
  { id: "bilibili", name: "Bilibili", category: "video", templates: [{ url: "https://space.bilibili.com/{id}" }] },
];
