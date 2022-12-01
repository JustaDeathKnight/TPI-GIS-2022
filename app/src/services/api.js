import axios from 'axios'
import { VITE_API_URL } from '../vite-env.d'

export const getIntersectedFeatures = async (layers, coords) => {
  const response = await axios.post(`${VITE_API_URL}/intersect`, {
    layers,
    coords
  })
  return response.data
}

export const postMarker = async (marker) => {
  const response = await axios.post(`${VITE_API_URL}/addMarker`, marker)
  return response.data
}

export const getMarkers = async () => {
  const response = await axios.get(`${VITE_API_URL}/markers`)
  return response.data
}

export const removeMarkers = async (coords) => {
  const response = await axios.post(`${VITE_API_URL}/removeMarkers`, { coords })
  return response.data
}
