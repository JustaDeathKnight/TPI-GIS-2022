import React, { useContext, useEffect, useState } from 'react'
import { FullScreen } from 'ol/control'
import MapContext from '../Map/MapContext'
import { useSelector } from 'react-redux'

const FullScreenControl = () => {
  const map = useSelector(store => store.map)

  useEffect(() => {
    if (!map) return

    const fullScreenControl = new FullScreen({})

    map.controls.push(fullScreenControl)

    return () => map.controls.remove(fullScreenControl)
  }, [map])

  return null
}

export default FullScreenControl
