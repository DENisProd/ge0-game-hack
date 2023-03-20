const {PrismaClient} = require('@prisma/client')
const bcrypt = require("bcrypt");
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken')

async function createUser(name, email, password) {
    const userFromDb = await prisma.user.findMany({
        where: {
            OR: [
                {name},
                {email}
            ]
        }
    })

    if(userFromDb.length>0)
        return {message: 'User is already exists', status: 400}

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    })

    return user
}

async function loginUser(name, password) {
    const user = await prisma.user.findUnique({
        where: {
            name
        }
    })

    if (!user) {
        return {message: 'User not found', status: 404}
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
        return {message: 'Invalid password', status: 401}
    }

    const token = jwt.sign({userId: user.id }, process.env.SECRET)
    return {token, data: {id: user.id, role: user.role, name: user.name}}
}

async function getProfileById(id) {
    const user = await prisma.user.findUnique({
        where: {
            id
        }
    })

    if (!user) {
        return {message: 'User not found', status: 404}
    }

    const userProfile = {
        data: {id: user.id, role: user.role, name: user.name}
    }

    return userProfile
}

module.exports = {
    createUser,
    loginUser,
    getProfileById
}

//npx prisma init

//npx prisma db push
//npx prisma generate