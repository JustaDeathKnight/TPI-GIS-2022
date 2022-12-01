import React, { useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SET_TARGET } from '../../reducers/mapReducer'

const Map = ({ children }) => {
  const mapRef = useRef()

  const map = useSelector(store => store.map)
  // on component mount
  useEffect(() => {
    map.setTarget(mapRef.current)

    return () => map.setTarget(undefined)
  }, [])

  return (
    <div ref={mapRef} id='ol-map' className='ol-map sm:min-w-[calc(100vw - 20vw)] sm:h-screen sm:w-full w-screen h-[60vh] min-h-[60vh]'>
      {children}
    </div>
  )
}

export default Map
