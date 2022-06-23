const { Router } = require('express');
const router = Router();
const pool = require('../database/database')

router.get("/correct/:message", (req, res) => {
    res.status(200).json({message: req.params.message})
})

router.get("/error/:message", (req, res) => {
    res.status(400).json({message: req.params.message})
})

router.get("/error", async (req, res) => {
    res.status(400).json({message: "request not found"})
})

module.exports = router;