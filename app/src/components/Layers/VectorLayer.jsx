import { useContext, useEffect, useState } from 'react'
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
    div.className = 'p-2 bg-gray-100 rounded-md shadow-md sm:text-md text-xs'
    const h3 = document.createElement('h3')
    h3.innerHTML = feature.get('Nombre')
    const p = document.createElement('p')
    p.innerHTML = feature.get('Descripcion')
    const span1 = document.createElement('span')
    span1.className = 'text-xs text-slate-500'
    span1.innerHTML = 'Nombre: '
    const span2 = document.createElement('span')
    span2.className = 'text-xs text-slate-500'
    span2.innerHTML = 'Descripción: '
    h3.prepend(span1)
    p.prepend(span2)
    div.appendChild(h3)
    div.appendChild(p)
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
