
import MapContext from '../Map/MapContext'
import { useContext, useEffect, useReducer, useState, useMemo } from 'react'
import { DragBox } from 'ol/interaction'
import { Style, Icon, Stroke } from 'ol/style'
import { always } from 'ol/events/condition'
import { availableStates, interactionReducer } from '../../reducers/interactionReducer'
import { useDispatch, useSelector } from 'react-redux'
import { getIntersectedFeatures } from '../../services/api'

const DragBoxInteraction = ({ dragBoxOptions, onBoxend }) => {
  const selectedOption = useSelector(store => store.interaction)

  const visibleLayers = useSelector(store => store.layers.filter(layer => layer.visible))

  const { map } = useContext(MapContext)

  const [dragBox, setDragBox] = useState(null)

  const dispatch = useDispatch()

  const handleIntersectedFeatures = (interactionCoordinates) => {
    getIntersectedFeatures(visibleLayers, interactionCoordinates).then((response) => {
      console.log(response)
      dispatch({ type: 'SET_CONSULT_LAYER', payload: response })
    })
  }

  const getPointCoordinates = function (evt) {
    const interactionCoordinates = evt.coordinate
    handleIntersectedFeatures(interactionCoordinates)
  }

  const getBoxCoordinates = (evt) => {
    const interactionCoordinates = evt.target.getGeometry().getCoordinates()
    handleIntersectedFeatures(interactionCoordinates)
  }

  useEffect(() => {
    if (!map) return

    const dragBox = new DragBox({
      className: 'bg-red-500 opacity-50',
      condition: always
    })

    setDragBox(dragBox)

    return () => {
      map.removeInteraction(dragBox)
    }
  }, [map])

  useEffect(() => {
    if (visibleLayers.length <= 0) return
    dragBox.on('boxend', getBoxCoordinates)
    if (selectedOption === availableStates.consultation) {
      map.addInteraction(dragBox)
      map.on('click', getPointCoordinates)
    } else {
      map.removeInteraction(dragBox)
      map.un('click', getPointCoordinates)
    }
    return () => {
      dragBox.un('boxend', getBoxCoordinates)
      map.un('click', getPointCoordinates)
    }
  }, [visibleLayers])

  return null
}

export default DragBoxInteraction
