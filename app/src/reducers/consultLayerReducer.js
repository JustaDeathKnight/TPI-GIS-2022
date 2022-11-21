export const SET_CONSULT_LAYER = 'SET_CONSULT_LAYER'

export const CLEAR_CONSULT_LAYER = 'CLEAR_CONSULT_LAYER'

export const consultLayerReducer = (state = [], action) => {
  switch (action.type) {
    case SET_CONSULT_LAYER:
      return action.payload
    case CLEAR_CONSULT_LAYER:
      return []
    default:
      return state
  }
}
