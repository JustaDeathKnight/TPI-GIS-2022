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
import { CLEAR_ALL_LAYERS, FILTER_LAYERS, TOGGLE_LAYER } from './reducers/layersReducer'
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
import { SET_CENTER, SET_PROJECTION, SET_ZOOM } from './reducers/mapReducer'

const url = `http://localhost/qgis/qgis_mapserv.fcgi.exe?map=${VITE_MAP}`

const App = () => {

  const consultLayer = useSelector(state => state.consultLayer)

  const selectedOption = useSelector(store => store.interaction)

  const availableLayers = useSelector(store => store.layers)

  const map = useSelector(store => store.map)

  const [filterLayers, setFilterLayers] = useState([...availableLayers])

  const [filter, setFilter] = useState('')

  const dispatch = useDispatch()

  const [measureLayerSource, setSource] = useState(new VectorSource())

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

  useEffect(() => {
    const filteredLayers = availableLayers.filter(layer => layer.name.toLowerCase().includes(filter.toLowerCase()))
    setFilterLayers(filteredLayers)
  }
  , [availableLayers, filter])

  const handleReset = () => {
    measureLayerSource.getFeatures().forEach(feature => map.removeOverlay(feature.get('overlay')))
    consultLayerSource.clear()
    measureLayerSource.clear()
    dispatch({ type: CLEAR_CONSULT_LAYER })
    dispatch({ type: CLEAR_ALL_LAYERS })
  }

  useEffect(() => {
    // if (consultLayer.length <= 0) return
    const format = new GeoJSON()
    const source = new VectorSource()

    Object.entries(consultLayer).forEach(([layer, value]) => {
      const features = format.readFeatures(value)
      source.addFeatures(features)
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

  console.log(consultLayer)

  const handleFilter = (e) => {
    setFilter(e.currentTarget.value)
  }

  return (
    <>
      <div className='flex sm:flex-row flex-col w-screen min-h-screen bg-slate-800'>
        <div className='bg-gray-500 p-1 gap-3 flex sm:flex-col flex-row sm:justify-start justify-center'>
          <div className='min-w-max flex sm:flex-col flex-row gap-2 bg-slate-600 rounded-md p-2'>
            <button name='navigation' className={(selectedOption === 'navigation') ? 'relative bg-slate-300' : 'relative'} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleChangeInteraction}>
              <img className='sm:h-6 h-4' src='https://cdn-icons-png.flaticon.com/512/1828/1828166.png ' />
              <div className={isShowTooltip.navigation ? 'absolute bg-gray-300 opacity-90 rounded-md p-2 top-0 -right-16 z-50' : 'hidden'}>
                <p>Navegar</p>
              </div>
            </button>
            <button name='consultation' className={(selectedOption === 'consultation') ? 'relative bg-slate-300' : 'relative'} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleChangeInteraction}>
              <img className='sm:h-6 h-4' src='https://cdn-icons-png.flaticon.com/512/103/103091.png ' />
              <div className={isShowTooltip.consultation ? 'absolute bg-gray-300 opacity-90 rounded-md p-2 top-0 -right-20 z-50' : 'hidden'}>
                <p>Consultar</p>
              </div>
            </button>
            <button name='measurement' className={(selectedOption === 'measurement') ? 'relative bg-slate-300' : 'relative'} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleChangeInteraction}>
              <img className='sm:h-6 h-4' src='https://cdn-icons-png.flaticon.com/128/570/570968.png' />
              <div className={isShowTooltip.measurement ? 'absolute whitespace-nowrap bg-gray-300 opacity-90 rounded-md p-2 top-0 -right-32 z-50' : 'hidden'}>
                <p>Medir Distancias</p>
              </div>
            </button>
            <button name='addMarker' className={(selectedOption === 'addMarker') ? 'relative bg-slate-300' : 'relative'} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleChangeInteraction}>
              <img className='sm:h-6 h-4' src='https://cdn-icons-png.flaticon.com/512/5055/5055641.png' />
              <div className={isShowTooltip.addMarker ? 'absolute whitespace-nowrap bg-gray-300 opacity-90 rounded-md p-2 top-0 -right-32 z-50' : 'hidden'}>
                <p>Añadir Marcador</p>
              </div>
            </button>
            <button name='removeMarker' className={(selectedOption === 'removeMarker') ? 'relative bg-slate-300' : 'relative'} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleChangeInteraction}>
              <img className='sm:h-6 h-4' src='   https://cdn-icons-png.flaticon.com/512/5055/5055644.png ' />
              <div className={isShowTooltip.removeMarker ? 'absolute whitespace-nowrap bg-gray-300 opacity-90 rounded-md p-2 top-0 -right-40 z-50' : 'hidden'}>
                <p>Eliminar Marcadores</p>
              </div>
            </button>
            <button name='clear' className='relative' onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleReset}>
              <img className='sm:h-6 h-4' src='https://cdn-icons-png.flaticon.com/512/1198/1198941.png' />
              <div className={isShowTooltip.clear ? 'absolute bg-gray-300 opacity-90 rounded-md p-2 top-0 -right-16 z-50' : 'hidden'}>
                <p>Limpiar</p>
              </div>
            </button>
          </div>
        </div>
        <Map className='m-0'>
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
                    zIndex={layer.zIndex}
                  />
                )}
              </div>
            ))}
            <VectorLayer
              source={measureLayerSource} style={{
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
                source: measureLayerSource,
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
            <RemoveMarkerInteraction markersLayerSource={markersLayerSource} />
            <AddMarkerInteraction markersLayerSource={markersLayerSource} />
          </Interactions>
          <Controls>
            <ScaleControl />
            <FullScreenControl />
          </Controls>
        </Map>
        <div className='flex flex-col p-2 gap-3'>
          <div className='flex flex-col bg-gray-500 p-3 rounded-md sm:h-auto h-full'>
            <h6 className='mb-3 bg-slate-600 rounded-md p-2'>
              Capas disponibles:
            </h6>
            <input placeholder='Busca una capa...' className='mb-2 rounded-md px-2 py-1' onChange={handleFilter} />
            <div className=' overflow-auto sm:h-80 h-40'>
              {filterLayers?.map((layer) => (
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
            {(showModal && Object?.entries(consultLayer)?.length > 0) &&
              <ReactPortal wrapperId='modal'>
                <div className=' p-10 rounded-lg gap-3 flex justify-center items-center absolute w-screen h-screen max-h-screen z-50 bg-slate-800 opacity-90'>
                  <div className='bg-gray-500 max-w-screen-2xl max-h-full p-5 rounded-lg relative shadow-md shadow-slate-500'>
                    <h6 className='bg-slate-600 rounded-md p-2 mb-2 text-white text-2xl'>
                      Consulta de capas:
                    </h6>
                    <div className=' sm:max-w-max max-w-[280px] max-h-[80vh] overflow-auto gap-4'>
                      {Object?.entries(consultLayer)?.map(([layer, { features }]) => (
                        <React.Fragment key={layer}>
                          {features.length > 0 && <h6 className='bg-slate-800 rounded-md p-2 mb-2 text-white text-xl w-full'>{layer}</h6>}
                          <table className='table-auto text-center border-spacing-6 w-full'>
                            {features?.map(({ type, geometry, properties }, index) => (
                              <React.Fragment key={index}>
                                {(index === 0) &&
                                  <thead className=' bg-slate-800 text-white' key={type + index}>
                                    <tr className='py-2'>
                                      {Object?.entries(properties)?.map(([key, property]) => (
                                        <th className='py-2' key={key}>
                                          {key}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>}
                                <tbody className='text-slate-900'>
                                  {Object?.entries(properties)?.map(([key, property]) => (
                                    <td key={key}>
                                      {property}
                                    </td>
                                  ))}
                                </tbody>
                              </React.Fragment>
                            ))}
                          </table>
                        </React.Fragment>
                      ))}
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
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])
  return ReactDOM.createPortal(children, wrapper)
}
