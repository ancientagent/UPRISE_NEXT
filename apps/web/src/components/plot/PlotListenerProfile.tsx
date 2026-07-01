import type { FormEvent, ReactNode } from 'react';
import { Button } from '@uprise/ui';
import type { PlayerMode } from '@/components/plot/RadiyoPlayerPanel';
import type { MusicCommunityPreference } from '@/lib/users/client';

export const expandedProfileSections = [
  'Singles/Playlists',
  'Events',
  'Photos',
  'Merch',
  'Saved Uprises',
  'Saved Promos/Coupons',
] as const;

export type ExpandedProfileSection = (typeof expandedProfileSections)[number];

export interface PlotCollectionShelfItem {
  signalId: string;
  type: string;
  createdAt: string;
  metadata: Record<string, unknown> | null;
}

export interface PlotCollectionShelf {
  shelf: string;
  itemCount: number;
  items: PlotCollectionShelfItem[];
}

export interface PlotProfileRead {
  canViewCollection: boolean;
  collectionShelves: PlotCollectionShelf[];
  savedAwayScenes: Array<{
    id: string;
    reason: string;
    savedAt: string;
    context: Record<string, unknown> | null;
    scene: {
      id: string;
      name: string;
      city: string | null;
      state: string | null;
      musicCommunity: string | null;
      tier: string;
      isActive: boolean;
    };
  }>;
  activationNotices: Array<{
    id: string;
    reason: string;
    status: string;
    message: string | null;
    city: string;
    state: string;
    musicCommunity: string;
    createdAt: string;
    fromScene: {
      id: string;
      name: string;
      city: string | null;
      state: string | null;
      musicCommunity: string | null;
      tier: string;
      isActive: boolean;
    } | null;
    toScene: {
      id: string;
      name: string;
      city: string | null;
      state: string | null;
      musicCommunity: string | null;
      tier: string;
      isActive: boolean;
    };
  }>;
  managedArtistBands: Array<{
    id: string;
    name: string;
    slug: string;
    entityType: string;
    membershipRole: string | null;
  }>;
}

interface CollectionSelection {
  id: string;
  label: string;
  kind: 'track' | 'playlist';
}

interface ProfileStatusCard {
  label: string;
  value: string;
  detail: string;
}

interface PlotListenerProfileProps {
  user: { displayName?: string | null; username?: string | null } | null;
  homeScene: { city?: string | null; state?: string | null; musicCommunity?: string | null } | null;
  selectedCommunityLabel: string | null;
  activityScore: number;
  eventsThisWeek: number;
  calendarDate: string;
  profileStatusCards: ProfileStatusCard[];
  activationNotices: PlotProfileRead['activationNotices'];
  token: string | null;
  musicCommunityPreferenceDraft: string;
  musicCommunityPreferenceSaving: boolean;
  musicCommunityPreferencesLoading: boolean;
  musicCommunityPreferencesError: string | null;
  musicCommunityPreferences: MusicCommunityPreference[];
  availableMusicCommunityPreferences: string[];
  resolvedSelectorMusicCommunities: Set<string>;
  activeProfileSection: ExpandedProfileSection;
  plotProfileLoading: boolean;
  plotProfileError: string | null;
  canViewCollection: boolean;
  collectionShelves: PlotCollectionShelf[];
  savedAwayScenes: PlotProfileRead['savedAwayScenes'];
  selectedCollectionItem: CollectionSelection | null;
  playerMode: PlayerMode;
  playerPanel: ReactNode;
  onAddMusicCommunityPreference: (event: FormEvent<HTMLFormElement>) => void;
  onMusicCommunityPreferenceDraftChange: (value: string) => void;
  onSetDefaultMusicCommunityPreference: (musicCommunity: string) => void;
  onActiveProfileSectionChange: (section: ExpandedProfileSection) => void;
  onCollectionSelection: (item: CollectionSelection) => void;
  onReturnToPlotTabs: () => void;
}

