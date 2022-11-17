export const availableStates = {
  navigation: 'navigation',
  consultation: 'consultation',
  measurement: 'measurement'
}

const INITIAL_STATE = availableStates.navigation

export const SET_INTERACTION_OPTION = 'SET_INTERACTION_OPTION'

export const interactionReducer = function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_INTERACTION_OPTION:
      return action.payload
    default:
      return state
  }
}
