import React, { useReducer, useState } from 'react'
import Map from './components/Map/Map'
import TileLayer from './components/Layers/TileLayer'
import ImageLayer from './components/Layers/ImageLayer'
import Layers from './components/Layers/Layers'
import { Style, Icon, Stroke, Fill } from 'ol/style'
import { always } from 'ol/events/condition'
// import Feature from 'ol/Feature'
// import Point from 'ol/geom/Point'
// import { fromLonLat } from 'ol/proj'
import { TileWMS } from 'ol/source'
import Interactions from './components/Interactions/Interactions'
import DragBoxInteraction from './components/Interactions/Dragbox'
import { interactionReducer, availableStates, SET_INTERACTION_OPTION } from './reducers/interactionReducer'
import ImageWMS from './components/Source/ImageWMS'
import DrawInteraction from './components/Interactions/Draw'
import CircleStyle from 'ol/style/Circle'
import VectorSource from 'ol/source/Vector'
import { LineString } from 'ol/geom'
import { useDispatch, useSelector } from 'react-redux'
import VectorLayer from './components/Layers/VectorLayer'
import { VITE_MAP } from './vite-env.d'
import { TOGGLE_LAYER } from './reducers/layersReducer'
// function addMarkers (lonLatArray) {
//   const iconStyle = new Style({
//     image: new Icon({
//       anchorXUnits: 'fraction',
//       anchorYUnits: 'pixels',
//       src: mapConfig.markerImage32
//     })
//   })
//   const features = lonLatArray.map((item) => {
//     const feature = new Feature({
//       geometry: new Point(fromLonLat(item))
//     })
//     feature.setStyle(iconStyle)
//     return feature
//   })
//   return features
// }

const App = () => {
  const [center, setCenter] = useState([-59, -27.5])
  const [zoom, setZoom] = useState(4)

  const [showLayer1, setShowLayer1] = useState(false)
  const [showLayer2, setShowLayer2] = useState(false)
  const [showMarker, setShowMarker] = useState(false)

  const selectedOption = useSelector(store => store.interaction)

  const availableLayers = useSelector(store => store.layers)

  const dispatch = useDispatch()

  const [projection, setProjection] = useState('EPSG:4326')

  const url = `http://localhost/qgis/qgis_mapserv.fcgi.exe?map=${VITE_MAP}`
  const [source, setSource] = useState(new VectorSource())
  return (
    <>
    <div className=' align-middle mt-5 mb-0 pb-0'>
      <h1 className=' text-center font-extrabold'>GUGLE MAPAS</h1>
    </div>
    <div className=' bg-slate-400 flex border-4 mt-5 rounded-xl a'>
      <Map center={center} zoom={zoom} projection={projection}>
        <Layers>
          <TileLayer
            source={
              new TileWMS({
                url: 'https://wms.ign.gob.ar/geoserver/ows',
                params: {
                  LAYERS: 'capabaseargenmap'
                }
              })
            }
            zIndex={0}
          />

          {availableLayers.map((layer) => (
            <div key={layer.name}>
              {layer.visible && (
                <ImageLayer
                  key={layer.name}
                  source={ImageWMS(url, layer.sourceName)}
                />
              )}
            </div>
          ))}
          <VectorLayer
            source={source} style={{
              'fill-color': 'rgba(255, 255, 255, 0.2)',
              'stroke-color': '#ffcc33',
              'stroke-width': 2,
              'circle-radius': 7,
              'circle-fill-color': '#ffcc33'
            }} zIndex='1'
          />
        </Layers>
        <Interactions>
          <DragBoxInteraction
            onBoxend={(evt) => {
              console.log(evt.target.getGeometry().getCoordinates())
            }}
          />
          <DrawInteraction
            drawOptions={{
              source,
              type: 'LineString',
              style: new Style({
                fill: new Fill({
                  color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new Stroke({
                  color: 'rgba(0, 0, 0, 0.5)',
                  lineDash: [10, 10],
                  width: 2
                }),
                image: new CircleStyle({
                  radius: 5,
                  stroke: new Stroke({
                    color: 'rgba(0, 0, 0, 0.7)'
                  }),
                  fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                  })
                })
              })
            }}
          />
        </Interactions>
      </Map>
      <div className='flex flex-col justify-around p-2 mr-9'>
        <div className='flex flex-col bg-gray-500 p-3 rounded-lg'>
          <h6 className='mb-3'>
            Capas disponibles:
          </h6>
          <div className=' overflow-auto h-40'>
            {availableLayers.map((layer) => (
              <div key={layer.name}>
                <input
            // create a input checkbox for each layer with tailwind classes
                  className='form-checkbox h-5 w-5 text-blue-600'
                  type='checkbox'
                  checked={layer.visible}
                  onChange={(event) => dispatch({ type: TOGGLE_LAYER, name: layer.name })}
                />{' '}
                {layer.name}
              </div>))}
          </div>
        </div>
        <div className='bg-gray-500 p-3 rounded-lg'>
          <h6  >
            Interacciones disponibles:
          </h6>
          <select className='text-black min-w-full' value={selectedOption} onChange={(e) => dispatch({ type: SET_INTERACTION_OPTION, payload: e.currentTarget.value })}>
            <option value={availableStates.navigation}>{availableStates.navigation}</option>
            <option value={availableStates.consultation}>{availableStates.consultation}</option>
            <option value={availableStates.measurement}>{availableStates.measurement}</option>
          </select>
        </div>
      </div>
    </div>
    </>
  )
}

export default App
