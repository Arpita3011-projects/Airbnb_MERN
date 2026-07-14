const express = require("express");
const router = express.Router();

console.log("me.js loaded");

router.get("/me", (req, res) => {
    console.log("GET /me route executed");
    return res.status(200).json({
        success: true,
        user: req.user || null,
    });
});

module.exports = router;