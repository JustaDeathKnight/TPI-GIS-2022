import React, { useContext, useEffect, useState } from 'react'
import { FullScreen, ScaleLine } from 'ol/control'
import MapContext from '../Map/MapContext'

const ScaleControl = () => {
  const { map } = useContext(MapContext)

  useEffect(() => {
    if (!map) return

    const scaleControl = new ScaleLine({
      units: 'metric',
      bar: true,
      steps: parseInt(4, 10),
      text: true,
      minWidth: 140
    })

    map.controls.push(scaleControl)

    return () => map.controls.remove(scaleControl)
  }, [map])

  return null
}

export default ScaleControl
