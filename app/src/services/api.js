import axios from 'axios'
import { VITE_API_URL } from '../vite-env.d'

export const getIntersectedFeatures = async (layers, coords) => {
  const response = await axios.post(`${VITE_API_URL}/intersect`, {
    layers,
    coords
  })
  return response.data
}
