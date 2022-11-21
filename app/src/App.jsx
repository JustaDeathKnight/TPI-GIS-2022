import React, { useReducer, useState, useEffect } from 'react'
import Map from './components/Map/Map'
import TileLayer from './components/Layers/TileLayer'
import ImageLayer from './components/Layers/ImageLayer'
import Layers from './components/Layers/Layers'
import { Style, Icon, Stroke, Fill } from 'ol/style'
import { TileWMS } from 'ol/source'
import Interactions from './components/Interactions/Interactions'
import DragBoxInteraction from './components/Interactions/Dragbox'
import { SET_INTERACTION_OPTION } from './reducers/interactionReducer'
import ImageWMS from './components/Source/ImageWMS'
import DrawInteraction from './components/Interactions/Draw'
import CircleStyle from 'ol/style/Circle'
import VectorSource from 'ol/source/Vector'
import { useDispatch, useSelector } from 'react-redux'
import VectorLayer from './components/Layers/VectorLayer'
import { VITE_MAP } from './vite-env.d'
import { CLEAR_ALL_LAYERS, TOGGLE_LAYER } from './reducers/layersReducer'
import Controls from './components/Controls/Controls'
import ScaleControl from './components/Controls/Scale'
import '../node_modules/ol/ol.css'
import FullScreenControl from './components/Controls/FullScreenControl'
import Leyend from './components/Leyend/Leyend'
import GeoJSON from 'ol/format/GeoJSON'
import { CLEAR_CONSULT_LAYER } from './reducers/consultLayerReducer'
import AddMarkerInteraction from './components/Interactions/AddMarker'
import { getMarkers } from './services/api'
import RemoveMarkerInteraction from './components/Interactions/RemoveMarker'
import ReactDOM from 'react-dom'

const url = `http://localhost/qgis/qgis_mapserv.fcgi.exe?map=${VITE_MAP}`

