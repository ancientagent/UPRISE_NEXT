export const SET_COMMUNITY_KEY = 'community/SET_COMMUNITY_KEY';
export const SET_REVOLUTIONARY = 'community/SET_REVOLUTIONARY';
export const CLEAR_REVOLUTIONARY = 'community/CLEAR_REVOLUTIONARY';

export const setCommunityKey = communityKey => ({
  type: SET_COMMUNITY_KEY,
  payload: { communityKey },
});

// Mark user as a revolutionary for an inactive local community.
// original should include { city, state, superGenre, community_key }
export const setRevolutionary = original => ({
  type: SET_REVOLUTIONARY,
  payload: { original },
});

export const clearRevolutionary = () => ({
  type: CLEAR_REVOLUTIONARY,
});
