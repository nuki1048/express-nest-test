import axios, { type CreateAxiosDefaults } from 'axios'
import { errorCatch } from './error'

const options: CreateAxiosDefaults = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
}

export const axiosClassic = axios.create(options)

axiosClassic.interceptors.response.use(
  config => config,
  error => {
    throw errorCatch(error)
  }
)