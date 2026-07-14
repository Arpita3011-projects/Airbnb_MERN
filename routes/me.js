const express = require("express");
const router = express.Router();

router.get("/me", (req, res) => {
    return res.status(200).json({
        success: true,
        user: req.user || null,
    });
});


module.exports = router;