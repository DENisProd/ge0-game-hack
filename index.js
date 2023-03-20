const express = require("express")
const corsMiddleware = require("./middleware/cors.middleware")
var cors = require('cors');

const userRouter = require("./routes/UserRoutes.js")
const quizRouter = require("./routes/QuizRoutes.js")

const app = express()

app.use(cors());
app.options('*', cors());

app.use(express.json())
app.use("/api/user/", userRouter)
app.use("/api/quiz/", quizRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))