import type { PlayerMode } from '@/components/plot/RadiyoPlayerPanel';

export interface EngagementWheelAction {
  label: 'Report' | 'Skip' | 'Blast' | 'Collect' | 'Upvote' | 'Back' | 'Pause' | 'Recommend' | 'Next';
  position?: '9:00' | '10:00' | '12:00' | '1:00' | '3:00';
}

export const RADIYO_WHEEL_ACTIONS: EngagementWheelAction[] = [
  { label: 'Report' },
  { label: 'Skip' },
  { label: 'Blast' },
  { label: 'Collect' },
  { label: 'Upvote' },
];

export const COLLECTION_WHEEL_ACTIONS: EngagementWheelAction[] = [
  { label: 'Back', position: '9:00' },
  { label: 'Pause', position: '10:00' },
  { label: 'Blast', position: '12:00' },
  { label: 'Recommend', position: '1:00' },
  { label: 'Next', position: '3:00' },
];

export function getEngagementWheelActions(mode: PlayerMode): EngagementWheelAction[] {
  return mode === 'RADIYO' ? RADIYO_WHEEL_ACTIONS : COLLECTION_WHEEL_ACTIONS;
}
