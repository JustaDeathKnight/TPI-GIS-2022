
import MapContext from '../Map/MapContext'
import { useContext, useEffect, useReducer, useState, useMemo } from 'react'
import { DragBox } from 'ol/interaction'
import { Style, Icon, Stroke } from 'ol/style'
import { always } from 'ol/events/condition'
import { availableStates, interactionReducer } from '../../reducers/interactionReducer'
import { useSelector } from 'react-redux'
import { removeMarkers } from '../../services/api'

const RemoveMarkerInteraction = ({ markersLayerSource }) => {
  const map = useSelector(store => store.map)

  const selectedOption = useSelector(store => store.interaction)

  const [dragBox, setDragBox] = useState(null)

  const handleIntersectedFeatures = async (evt) => {
    try {
      const interactionExtent = evt.target.getGeometry().getExtent()
      const interactionCoordinates = evt.target.getGeometry().getCoordinates()
      markersLayerSource.forEachFeatureIntersectingExtent(interactionExtent, (feature) => {
        markersLayerSource.removeFeature(feature)
        const overlay = feature.get('overlay')
        console.log(overlay)
        map.removeOverlay(overlay)
      })
      const response = await removeMarkers(interactionCoordinates)
      console.log(response)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (!map) return

    const dragBox = new DragBox({
      className: 'bg-red-500 opacity-50',
      condition: always
    })

    dragBox.on('boxend', handleIntersectedFeatures)

    if (selectedOption === availableStates.removeMarker) {
      map.addInteraction(dragBox)
    } else {
      map.removeInteraction(dragBox)
    }
    return () => {
      dragBox.un('boxend', handleIntersectedFeatures)
    }
  }, [selectedOption])

  return <></>
}

export default RemoveMarkerInteraction
