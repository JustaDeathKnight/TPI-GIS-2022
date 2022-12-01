import { useContext, useEffect } from 'react'
import { Image } from 'ol/layer'
import { useSelector } from 'react-redux'

const ImageLayer = ({ source, zIndex = 0 }) => {
  const map = useSelector(store => store.map)

  useEffect(() => {
    if (!map) return

    const imageLayer = new Image({
      source,
      zIndex
    })

    map.addLayer(imageLayer)
    imageLayer.setZIndex(zIndex)

    return () => {
      if (map) {
        map.removeLayer(imageLayer)
      }
    }
  }, [map])

  return null
}

export default ImageLayer
