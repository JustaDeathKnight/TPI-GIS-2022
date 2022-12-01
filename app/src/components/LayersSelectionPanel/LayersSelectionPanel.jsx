import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TOGGLE_LAYER } from '../../reducers/layersReducer'

const LayersSelectionPanel = () => {
  const availableLayers = useSelector(store => store.layers)

  const [filterLayers, setFilterLayers] = useState([...availableLayers])

  const [filter, setFilter] = useState('')

  const dispatch = useDispatch()

  useEffect(() => {
    const filteredLayers = availableLayers.filter(layer => layer.name.toLowerCase().includes(filter.toLowerCase()))
    setFilterLayers(filteredLayers)
  }, [availableLayers, filter])

  const handleFilter = (e) => {
    setFilter(e.currentTarget.value)
  }

  return (
    <div className='flex flex-col bg-gray-500 p-3 rounded-md sm:h-auto h-full text-white'>
      <h6 className='mb-3 bg-slate-600 rounded-md p-2'>
        Capas disponibles:
      </h6>
      <input placeholder='Busca una capa...' className='mb-2 rounded-md px-2 py-1' onChange={handleFilter} />
      <div className=' overflow-auto sm:h-60 h-40'>
        {filterLayers?.map((layer) => (
          <div key={layer.name}>
            <input
              className='form-checkbox h-5 w-5 text-blue-600 accent-slate-800 cursor-pointer'
              type='checkbox'
              checked={layer.visible}
              onChange={(event) => dispatch({ type: TOGGLE_LAYER, name: layer.name })}
            />{' '}
            {layer.name}
          </div>))}
      </div>
    </div>
  )
}

export default LayersSelectionPanel
