import { SET_COMMUNITY_KEY, SET_REVOLUTIONARY, CLEAR_REVOLUTIONARY } from '../../actions/community/community.actions';

const initialState = {
  communityKey: null,
  revolutionary: {
    active: false,
    original: null, // { city, state, superGenre, community_key }
  },
};

export default function communityReducer(state = initialState, action) {
  switch (action.type) {
    case SET_COMMUNITY_KEY:
      return { ...state, communityKey: action.payload.communityKey || null };
    case SET_REVOLUTIONARY:
      return { ...state, revolutionary: { active: true, original: action.payload.original || null } };
    case CLEAR_REVOLUTIONARY:
      return { ...state, revolutionary: { active: false, original: null } };
    default:
      return state;
  }
}
