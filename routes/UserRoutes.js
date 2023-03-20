const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();

const UserService = require("../services/UserService")

router.get('/', authMiddleware, async (req, res) => {
    try {
        const id = Number(req.user.userId)
        if (!id) return res.status(404).json({message: 'user is not exists'})

        const userProfile = await UserService.getProfileById(id)

        if (userProfile?.status===404) return res.status(404).json(userProfile.message)

        res.status(200).json(userProfile)
    } catch (e) {
        console.log(e)
    }

})

router.post('/signup', async function (req, res) {
    try {
        const {name, email, password} = req.body

        const user = await UserService.createUser(name, email, password)

        if (user?.status===401 || user?.status===404) res.status(user.status).json(user.message)
        else
            res.status(200).json(user)
    } catch (e) {
        console.log(e)
    }

})

router.post('/signin', async function (req, res) {
    try {
        const {name, password} = req.body

        const user = await UserService.loginUser(name, password)

        res.status(200).json(user)
    } catch (e) {
        console.log(e)
    }

})

module.exports = router