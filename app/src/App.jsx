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

  const dispatch = useDispatch()

  const [projection, setProjection] = useState('EPSG:4326')

  const url = 'http://localhost/qgis/qgis_mapserv.fcgi.exe?map=C:\\Users\\Diego\\facu\\map-server\\tpigis.qgz'
  const [source, setSource] = useState(new VectorSource())
  return (
    <div className='bg-red-500'>
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

          {showLayer1 && (
            <ImageLayer
              source={ImageWMS(url, 'Red_Vial')}
            />
          )}
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
      <div>
        <input
          type='checkbox'
          checked={showLayer1}
          onChange={(event) => setShowLayer1(event.target.checked)}
        />{' '}
        Layer 1
      </div>
      <div>
        <input
          type='checkbox'
          checked={showLayer2}
          onChange={(event) => setShowLayer2(event.target.checked)}
        />{' '}
        Layer 2
      </div>
      <div>
        <select value={selectedOption} onChange={(e) => dispatch({ type: SET_INTERACTION_OPTION, payload: e.currentTarget.value })}>
          <option value={availableStates.navigation}>{availableStates.navigation}</option>
          <option value={availableStates.consultation}>{availableStates.consultation}</option>
          <option value={availableStates.measurement}>{availableStates.measurement}</option>
        </select>
      </div>
      <div />
      <div />
    </div>
  )
}

export default App
