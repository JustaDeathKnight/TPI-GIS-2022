const SET_CONSULT_LAYER = 'SET_CONSULT_LAYER'

export const consultLayerReducer = (state = [], action) => {
  switch (action.type) {
    case SET_CONSULT_LAYER:
      return action.payload
    default:
      return state
  }
}
