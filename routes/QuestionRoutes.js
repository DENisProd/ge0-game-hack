const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();

const QuestionServise = require("../services/QuestionService")

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, description } = req.body
        const quiz = await QuestionServise.createQuestion()

        return res.json(quiz)
    } catch (e) {
        console.log(e)
    }
})

module.exports = router