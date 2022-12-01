import React, { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'

const Map = ({ children }) => {
  const mapRef = useRef()

  const map = useSelector(store => store.map)

  useEffect(() => {
    map.setTarget(mapRef.current)

    return () => map.setTarget(undefined)
  }, [])

  return (
    <div ref={mapRef} id='ol-map' className='ol-map sm:min-w-[calc(100vw - 20vw)] sm:h-screen sm:w-full w-screen h-[50vh] min-h-[50vh]'>
      {children}
    </div>
  )
}

export default Map
