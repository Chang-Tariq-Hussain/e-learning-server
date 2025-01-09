const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const lessonRoutes = require('./routes/lessonRoutes')
const { baseUrl } = require('./utils/constant');
const verifyToken = require('./middleware/auth');
require('./config/db')

const app = express();

app.use(express.json())
app.use(cors());

app.use(`/api/auth`, authRoutes)
app.use(`/api/courses`,verifyToken, courseRoutes);
app.use('/api/lessons',verifyToken, lessonRoutes);

app.get('/', (req, res) => {
    res.redirect('/api/')
})

const Port = process.env.PORT;
app.listen(Port, () => console.log(`Server is listening on ${Port}`))