const App = () => {
  const [center, setCenter] = useState([-61, -26])
  const [zoom, setZoom] = useState(7.5)
  const [projection, setProjection] = useState('EPSG:4326')

  const consultLayer = useSelector(state => state.consultLayer)

  const selectedOption = useSelector(store => store.interaction)

  const availableLayers = useSelector(store => store.layers)

  const dispatch = useDispatch()

  const [source, setSource] = useState(new VectorSource())

  const [consultLayerSource, setConsultLayerSource] = useState(new VectorSource())

  const [markersLayerSource, setMarkersLayerSource] = useState(new VectorSource())

  const styleFunction = () => {
    return new Style({
      stroke: new Stroke({
        color: 'rgba(255, 0, 0, 1)',
        width: 2
      }),
      fill: new Fill({
        color: 'rgba(255, 0, 0, 0.2)'
      }),
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({
          color: 'rgba(255, 0, 0, 0.2)'
        })
      })
    })
  }

  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    (async function () {
      const response = await getMarkers()
      console.log(response)
      const format = new GeoJSON()
      const features = format.readFeatures(response)
      const source = new VectorSource({
        features
      })
      setMarkersLayerSource(() => source)
    }())
    return () => {
      setMarkersLayerSource(() => new VectorSource())
    }
  }, [])

  const handleReset = () => {
    consultLayerSource.clear()
    source.clear()
    dispatch({ type: CLEAR_CONSULT_LAYER })
    dispatch({ type: CLEAR_ALL_LAYERS })
  }

  useEffect(() => {
    if (consultLayer.length <= 0) return
    const format = new GeoJSON()
    const features = format.readFeatures(consultLayer)
    const source = new VectorSource({
      features
    })
    setShowModal(true)
    setConsultLayerSource(source)
    return () => {
      setConsultLayerSource(() => new VectorSource())
    }
  }, [consultLayer])

  const [isShowTooltip, setIsShowTooltip] = useState({
    navigation: false,
    consultation: false,
    measurement: false,
    addMarker: false,
    removeMarker: false,
    clear: false
  })

  const handleChangeInteraction = (e) => {
    const { name } = e.currentTarget
    dispatch({ type: SET_INTERACTION_OPTION, payload: name })
  }

  const onMouseEnter = (e) => {
    const { name } = e.currentTarget
    setIsShowTooltip((prevState) => ({
      ...prevState,
      [name]: true
    }))
  }

  const onMouseLeave = (e) => {
    const { name } = e.currentTarget
    setIsShowTooltip((prevState) => ({
      ...prevState,
      [name]: false
    }))
  }

  console.log(selectedOption)

  return (
    <>
      <div className='flex w-screen h-screen'>
        <div className='bg-gray-500 p-1 gap-3 flex flex-col'>
          <div className='flex-col flex gap-2 bg-slate-600 rounded-md p-2'>
            <button name='navigation' className={(selectedOption === 'navigation') ? 'relative bg-slate-300' : 'relative'} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleChangeInteraction}>
              <img className='h-6 aspect-square' src='https://cdn-icons-png.flaticon.com/512/1828/1828166.png ' />
              <div className={isShowTooltip.navigation ? 'absolute bg-gray-300 opacity-90 rounded-md p-2 top-0 -right-16 z-50' : 'hidden'}>
                <p>Navegar</p>
              </div>
            </button>
            <button name='consultation' className={(selectedOption === 'consultation') ? 'relative bg-slate-300' : 'relative'} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleChangeInteraction}>
              <img className='h-6' src='https://cdn-icons-png.flaticon.com/512/103/103091.png ' />
              <div className={isShowTooltip.consultation ? 'absolute bg-gray-300 opacity-90 rounded-md p-2 top-0 -right-20 z-50' : 'hidden'}>
                <p>Consultar</p>
              </div>
            </button>
            <button name='measurement' className={(selectedOption === 'measurement') ? 'relative bg-slate-300' : 'relative'} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleChangeInteraction}>
              <img className='h-6' src='https://cdn-icons-png.flaticon.com/128/570/570968.png' />
              <div className={isShowTooltip.measurement ? 'absolute whitespace-nowrap bg-gray-300 opacity-90 rounded-md p-2 top-0 -right-32 z-50' : 'hidden'}>
                <p>Medir Distancias</p>
              </div>
            </button>
            <button name='addMarker' className={(selectedOption === 'addMarker') ? 'relative bg-slate-300' : 'relative'} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleChangeInteraction}>
              <img className='h-6' src='https://cdn-icons-png.flaticon.com/512/5055/5055641.png' />
              <div className={isShowTooltip.addMarker ? 'absolute whitespace-nowrap bg-gray-300 opacity-90 rounded-md p-2 top-0 -right-32 z-50' : 'hidden'}>
                <p>Añadir Marcador</p>
              </div>
            </button>
            <button name='removeMarker' className={(selectedOption === 'removeMarker') ? 'relative bg-slate-300' : 'relative'} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleChangeInteraction}>
              <img className='h-6' src='   https://cdn-icons-png.flaticon.com/512/5055/5055644.png ' />
              <div className={isShowTooltip.removeMarker ? 'absolute whitespace-nowrap bg-gray-300 opacity-90 rounded-md p-2 top-0 -right-40 z-50' : 'hidden'}>
                <p>Eliminar Marcadores</p>
              </div>
            </button>
            <button name='clear' className='relative' onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleReset}>
              <img className='h-6' src='https://cdn-icons-png.flaticon.com/512/1198/1198941.png' />
              <div className={isShowTooltip.clear ? 'absolute bg-gray-300 opacity-90 rounded-md p-2 top-0 -right-16 z-50' : 'hidden'}>
                <p>Limpiar</p>
              </div>
            </button>
          </div>
        </div>
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
            <VectorLayer
              zIndex={5}
              source={consultLayerSource}
              style={styleFunction}
            />
            <VectorLayer
              zIndex={6}
              source={markersLayerSource}
              marker
            />
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
            <AddMarkerInteraction markersLayerSource={markersLayerSource} />
            <RemoveMarkerInteraction markersLayerSource={markersLayerSource} />
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
            <div className=' overflow-auto h-80'>
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
          <Leyend url={url} />
          <>
            {(showModal && consultLayer?.features?.length > 0) &&
              <ReactPortal wrapperId='modal'>
                <div className=' p-10 rounded-lg gap-3 flex justify-center items-center absolute w-screen h-screen max-h-screen z-50 bg-slate-800 opacity-90'>
                  <div className='bg-gray-500 max-w-screen-2xl max-h-full p-5 rounded-lg relative shadow-md shadow-slate-500'>
                    <h6 className='bg-slate-600 rounded-md p-2 mb-2 text-white'>
                      Consulta de capas:
                    </h6>
                    <div className=' max-w-max max-h-[80vh] overflow-auto'>
                      <table className='table-auto text-center border-spacing-6'>
                        {consultLayer?.features?.map((feature, index) => (
                          <React.Fragment key={index}>
                            {(index === 0) &&
                              <thead className=' bg-slate-800 text-white' key={feature.type + index}>
                                <tr className='py-2'>
                                  {Object?.entries(feature?.geometry?.properties)?.map(([key, property]) => (
                                    <th className='py-2' key={key}>
                                      {key}
                                    </th>
                                  ))}
                                </tr>
                              </thead>}
                            <tbody className='text-slate-900'>
                              {Object?.entries(feature?.geometry?.properties)?.map(([key, property]) => (
                                <td key={key}>
                                  {property}
                                </td>
                              ))}
                            </tbody>
                          </React.Fragment>
                        ))}
                      </table>
                    </div>
                    <button onClick={() => { setShowModal(false) }} className=' bg-white rounded-full py-3 text-md absolute -top-5 -right-5'>x</button>
                  </div>
                </div>
              </ReactPortal>}
          </>
        </div>
      </div>
    </>
  )
}

export default App

function ReactPortal ({ children, wrapperId }) {
  const wrapper = document.getElementById(wrapperId)
  document.className = 'absolute top-0 left-0 w-screen h-screen'
  return ReactDOM.createPortal(children, wrapper)
}
