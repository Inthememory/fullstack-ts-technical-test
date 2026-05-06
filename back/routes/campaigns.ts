import Router from 'express'
import { createCampaign, listCampaigns } from '../controllers/campaigns'

const campaigns = Router()

campaigns.get('/', listCampaigns)
campaigns.post('/', createCampaign)

export default campaigns
