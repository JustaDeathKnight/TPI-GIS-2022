import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { ImageWMS } from 'ol/source'

const Leyend = ({ url }) => {
  const [leyendSource, setLeyendSource] = useState('')

  const availableLayers = useSelector(store => store.layers)

  const visibleLayers = availableLayers.filter(layer => layer.visible)

  useEffect(() => {
    if (visibleLayers.length > 0) {
      const wmsSource = new ImageWMS({
        url: url + '&TRANSPARENT=TRUE&ITEMFONTCOLOR=0x213547',
        params: {
          LAYERS: visibleLayers.map(layer => layer.sourceName).join(','),
          FORMAT: 'image/png'
        }
      })
      setLeyendSource(wmsSource.getLegendUrl())
    } else {
      setLeyendSource('')
    }
  }, [visibleLayers])

  console.log(leyendSource)

  return (
    <>
      {leyendSource &&
        <div className='bg-gray-500 p-3 flex flex-col gap-2 rounded-lg text-white'>
          <h6 className='bg-slate-600 rounded-md p-2'>
            Leyenda:
          </h6>
          <img className='sm:max-h-[50vh]' src={leyendSource} />
        </div>}
    </>
  )
}

export default Leyend
