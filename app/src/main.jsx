import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ReloadPrompt from './ReloadPrompt'
import './index.css'
import { Provider } from 'react-redux'
import { combineReducers, createStore } from 'redux'
import { interactionReducer } from './reducers/interactionReducer'
import { layersReducer } from './reducers/layersReducer'
import { consultLayerReducer } from './reducers/consultLayerReducer'
import { mapReducer } from './reducers/mapReducer'

const reducers = combineReducers(
  {
    map: mapReducer,
    consultLayer: consultLayerReducer,
    interaction: interactionReducer,
    layers: layersReducer
  }
)

const store = createStore(reducers)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ReloadPrompt />
    <App />
  </Provider>
)
