import React, { useState, useEffect } from 'react'
import Map from './components/Map/Map'
import TileLayer from './components/Layers/TileLayer'
import ImageLayer from './components/Layers/ImageLayer'
import Layers from './components/Layers/Layers'
import { Style, Stroke, Fill } from 'ol/style'
import { TileWMS } from 'ol/source'
import Interactions from './components/Interactions/Interactions'
import DragBoxInteraction from './components/Interactions/Dragbox'
import ImageWMS from './components/Source/ImageWMS'
import DrawInteraction from './components/Interactions/Draw'
import CircleStyle from 'ol/style/Circle'
import VectorSource from 'ol/source/Vector'
import { useSelector } from 'react-redux'
import VectorLayer from './components/Layers/VectorLayer'
import { VITE_MAP } from './vite-env.d'
import Controls from './components/Controls/Controls'
import ScaleControl from './components/Controls/Scale'
import '../node_modules/ol/ol.css'
import FullScreenControl from './components/Controls/FullScreenControl'
import Leyend from './components/Leyend/Leyend'
import GeoJSON from 'ol/format/GeoJSON'
import AddMarkerInteraction from './components/Interactions/AddMarker'
import { getMarkers } from './services/api'
import RemoveMarkerInteraction from './components/Interactions/RemoveMarker'
import InteractionsPanel from './components/InteractionsPanel/InteractionsPanel'
import QueryModal from './components/QueryModal/QueryModal'
import LayersSelectionPanel from './components/LayersSelectionPanel/LayersSelectionPanel'

const url = `http://localhost/qgis/qgis_mapserv.fcgi.exe?map=${VITE_MAP}`

const App = () => {
  const consultLayer = useSelector(state => state.consultLayer)

  const availableLayers = useSelector(store => store.layers)

  const [measureLayerSource, setMeasureLayerSource] = useState(new VectorSource())

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

  const drawStyle = () => {
    return new Style({
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
  }

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

  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div className='flex sm:flex-row flex-col w-screen min-h-screen bg-slate-800'>
        <InteractionsPanel consultLayerSource={consultLayerSource} measureLayerSource={measureLayerSource} />
        <Map>
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
              }} zIndex='4'
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
                style: drawStyle
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
        <div className='flex flex-col px-2 py-4 gap-4'>
          <LayersSelectionPanel />
          <Leyend url={url} />
          <QueryModal showModal={showModal} setShowModal={setShowModal} />
        </div>
      </div>
    </>
  )
}

export default App
