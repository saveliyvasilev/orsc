const express = require('express')
const router = express.Router()


router.post('/', (req, res) => {
    // Enqueue the optimization scenario
    console.log(req.body)

    res.status(201).json()
})

module.exports = router;
