import {
  Database,
  Gauge,
  Layers,
  Monitor,
  RefreshCw,
  Rocket,
  Server,
  Sparkles,
  type IconNode,
} from 'lucide';

/**
 * Icons selectable from the CMS by name. Only names in this allowlist render;
 * anything else falls back to a neutral icon.
 */
const CMS_ICONS: Record<string, IconNode> = {
  layers: Layers,
  monitor: Monitor,
  server: Server,
  database: Database,
  'refresh-cw': RefreshCw,
  gauge: Gauge,
  rocket: Rocket,
  sparkles: Sparkles,
};

export function cmsIcon(name: string | undefined): IconNode {
  return (name && CMS_ICONS[name]) || Sparkles;
}
