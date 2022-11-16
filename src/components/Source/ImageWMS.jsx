import * as olSource from 'ol/source'

function ImageWMS (url, layer) {
  return new olSource.ImageWMS({
    url,
    params: {
      LAYERS: layer
    }
  })
}

export default ImageWMS
