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
import { LineString, MultiPolygon } from 'ol/geom'
import { useDispatch, useSelector } from 'react-redux'
import VectorLayer from './components/Layers/VectorLayer'
import { VITE_MAP } from './vite-env.d'
import { TOGGLE_LAYER } from './reducers/layersReducer'
import Controls from './components/Controls/Controls'
import ScaleControl from './components/Controls/Scale'
import '../node_modules/ol/ol.css'
import FullScreenControl from './components/Controls/FullScreenControl'
import Leyend from './components/Leyend/Leyend'
import GeoJSON from 'ol/format/GeoJSON'
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

const url = `http://localhost/qgis/qgis_mapserv.fcgi.exe?map=${VITE_MAP}`

const App = () => {
  const [center, setCenter] = useState([-61, -26])
  const [zoom, setZoom] = useState(7.5)

  const consultLayer = useSelector(state => state.consultLayer)

  const selectedOption = useSelector(store => store.interaction)

  const availableLayers = useSelector(store => store.layers)

  console.log(consultLayer)

  const dispatch = useDispatch()

  const [projection, setProjection] = useState('EPSG:4326')
  const [source, setSource] = useState(new VectorSource())
  return (
    <>
      <div className='flex w-screen h-screen'>
        <Map className='m-0' center={center} zoom={zoom} projection={projection}>
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
            {consultLayer?.type &&
              <VectorLayer
                source={new VectorSource({ features: new GeoJSON().readFeatures(consultLayer) })} style={new Style({
                  stroke: new Stroke({
                    color: 'blue',
                    width: 1
                  }),
                  fill: new Fill({
                    color: 'rgba(0, 0, 255, 0.1)'
                  })
                })}
              />}
          </Layers>
          <Interactions>
            <DragBoxInteraction />
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
          <Controls>
            <ScaleControl />
            <FullScreenControl />
          </Controls>
        </Map>
        <div className='flex flex-col p-2 gap-3'>
          <div className='flex flex-col bg-gray-500 p-3 rounded-md'>
            <h6 className='mb-3 bg-slate-600 rounded-md p-2'>
              Capas disponibles:
            </h6>
            <div className=' overflow-auto h-60'>
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
          <div className='bg-gray-500 p-3 rounded-lg gap-3 flex flex-col'>
            <h6 className='bg-slate-600 rounded-md p-2'>
              Interacciones disponibles:
            </h6>
            <select className='text-black min-w-full p-2 rounded-md' value={selectedOption} onChange={(e) => dispatch({ type: SET_INTERACTION_OPTION, payload: e.currentTarget.value })}>
              <option value={availableStates.navigation}>{availableStates.navigation}</option>
              <option value={availableStates.consultation}>{availableStates.consultation}</option>
              <option value={availableStates.measurement}>{availableStates.measurement}</option>
            </select>
          </div>
          <Leyend url={url} />
        </div>
      </div>
    </>
  )
}

export default App
