import Router from 'express'

const metrics = Router();
metrics.get('/snapshot', (req, res) => {
    res.send('TADA')
})

export default metrics;
