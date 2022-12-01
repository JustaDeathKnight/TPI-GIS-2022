import React, { useContext, useEffect, useState } from 'react'
import { FullScreen, ScaleLine } from 'ol/control'
import { useSelector } from 'react-redux'

const ScaleControl = () => {
  const map = useSelector(store => store.map)

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
