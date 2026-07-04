import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "public", "og-strategy-call.jpg");

const W = 1920;
const H = 1080;

const stats = [
  { stat: "$15k in weddings", venue: "Atlantic Stables", period: "first 30 days" },
  { stat: "9 weddings booked", venue: "Red Barn Acres", period: "first 4 months" },
  { stat: "258 leads", venue: "Retreat at Evans Farms", period: "60 days" },
];

const marquee = [
  "Manor — 2026 Dates Booked in 90 Days",
  "Waterloo Farms — 2 Weddings Booked in 7 Days",
  "Atlantic Stables — $15,000 Booked in 30 Days",
  "Irongate — 131 Leads in 60 Days",
];

// Card geometry for the three social-proof cards
const cardW = 500;
const cardH = 230;
const gap = 40;
const totalW = cardW * 3 + gap * 2;
const startX = (W - totalW) / 2;
const cardY = 720;

const cards = stats
  .map((s, i) => {
    const x = startX + i * (cardW + gap);
    return `
      <g>
        <rect x="${x}" y="${cardY}" width="${cardW}" height="${cardH}" rx="24"
          fill="#ffffff" stroke="#e7e5e4" stroke-width="2"
          filter="url(#cardShadow)"/>
        <text x="${x + cardW / 2}" y="${cardY + 108}" text-anchor="middle"
          font-family="Georgia, 'Times New Roman', serif" font-size="52" font-weight="700"
          fill="#1b1b1b">${s.stat}</text>
        <text x="${x + cardW / 2}" y="${cardY + 158}" text-anchor="middle"
          font-family="'Helvetica Neue', Arial, sans-serif" font-size="26" font-weight="600"
          fill="#8a7448">${s.venue}</text>
        <text x="${x + cardW / 2}" y="${cardY + 196}" text-anchor="middle"
          font-family="'Helvetica Neue', Arial, sans-serif" font-size="24"
          fill="#78716c">${s.period}</text>
      </g>`;
  })
  .join("");

const marqueeText = marquee.join("      •      ");

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#faf8f4"/>
      <stop offset="100%" stop-color="#f2eee7"/>
    </linearGradient>
    <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="160%">
      <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#1b1b1b" flood-opacity="0.10"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- Top proof bar -->
  <rect x="0" y="0" width="${W}" height="72" fill="#1c1c1c"/>
  <text x="${W / 2}" y="47" text-anchor="middle"
    font-family="'Helvetica Neue', Arial, sans-serif" font-size="24" letter-spacing="1"
    fill="#ffffff" fill-opacity="0.82">${marqueeText}</text>

  <!-- Wordmark -->
  <text x="${W / 2}" y="230" text-anchor="middle"
    font-family="Georgia, 'Times New Roman', serif" font-size="60" font-weight="400"
    letter-spacing="1" fill="#1b1b1b">StoryVenue</text>

  <!-- Eyebrow -->
  <text x="${W / 2}" y="316" text-anchor="middle"
    font-family="'Helvetica Neue', Arial, sans-serif" font-size="26" font-weight="700"
    letter-spacing="7" fill="#78716c">FOR WEDDING VENUE OWNERS</text>

  <!-- Headline -->
  <text x="${W / 2}" y="440" text-anchor="middle"
    font-family="Georgia, 'Times New Roman', serif" font-size="86" font-weight="400"
    fill="#1b1b1b">Fully Book Your <tspan fill="#8a7448">Wedding Venue</tspan></text>
  <text x="${W / 2}" y="548" text-anchor="middle"
    font-family="Georgia, 'Times New Roman', serif" font-size="86" font-weight="400"
    fill="#1b1b1b">Without Relying on The Knot</text>

  <!-- Subhead -->
  <text x="${W / 2}" y="632" text-anchor="middle"
    font-family="'Helvetica Neue', Arial, sans-serif" font-size="34"
    fill="#57534e">We bring the brides. Our team works the leads. You show up for the tour.</text>

  ${cards}
</svg>`;

await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toFile(OUT);
console.log("wrote", OUT);
