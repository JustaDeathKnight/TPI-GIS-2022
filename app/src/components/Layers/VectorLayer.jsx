import { useContext, useEffect, useState } from 'react'
import MapContext from '../Map/MapContext'
import OLVectorLayer from 'ol/layer/Vector'
import { Fill, Icon, Stroke, Style } from 'ol/style'
import { Overlay } from 'ol'
import CircleStyle from 'ol/style/Circle'
import { useSelector } from 'react-redux'

const VectorLayer = ({ source, style, zIndex = 0, marker = false }) => {
  const map = useSelector(store => store.map)

  const [vectorLayer, setVectorLayer] = useState(null)

  const styleFunctionMarkers = (feature) => {
    if (feature.get('overlay')) {
      return new Style({
        image: new Icon({
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          displacement: [0, 13],
          src: 'https://cdn2.iconfinder.com/data/icons/social-media-and-payment/64/-47-32.png'
        })
      })
    }
    const div = document.createElement('div')
    div.className = 'p-2 bg-gray-100 rounded-md shadow-md'
    div.innerHTML = `
      <h3>Nombre: ${feature.get('Nombre')}</h3>
      <p>Descripcion: ${feature.get('Descripcion')}</p>`
    const overlay = new Overlay({
      offset: [0, -30],
      positioning: 'bottom-center',
      position: feature.getGeometry().getCoordinates(),
      element: div
    })
    feature.set('overlay', overlay)
    map.addOverlay(overlay)
    return new Style({
      image: new Icon({
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        displacement: [0, 13],
        src: 'https://cdn2.iconfinder.com/data/icons/social-media-and-payment/64/-47-32.png'
      })
    })
  }

  useEffect(() => {
    if (!map) return

    const vectorLayer = new OLVectorLayer({
      source,
      style: marker ? styleFunctionMarkers : style
    })

    map.addLayer(vectorLayer)
    vectorLayer.setZIndex(zIndex)

    setVectorLayer(vectorLayer)

    return () => {
      if (map) {
        map.removeLayer(vectorLayer)
      }
    }
  }, [map])

  useEffect(() => {
    if (!vectorLayer) return

    vectorLayer.setSource(source)

    return () => {
      vectorLayer.setSource(null)
    }
  }, [source])

  return null
}

export default VectorLayer
