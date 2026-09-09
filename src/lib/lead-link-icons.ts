import {
  Link as LinkIcon,
  Calendar,
  Video,
  Play,
  Camera,
  Image as ImageIcon,
  Star,
  Heart,
  Gift,
  Music,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  Utensils,
  Ticket,
  ShoppingBag,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * Key → lucide icon for the venue's custom Lead Link buttons.
 *
 * MUST stay in sync with the StoryPay dashboard's LEAD_LINK_ICON_KEYS
 * (src/lib/lead-link-icons.ts in the StoryPay repo), which is the authoritative
 * list the owner picks from. Unknown keys fall back to the generic link icon.
 */
export const LEAD_LINK_ICON_MAP: Record<string, LucideIcon> = {
  link: LinkIcon,
  calendar: Calendar,
  video: Video,
  play: Play,
  camera: Camera,
  image: ImageIcon,
  star: Star,
  heart: Heart,
  gift: Gift,
  music: Music,
  "map-pin": MapPin,
  phone: Phone,
  mail: Mail,
  globe: Globe,
  "file-text": FileText,
  utensils: Utensils,
  ticket: Ticket,
  "shopping-bag": ShoppingBag,
  sparkles: Sparkles,
  users: Users,
};

export function leadLinkIcon(key: string): LucideIcon {
  return LEAD_LINK_ICON_MAP[key] ?? LinkIcon;
}
