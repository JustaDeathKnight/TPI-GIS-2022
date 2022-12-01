import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CLEAR_CONSULT_LAYER } from '../../reducers/consultLayerReducer'
import { SET_INTERACTION_OPTION } from '../../reducers/interactionReducer'
import { CLEAR_ALL_LAYERS } from '../../reducers/layersReducer'

const InteractionsPanel = ({ measureLayerSource, consultLayerSource }) => {
  const map = useSelector(store => store.map)

  const selectedOption = useSelector(store => store.interaction)

  const dispatch = useDispatch()

  const [isShowTooltip, setIsShowTooltip] = useState({
    navigation: false,
    consultation: false,
    measurement: false,
    addMarker: false,
    removeMarker: false,
    clear: false
  })

  const handleChangeInteraction = (e) => {
    const { name } = e.currentTarget
    dispatch({ type: SET_INTERACTION_OPTION, payload: name })
  }

  const onMouseEnter = (e) => {
    const { name } = e.currentTarget
    setIsShowTooltip((prevState) => ({
      ...prevState,
      [name]: true
    }))
  }

  const onMouseLeave = (e) => {
    const { name } = e.currentTarget
    setIsShowTooltip((prevState) => ({
      ...prevState,
      [name]: false
    }))
  }

  const handleReset = () => {
    measureLayerSource.getFeatures().forEach(feature => map.removeOverlay(feature.get('overlay')))
    consultLayerSource.clear()
    measureLayerSource.clear()
    dispatch({ type: CLEAR_CONSULT_LAYER })
    dispatch({ type: CLEAR_ALL_LAYERS })
  }

  return (
    <div className='bg-gray-500 p-1 flex sm:flex-col flex-row sm:justify-start justify-center'>
      <div className='min-w-max flex sm:flex-col flex-row gap-2 bg-slate-600 rounded-md p-2 text-xs'>
        <button name='navigation' className={(selectedOption === 'navigation') ? 'relative bg-slate-300 sm:p-3 p-2 rounded-md' : 'relative sm:p-3 p-2 rounded-md'} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleChangeInteraction}>
          <img className='h-6' src='https://cdn-icons-png.flaticon.com/512/1828/1828166.png ' />
          <div className={isShowTooltip.navigation ? 'absolute bg-gray-300 opacity-90 rounded-md p-2 sm:top-0 sm:-right-16 z-50' : 'hidden'}>
            <p>Navegar</p>
          </div>
        </button>
        <button name='consultation' className={(selectedOption === 'consultation') ? 'relative bg-slate-300 sm:p-3 p-2 rounded-md' : 'relative sm:p-3 p-2 rounded-md'} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleChangeInteraction}>
          <img className='h-6' src='https://cdn-icons-png.flaticon.com/512/103/103091.png ' />
          <div className={isShowTooltip.consultation ? 'absolute bg-gray-300 opacity-90 rounded-md p-2 sm:top-0 sm:-right-16 z-50' : 'hidden'}>
            <p>Consultar</p>
          </div>
        </button>
        <button name='measurement' className={(selectedOption === 'measurement') ? 'relative bg-slate-300 sm:p-3 p-2 rounded-md' : 'relative sm:p-3 p-2 rounded-md'} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleChangeInteraction}>
          <img className='h-6' src='https://cdn-icons-png.flaticon.com/128/570/570968.png' />
          <div className={isShowTooltip.measurement ? 'absolute whitespace-nowrap bg-gray-300 opacity-90 rounded-md p-2 sm:top-0 sm:-right-20 z-50' : 'hidden'}>
            <p>Medir Distancias</p>
          </div>
        </button>
        <button name='addMarker' className={(selectedOption === 'addMarker') ? 'relative bg-slate-300 sm:p-3 p-2 rounded-md' : 'relative sm:p-3 p-2 rounded-md'} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleChangeInteraction}>
          <img className='h-6' src='https://cdn-icons-png.flaticon.com/512/5055/5055641.png' />
          <div className={isShowTooltip.addMarker ? 'absolute whitespace-nowrap bg-gray-300 opacity-90 rounded-md p-2 sm:top-0 sm:-right-24 z-50' : 'hidden'}>
            <p>Añadir Marcador</p>
          </div>
        </button>
        <button name='removeMarker' className={(selectedOption === 'removeMarker') ? 'relative bg-slate-300 sm:p-3 p-2 rounded-md' : 'relative sm:p-3 p-2 rounded-md'} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleChangeInteraction}>
          <img className='h-6' src='   https://cdn-icons-png.flaticon.com/512/5055/5055644.png ' />
          <div className={isShowTooltip.removeMarker ? 'absolute whitespace-nowrap bg-gray-300 opacity-90 rounded-md p-2 sm:top-0 sm:-right-32 z-50' : 'hidden'}>
            <p>Eliminar Marcadores</p>
          </div>
        </button>
        <button name='clear' className='relative sm:p-3 p-2 rounded-md' onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleReset}>
          <img className='h-6' src='https://cdn-icons-png.flaticon.com/512/1198/1198941.png' />
          <div className={isShowTooltip.clear ? 'absolute bg-gray-300 opacity-90 rounded-md p-2 sm:top-0 sm:-right-16 z-50' : 'hidden'}>
            <p>Limpiar</p>
          </div>
        </button>
      </div>
    </div>
  )
}

export default InteractionsPanel
