import type { Community } from '@uprise/types';

export type CommunityWithDistance = Community & {
  distance?: number;
};
