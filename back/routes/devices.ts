import Router from 'express'
import { availableDevices } from '../controllers/devices'

const devices = Router()

devices.get('/available', availableDevices)

export default devices
