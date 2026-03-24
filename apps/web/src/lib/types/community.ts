import type { Community } from '@uprise/types';

export type CommunityWithDistance = Community & {
  city?: string | null;
  state?: string | null;
  musicCommunity?: string | null;
  radius?: number | null;
  coordinates?: {
    lat: number;
    lng: number;
  } | null;
  _count?: {
    members?: number;
    tracks?: number;
    events?: number;
  };
  distance?: number;
};
