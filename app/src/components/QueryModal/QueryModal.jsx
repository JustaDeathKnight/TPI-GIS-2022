import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import ReactDOM from 'react-dom'

const QueryModal = ({ showModal, setShowModal }) => {
  const consultLayer = useSelector(state => state.consultLayer)

  console.log(consultLayer)

  return (
    <>
      {(showModal && Object?.entries(consultLayer)?.length > 0 && Object.entries(consultLayer)[0][1]?.features?.length > 0) &&
        <ReactPortal wrapperId='modal'>
          <div className=' p-10 rounded-lg gap-3 flex justify-center items-center absolute w-screen h-screen max-h-screen z-50 bg-slate-800 opacity-90'>
            <div className='bg-gray-500 max-w-screen-2xl max-h-full p-5 rounded-lg relative shadow-md shadow-slate-500'>
              <h6 className='bg-slate-600 rounded-md p-2 mb-2 text-white text-2xl'>
                Consulta de capas:
              </h6>
              <div className=' sm:max-w-max max-w-[280px] max-h-[80vh] overflow-auto gap-4'>
                {Object?.entries(consultLayer)?.map(([layer, { features }]) => (
                  <React.Fragment key={layer}>
                    {features.length > 0 && <h6 className='bg-slate-800 rounded-md p-2 mb-2 text-white text-xl w-full'>{layer}</h6>}
                    <table className='table-auto text-center border-spacing-6 w-full'>
                      {features?.map(({ type, geometry, properties }, index) => (
                        <React.Fragment key={index}>
                          {(index === 0) &&
                            <thead className=' bg-slate-800 text-white' key={type + index}>
                              <tr className='py-2'>
                                {Object?.entries(properties)?.map(([key, property]) => (
                                  <th className='py-2' key={key}>
                                    {key}
                                  </th>
                                ))}
                              </tr>
                            </thead>}
                          <tbody className='text-slate-900'>
                            {Object?.entries(properties)?.map(([key, property]) => (
                              <td key={key}>
                                {property}
                              </td>
                            ))}
                          </tbody>
                        </React.Fragment>
                      ))}
                    </table>
                  </React.Fragment>
                ))}
              </div>
              <button onClick={() => { setShowModal(false) }} className=' bg-white rounded-full py-3 px-5 text-md absolute -top-5 -right-5'>x</button>
            </div>
          </div>
        </ReactPortal>}
    </>
  )
}

function ReactPortal ({ children, wrapperId }) {
  const wrapper = document.getElementById(wrapperId)
  document.className = 'absolute top-0 left-0 w-screen h-screen'
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])
  return ReactDOM.createPortal(children, wrapper)
}

export default QueryModal
