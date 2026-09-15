export const BOOKING_URL = "BOOKING_URL";
// Main VSL video on /strategy-call. Cloudflare Stream iframe URL (adaptive
// HLS/DASH, global CDN). VideoPlayer appends ?autoplay=true when the viewer
// taps play. To swap the video, replace the video ID in the path below.
export const VSL_VIDEO_URL =
  "https://customer-v0pnfrdybz7soiqg.cloudflarestream.com/4c6bff483d8d73749d70e15a49cd8992/iframe";
// Video shown on the /strategy-call/confirmed thank-you page. Paste your Loom
// link here — either the share link (https://www.loom.com/share/<id>) or the
// embed link (https://www.loom.com/embed/<id>). VideoPlayer auto-converts and
// enables autoplay. Works with Vimeo/YouTube embed URLs too.
export const CONFIRMATION_VIDEO_URL = "https://www.loom.com/share/65db445563694f69924a8e718cf1c5aa";
