const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();

const QuizService = require("../services/QuizService")

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, description, questions } = req.body
        if (!title || !description || !questions) return res.status(400)
        const quiz = await QuizService.createQuiz(title, description, req.user.userId)
        
        const questionsSaved = await QuizService.setQuestion(quiz.id, questions)

        return res.json({...quiz, questions: questionsSaved})
    } catch (e) {
        console.log(e)
    }
})

router.get('/:id', async (req, res) => {
    try{
        const id = Number(req.params.id)
        if (!id) return res.status(404)
        const quiz = await QuizService.getOneByQuizId(id)

        if (!quiz) return res.status(404)

        return res.status(200).json(quiz)

    } catch (e) {
        console.log(e)
    }
})

router.get('/user/:id', async (req, res) => {
    try{
        const id = Number(req.params.id)
        if (!id) return res.status(404)
        const quiz = await QuizService.getAllByUserId(id)

        if (!quiz) return res.status(404)

        return res.status(200).json(quiz)

    } catch (e) {
        console.log(e)
    }
})

router.get('/get/all', async (req, res) => {
    try{
        
        const quiz = await QuizService.getAll()

        if (quiz?.status===404) return res.status(404)

        return res.status(200).json(quiz)

    } catch (e) {
        console.log(e)
    }
})

module.exports = router