
import MapContext from '../Map/MapContext'
import { useContext, useEffect, useReducer, useState } from 'react'
import { DragBox } from 'ol/interaction'
import { Style, Icon, Stroke } from 'ol/style'
import { always } from 'ol/events/condition'
import { availableStates, interactionReducer } from '../../reducers/interactionReducer'
import { useSelector } from 'react-redux'

const getPointCoordinates = (evt) => {
  console.log(evt.coordinate)
}

const DragBoxInteraction = ({ dragBoxOptions, onBoxend }) => {
  const selectedOption = useSelector(store => store.interaction)

  const { map } = useContext(MapContext)

  const [dragBox, setDragBox] = useState(null)

  useEffect(() => {
    if (!map) return

    const dragBox = new DragBox({
      className: 'bg-red-500 opacity-50',
      condition: always
    })

    dragBox.on('boxend', onBoxend)

    setDragBox(dragBox)

    return () => map.removeInteraction(dragBox)
  }, [map])

  useEffect(() => {
    if (!map) return

    console.log(selectedOption)

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
