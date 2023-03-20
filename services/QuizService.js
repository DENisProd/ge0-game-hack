const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const QuestionService = require('./QuestionService')

async function createQuiz(title, description, authorId, questions) {

    const quiz = await prisma.quiz.create({
        data: {
            title,
            description,
            author: {connect: {id: Number(authorId)}}
        }
    })

    return quiz
}

async function setQuestion(id, questions) {
    let ques = []
    
    for (let i = 0; i < questions.length; i++) {
        const element = await QuestionService.createQuestion(
            questions[i].text,
            questions[i].answer,
            Number(questions[i].lat),
            Number(questions[i].lon),
            id
        )
        ques.push(element.id)
    }

    const result = await prisma.question.findMany({
        where: {
            quizId: id
        }
    })

    return result
}

async function getOneByQuizId(id) {
    const quiz = await prisma.quiz.findUnique({
        where: {
            id
        }
    })

    const questions = await getQuestionsByQuizId(quiz.id)
    const filtered = questions.map(({answer, ...fields}) => fields)

    return ({...quiz, questions: filtered})
}

async function getAllByUserId(id) {
    const quiz = await prisma.quiz.findMany({
        where: {
            authorId: id
        }
    })

    let quizes = []

    for (let i = 0; i < quiz.length; i++) {
        const elem = await getOneByQuizId(quiz[i].id)
        quizes.push(elem)
    }

    return quizes
}

async function getAll() {
    const quiz = await prisma.quiz.findMany({
        // Почему true не рабоатет?
        where: {
            isPublic: false
        }
    })

    if (quiz.length===0) return {status: 404}

    let quizes = []

    for (let i = 0; i < quiz.length; i++) {
        const elem = await getOneByQuizId(quiz[i].id)
        quizes.push(elem)
    }

    return quizes
}

async function getQuestionsByQuizId(quizId) {
    const questions = await prisma.question.findMany({
        where: {
            quizId
        }
    })

    return questions
}

module.exports = {
    createQuiz,
    setQuestion,
    getOneByQuizId,
    getQuestionsByQuizId,
    getAllByUserId,
    getAll
}