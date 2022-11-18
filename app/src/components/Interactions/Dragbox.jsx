
import MapContext from '../Map/MapContext'
import { useContext, useEffect, useReducer, useState } from 'react'
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
    console.log(interactionCoordinates, visibleLayers)
    getIntersectedFeatures(visibleLayers, interactionCoordinates).then((response) => {
      dispatch({ type: 'SET_CONSULT_LAYER', payload: response })
    })
  }

  const getPointCoordinates = (evt) => {
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

    dragBox.on('boxend', getBoxCoordinates)

    setDragBox(dragBox)

    return () => map.removeInteraction(dragBox)
  }, [map])

  useEffect(() => {
    if (!map) return

    if (selectedOption === availableStates.consultation) {
      map.addInteraction(dragBox)
      map.on('click', getPointCoordinates)
    } else {
      map.removeInteraction(dragBox)
      map.un('click', getPointCoordinates)
    }
  }, [selectedOption])

  return null
}

export default DragBoxInteraction
