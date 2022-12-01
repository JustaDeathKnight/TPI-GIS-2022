import MapContext from '../Map/MapContext'
import { useContext, useEffect, useState, useRef } from 'react'
import { availableStates } from '../../reducers/interactionReducer'
import { useSelector } from 'react-redux'
import { Feature, Overlay } from 'ol'
import { Point } from 'ol/geom'
import { Icon, Style } from 'ol/style'
import { postMarker } from '../../services/api'
import GeoJSON from 'ol/format/GeoJSON'

const AddMarkerInteraction = ({ markersLayerSource }) => {
  const selectedOption = useSelector(store => store.interaction)

  const map = useSelector(store => store.map)

  const popUpRef = useRef(null)

  const [isShown, setIsShown] = useState(false)

  const addMarker = (evt) => {
    if (isShown) return

    const iconStyle = new Style({
      image: new Icon({
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        displacement: [0, 13],
        src: 'https://cdn2.iconfinder.com/data/icons/social-media-and-payment/64/-47-32.png'
      })
    })
    const feature = new Feature({
      geometry: new Point(evt.coordinate)
    })
    feature.setStyle(iconStyle)
    const overlay = new Overlay({
      position: evt.coordinate,
      element: popUpRef.current
    })
    map.addOverlay(overlay)
    markersLayerSource.addFeature(feature)
    setIsShown(() => true)
  }

  const handleRemoveMarker = () => {
    setIsShown(() => false)
    const feature = markersLayerSource.getFeatures().reverse()[0]
    markersLayerSource.removeFeature(feature)
  }

  const handleSubmit = async (evt) => {
    const form = evt.target
    try {
      evt.preventDefault()
      const name = form.name.value
      const description = form.description.value
      const feature = markersLayerSource.getFeatures().reverse()[0]
      const div = document.createElement('div')
      div.className = 'p-2 bg-gray-100 rounded-md shadow-md'
      div.innerHTML = `
      <h3>Nombre: ${name}</h3>
      <p>Descripcion: ${description}</p>`
      const overlay = new Overlay({
        offset: [0, -30],
        positioning: 'bottom-center',
        position: feature.getGeometry().getCoordinates(),
        element: div
      })
      map.addOverlay(overlay)
      feature.setProperties({ name, description })
      const format = new GeoJSON()
      const geojson = format.writeFeatureObject(feature)
      const response = await postMarker(geojson)
      feature.setProperties({ overlay })
      console.log(response)
    } catch (error) {
      console.log(error)
    } finally {
      form.reset()
      setIsShown(() => false)
    }
  }

  useEffect(() => {
    if (!map) return

    if (selectedOption === availableStates.addMarker) {
      map.on('click', addMarker)
    } else {
      map.un('click', addMarker)
    }
    return () => {
      map.un('click', addMarker)
    }
  }, [selectedOption, isShown])

  return (
    <form ref={popUpRef} onSubmit={handleSubmit}>
      {isShown && (
        <div className='bg-gray-500 p-5 rounded-lg gap-3 flex flex-col'>
          <div className='flex flex-col gap-2'>
            <label className='bg-slate-600 rounded-md p-2' htmlFor='name'>Nombre</label>
            <input className=' p-2 rounded-md' type='text' name='name' required />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='bg-slate-600 rounded-md p-2' htmlFor='description'>Descripción</label>
            <input className=' p-2 rounded-md' type='text' name='description' required />
          </div>
          <button className='bg-slate-600 rounded-md p-2' type='submit'>Guardar</button>
          <button className='bg-white rounded-full py-2.5 absolute -top-5 -right-4 text-xs' type='button' onClick={handleRemoveMarker}>x</button>
        </div>
      )}
    </form>
  )
}

export default AddMarkerInteraction
