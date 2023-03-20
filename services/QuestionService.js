const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

async function createQuestion(text, answer, lat, lon, quizId) {
    const quiz = await prisma.question.create({
        data: {
            text,
            answer,
            lat,
            lon,
            quiz: {connect: {id: Number(quizId)}}
        }
    })

    return quiz
}

module.exports = {
    createQuestion
}