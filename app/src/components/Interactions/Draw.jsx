
import MapContext from '../Map/MapContext'
import { useContext, useEffect, useState } from 'react'
import Draw from 'ol/interaction/Draw'
import { availableStates } from '../../reducers/interactionReducer'
import { useSelector } from 'react-redux'
import { unByKey } from 'ol/Observable'
import { getLength } from 'ol/sphere'
import { Overlay } from 'ol'

const formatLength = function (line) {
  const length = getLength(line, { projection: 'EPSG:4326' })
  let output
  if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km'
  } else {
    output = Math.round(length * 100) / 100 + ' ' + 'm'
  }
  return output
}

const DrawInteraction = ({ drawOptions }) => {
  const selectedOption = useSelector(store => store.interaction)

  const map = useSelector(store => store.map)

  const [draw, setDraw] = useState(null)

  let measureTooltipElement

  let measureTooltip

  function createMeasureTooltip () {
    if (measureTooltipElement) {
      measureTooltipElement.parentNode.removeChild(measureTooltipElement)
    }
    measureTooltipElement = document.createElement('div')
    measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure'
    measureTooltip = new Overlay({
      element: measureTooltipElement,
      offset: [0, -15],
      positioning: 'bottom-center',
      stopEvent: false,
      insertFirst: false
    })
    map.addOverlay(measureTooltip)
  }

  useEffect(() => {
    if (!map) return

    const draw = new Draw(drawOptions)

    let sketch

    let listener

    createMeasureTooltip()

    draw.on('drawstart', function (evt) {
    // set sketch
      sketch = evt.feature

      let tooltipCoord = evt.coordinate

      listener = sketch.getGeometry().on('change', function (evt) {
        const geom = evt.target
        const output = formatLength(geom)
        tooltipCoord = geom.getLastCoordinate()
        measureTooltipElement.innerHTML = output
        measureTooltip.setPosition(tooltipCoord)
      })
    })

    draw.on('drawend', function () {
      measureTooltipElement.className = 'ol-tooltip ol-tooltip-static'
      measureTooltip.setOffset([0, -7])
      sketch.set('overlay', measureTooltip)
      // unset sketch
      sketch = null
      measureTooltipElement = null
      createMeasureTooltip()
      // unset tooltip so that a new one can be created
      unByKey(listener)
    })

    setDraw(draw)

    return () => {
      map.removeInteraction(draw)
    }
  }, [map])

  useEffect(() => {
    if (!map) return

    if (selectedOption === availableStates.measurement) {
      map.addInteraction(draw)
    } else {
      map.removeInteraction(draw)
    }
  }, [selectedOption])

  return null
}

export default DrawInteraction