const readMetadataString = (
  metadata: Record<string, unknown> | null | undefined,
  keys: string[]
): string | null => {
  if (!metadata) return null;

  for (const key of keys) {
    const value = metadata[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return null;
};

const formatShelfItemPrimaryLabel = (item: PlotCollectionShelfItem): string => {
  const metadata = item.metadata;

  const sceneCity = readMetadataString(metadata, ['city']);
  const sceneState = readMetadataString(metadata, ['state']);
  const sceneMusicCommunity = readMetadataString(metadata, ['musicCommunity', 'community']);

  if (sceneCity && sceneState && sceneMusicCommunity) {
    return `${sceneCity}, ${sceneState} • ${sceneMusicCommunity}`;
  }

  return (
    readMetadataString(metadata, ['title', 'name', 'label', 'summary', 'productionName']) ??
    item.type.replace(/_/g, ' ')
  );
};

const formatShelfItemSecondaryLabel = (item: PlotCollectionShelfItem): string => {
  const metadata = item.metadata;

  return (
    readMetadataString(metadata, ['callToAction', 'status', 'expiresAt', 'expiration']) ??
    new Date(item.createdAt).toLocaleDateString()
  );
};

export default function PlotListenerProfile({
  user,
  homeScene,
  selectedCommunityLabel,
  activityScore,
  eventsThisWeek,
  calendarDate,
  profileStatusCards,
  activationNotices,
  token,
  musicCommunityPreferenceDraft,
  musicCommunityPreferenceSaving,
  musicCommunityPreferencesLoading,
  musicCommunityPreferencesError,
  musicCommunityPreferences,
  availableMusicCommunityPreferences,
  resolvedSelectorMusicCommunities,
  activeProfileSection,
  plotProfileLoading,
  plotProfileError,
  canViewCollection,
  collectionShelves,
  savedAwayScenes,
  selectedCollectionItem,
  playerMode,
  playerPanel,
  onAddMusicCommunityPreference,
  onMusicCommunityPreferenceDraftChange,
  onSetDefaultMusicCommunityPreference,
  onActiveProfileSectionChange,
  onCollectionSelection,
  onReturnToPlotTabs,
}: PlotListenerProfileProps) {
  const singlesShelf = collectionShelves.find((shelf) => shelf.shelf === 'singles') ?? null;
  const fliersShelf = collectionShelves.find((shelf) => shelf.shelf === 'fliers') ?? null;
  const uprisesShelf = collectionShelves.find((shelf) => shelf.shelf === 'uprises') ?? null;
  const posterShelf = collectionShelves.find((shelf) => shelf.shelf === 'posters') ?? null;
  const merchButtonShelf =
    collectionShelves.find((shelf) => shelf.shelf === 'merch_buttons') ?? null;
  const merchPatchShelf =
    collectionShelves.find((shelf) => shelf.shelf === 'merch_patches') ?? null;
  const merchShirtShelf = collectionShelves.find((shelf) => shelf.shelf === 'merch_shirts') ?? null;
  const singlesCollectionItems =
    singlesShelf?.items.map((item) => ({
      id: item.signalId,
      label: formatShelfItemPrimaryLabel(item),
      kind: 'track' as const,
    })) ?? [];

  return (
    <section
      id="plot-profile-panel"
      className="mt-4 space-y-4 rounded-[1.4rem] border border-black bg-[#f7f7ef] p-4 shadow-[3px_3px_0_rgba(0,0,0,0.3)] transition-all duration-200"
      aria-labelledby="plot-profile-seam-toggle"
    >
      <header className="grid gap-4 rounded-[1.15rem] border border-black bg-[#efefe2] p-4 lg:grid-cols-[minmax(0,1.6fr)_240px]">
        <div className="space-y-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/55">
              Profile Summary
            </p>
            <h2 className="mt-1 text-lg font-semibold leading-tight text-black">
              {user?.displayName || user?.username || 'User'}
            </h2>
            <p className="mt-1 text-sm text-black/60">@{user?.username || 'listener'}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="plot-wire-card-muted bg-white p-3">
              <p className="plot-wire-label">Activity Score</p>
              <p className="mt-1 text-lg font-semibold text-black">{activityScore}</p>
            </div>
            {profileStatusCards.map((card) => (
              <div key={card.label} className="plot-wire-card-muted bg-white p-3">
                <p className="plot-wire-label">{card.label}</p>
                <p className="mt-1 text-sm font-medium text-black">{card.value}</p>
                <p className="mt-1 text-xs text-black/55">{card.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="plot-wire-card-muted bg-white p-4">
          <p className="plot-wire-label">Calendar</p>
          <p className="mt-2 text-2xl font-semibold text-black">{calendarDate}</p>
          <p className="mt-1 text-sm text-black/60">
            {eventsThisWeek} event{eventsThisWeek === 1 ? '' : 's'} this week
          </p>
          <p className="mt-4 text-[11px] uppercase tracking-[0.12em] text-black/55">
            Scene Context
          </p>
          <p className="mt-1 text-sm font-medium text-black">
            {selectedCommunityLabel ??
              (homeScene?.city && homeScene?.state && homeScene?.musicCommunity
                ? `${homeScene.city}, ${homeScene.state} • ${homeScene.musicCommunity}`
                : 'No scene selected')}
          </p>
        </div>
      </header>

      {activationNotices.length > 0 ? (
        <section
          data-slot="profile-activation-notices"
          className="plot-wire-card-muted border-[#b8d63b] bg-[#f2f7d7] p-4"
        >
          <p className="plot-wire-label">Home Scene Update</p>
          <div className="mt-2 space-y-2">
            {activationNotices.slice(0, 2).map((notice) => (
              <div key={notice.id} className="rounded-xl border border-black/10 bg-white p-3">
                <p className="text-sm font-semibold text-black">
                  {notice.toScene.name || `${notice.city}, ${notice.state} ${notice.musicCommunity}`} is active
                </p>
                <p className="mt-1 text-xs text-black/65">
                  {notice.message ??
                    'Your submitted Home Scene is now active because enough local music is ready.'}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section data-slot="profile-music-community-preferences" className="plot-wire-card-muted p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="plot-wire-label">Music Communities</p>
            <h3 className="mt-1 text-base font-semibold text-black">Primary affiliations</h3>
            <p className="mt-1 max-w-2xl text-sm text-black/70">
              Preferences stay in your profile and re-resolve when your current city changes.
            </p>
          </div>

          {token ? (
            <form className="flex flex-col gap-2 sm:flex-row" onSubmit={onAddMusicCommunityPreference}>
              <label className="sr-only" htmlFor="music-community-preference-select">
                Add a music community
              </label>
              <select
                id="music-community-preference-select"
                value={musicCommunityPreferenceDraft}
                onChange={(event) => onMusicCommunityPreferenceDraftChange(event.target.value)}
                className="h-9 min-w-[190px] rounded-full border border-black bg-white px-3 text-xs font-semibold uppercase tracking-[0.1em] text-black"
                disabled={musicCommunityPreferenceSaving}
              >
                <option value="">Add a music community</option>
                {availableMusicCommunityPreferences.map((musicCommunity) => (
                  <option key={musicCommunity} value={musicCommunity}>
                    {musicCommunity}
                  </option>
                ))}
              </select>
              <Button
                type="submit"
                size="sm"
                variant="outline"
                className="h-9 rounded-full border-black bg-white text-xs font-semibold uppercase tracking-[0.12em]"
                disabled={musicCommunityPreferenceSaving || !musicCommunityPreferenceDraft.trim()}
              >
                Save
              </Button>
            </form>
          ) : null}
        </div>

        {!token ? (
          <p className="mt-4 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Sign in to manage music-community preferences.
          </p>
        ) : musicCommunityPreferencesLoading ? (
          <p className="mt-4 text-sm text-black/60">Loading music communities...</p>
        ) : musicCommunityPreferencesError ? (
          <p className="mt-4 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
            {musicCommunityPreferencesError}
          </p>
        ) : musicCommunityPreferences.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {musicCommunityPreferences.map((preference) => {
              const isResolvedInSelector = resolvedSelectorMusicCommunities.has(
                preference.musicCommunity.trim().toLowerCase()
              );

              return (
                <div
                  key={preference.id}
                  className="flex items-center gap-2 rounded-full border border-black bg-white px-3 py-2"
                >
                  <span className="text-sm font-semibold text-black">
                    {preference.musicCommunity}
                  </span>
                  <span className="rounded-full border border-black/15 bg-[#efefe2] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-black/65">
                    {isResolvedInSelector ? 'Shown in Home' : 'Profile-only until active scene'}
                  </span>
                  {preference.isDefault ? (
                    <span className="rounded-full bg-[#b8d63b] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-black">
                      Default Home Scene
                    </span>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 rounded-full border-black bg-[#efefe2] text-[10px] font-semibold uppercase tracking-[0.12em]"
                      disabled={musicCommunityPreferenceSaving}
                      onClick={() => onSetDefaultMusicCommunityPreference(preference.musicCommunity)}
                    >
                      Make default
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 text-sm text-black/60">No music-community preferences saved yet.</p>
        )}
      </section>

      <div className="plot-wire-card-muted p-4">
        <div className="flex flex-wrap gap-2">
          {expandedProfileSections.map((section) => (
            <Button
              key={section}
              size="sm"
              variant={activeProfileSection === section ? 'default' : 'outline'}
              className={
                activeProfileSection === section
                  ? 'h-8 rounded-full border-black bg-[#b8d63b] text-xs font-semibold uppercase tracking-[0.1em] text-black hover:bg-[#b8d63b]/90'
                  : 'h-8 rounded-full border-black bg-white text-xs font-semibold uppercase tracking-[0.1em] text-black hover:bg-black/5'
              }
              onClick={() => onActiveProfileSectionChange(section)}
            >
              {section}
            </Button>
          ))}
        </div>

        <div className="mt-4 rounded-[1rem] border border-black bg-white p-4">
          <p className="text-sm font-medium text-black">{activeProfileSection}</p>
          {activeProfileSection === 'Singles/Playlists' ? (
            <div className="mt-3 space-y-3">
              {!token ? (
                <p className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                  Sign in to view saved singles and playlist groupings.
                </p>
              ) : plotProfileLoading ? (
                <p className="text-sm text-black/60">Loading collection shelves...</p>
              ) : plotProfileError ? (
                <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {plotProfileError}
                </p>
              ) : !canViewCollection ? (
                <p className="text-sm text-black/60">
                  Collection visibility is disabled for this profile.
                </p>
              ) : singlesCollectionItems.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {singlesShelf?.items.map((item) => {
                    const collectionItem = {
                      id: item.signalId,
                      label: formatShelfItemPrimaryLabel(item),
                      kind: 'track' as const,
                    };

                    return (
                      <button
                        key={item.signalId}
                        type="button"
                        className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left transition-colors ${
                          selectedCollectionItem?.id === collectionItem.id
                            ? 'border-black bg-black text-white'
                            : 'border-black/10 bg-black/[0.02] text-black hover:bg-black/[0.05]'
                        }`}
                        onClick={() => onCollectionSelection(collectionItem)}
                      >
                        <span>
                          <span className="block text-sm font-medium">{collectionItem.label}</span>
                          <span
                            className={`block text-[11px] uppercase tracking-[0.12em] ${
                              selectedCollectionItem?.id === collectionItem.id
                                ? 'text-white/75'
                                : 'text-black/55'
                            }`}
                          >
                            Track • {formatShelfItemSecondaryLabel(item)}
                          </span>
                        </span>
                        <span
                          className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${
                            selectedCollectionItem?.id === collectionItem.id
                              ? 'text-white/75'
                              : 'text-black/55'
                          }`}
                        >
                          {selectedCollectionItem?.id === collectionItem.id && playerMode === 'SPACE'
                            ? 'Live in space'
                            : 'Select to enter your space'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-black/60">No saved singles yet.</p>
              )}

              <div className="plot-wire-card-muted p-3">
                <p className="plot-wire-label">Playlist Groupings</p>
                <p className="mt-1 text-sm text-black/70">
                  Saved playlist groupings appear here when they are available in your collection.
                </p>
              </div>
            </div>
          ) : activeProfileSection === 'Events' ? (
            <div className="mt-3 space-y-3">
              {!token ? (
                <p className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                  Sign in to view saved event artifacts and fliers.
                </p>
              ) : plotProfileLoading ? (
                <p className="text-sm text-black/60">Loading collection shelves...</p>
              ) : plotProfileError ? (
                <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {plotProfileError}
                </p>
              ) : (fliersShelf?.items.length ?? 0) > 0 ? (
                <ul className="space-y-2">
                  {fliersShelf?.items.slice(0, 6).map((item) => (
                    <li key={item.signalId} className="plot-wire-card-muted p-3">
                      <p className="text-sm font-medium text-black">
                        {formatShelfItemPrimaryLabel(item)}
                      </p>
                      <p className="mt-1 text-xs text-black/55">
                        {formatShelfItemSecondaryLabel(item)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-black/60">No saved event artifacts or fliers yet.</p>
              )}
            </div>
          ) : activeProfileSection === 'Photos' ? (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="plot-wire-card-muted p-3">
                <p className="plot-wire-label">Scene Photography</p>
                <p className="mt-1 text-sm text-black/70">
                  Saved event and scene photography artifacts appear in this workspace.
                </p>
              </div>
              <div className="plot-wire-card-muted p-3">
                <p className="plot-wire-label">Current Scene</p>
                <p className="mt-1 text-sm font-medium text-black">
                  {selectedCommunityLabel ?? 'No scene selected'}
                </p>
              </div>
            </div>
          ) : activeProfileSection === 'Merch' ? (
            <div className="mt-3 space-y-3">
              {!token ? (
                <p className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                  Sign in to view saved merch items.
                </p>
              ) : plotProfileLoading ? (
                <p className="text-sm text-black/60">Loading collection shelves...</p>
              ) : plotProfileError ? (
                <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {plotProfileError}
                </p>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                  {[
                    { label: 'Posters', shelf: posterShelf },
                    { label: 'Shirts', shelf: merchShirtShelf },
                    { label: 'Patches', shelf: merchPatchShelf },
                    { label: 'Buttons', shelf: merchButtonShelf },
                    { label: 'Special Items', shelf: null },
                  ].map((item) => (
                    <div key={item.label} className="plot-wire-card-muted p-3">
                      <p className="text-sm font-medium text-black">{item.label}</p>
                      <p className="mt-1 text-xs text-black/55">
                        {item.shelf
                          ? `${item.shelf.itemCount} saved item${item.shelf.itemCount === 1 ? '' : 's'}`
                          : 'No saved items yet.'}
                      </p>
                      {item.shelf?.items[0] ? (
                        <p className="mt-2 text-xs text-black/60">
                          {formatShelfItemPrimaryLabel(item.shelf.items[0])}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeProfileSection === 'Saved Uprises' ? (
            <div className="mt-3 space-y-3">
              {!token ? (
                <p className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                  Sign in to view saved/followed Uprises.
                </p>
              ) : plotProfileLoading ? (
                <p className="text-sm text-black/60">Loading collection shelves...</p>
              ) : plotProfileError ? (
                <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {plotProfileError}
                </p>
              ) : (
                <>
                  {savedAwayScenes.length > 0 ? (
                    <div data-slot="profile-saved-away-scenes" className="space-y-2">
                      <p className="plot-wire-label">Away Scenes</p>
                      {savedAwayScenes.slice(0, 6).map((savedScene) => (
                        <div key={savedScene.id} className="plot-wire-card-muted p-3">
                          <p className="text-sm font-medium text-black">{savedScene.scene.name}</p>
                          <p className="mt-1 text-xs text-black/55">
                            Former proxy scene saved for listening context. Voting follows your current verified Home Scene.
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {(uprisesShelf?.items.length ?? 0) > 0 ? (
                    <ul className="space-y-2">
                      {uprisesShelf?.items.slice(0, 6).map((item) => (
                        <li key={item.signalId} className="plot-wire-card-muted p-3">
                          <p className="text-sm font-medium text-black">
                            {formatShelfItemPrimaryLabel(item)}
                          </p>
                          <p className="mt-1 text-xs text-black/55">
                            {formatShelfItemSecondaryLabel(item)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : savedAwayScenes.length === 0 ? (
                    <p className="text-sm text-black/60">No saved Uprises or Away Scenes yet.</p>
                  ) : null}
                </>
              )}
            </div>
          ) : (
            <div className="plot-wire-card-muted mt-3 p-3">
              <p className="plot-wire-label">Saved Promos/Coupons</p>
              <p className="mt-1 text-sm text-black/70">
                Saved promos and coupons appear here with status and expiration when collection support is available.
              </p>
            </div>
          )}
        </div>
      </div>

      <div data-slot="expanded-profile-player-strip">{playerPanel}</div>

      <div className="flex flex-wrap gap-2.5">
        <Button
          size="sm"
          variant="outline"
          className="h-8 rounded-full border-black bg-white text-xs font-semibold uppercase tracking-[0.12em]"
          onClick={onReturnToPlotTabs}
        >
          Return to Plot Tabs
        </Button>
      </div>
    </section>
  );
}
