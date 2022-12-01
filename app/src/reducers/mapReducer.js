import * as ol from 'ol'

const INITIAL_STATE = new ol.Map({
  view: new ol.View({
    center: [-61, -26],
    zoom: 7.5,
    projection: 'EPSG:4326'
  })
})

export const SET_CENTER = 'SET_CENTER'

export const SET_ZOOM = 'SET_ZOOM'

export const SET_TARGET = 'SET_TARGET'

export const SET_PROJECTION = 'SET_PROJECTION'

export const mapReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_CENTER:
      return state.getView().setCenter(action.payload)
    case SET_ZOOM:
      return state.getView().setZoom(action.payload)
    case SET_TARGET:
      return state.setTarget(action.payload)
    case SET_PROJECTION:
      return state.getView().setProjection(action.payload)
    default:
      return state
  }
}
