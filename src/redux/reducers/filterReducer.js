import { SET_CATEGORY } from '../actions/filterActions';

const initialState = 'All';

export default function filterReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CATEGORY:
      return action.payload;
    default:
      return state;
  }
}
