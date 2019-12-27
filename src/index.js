// save --dev is used to install node modules for development env and not for deployment.


const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

//this must be above other app.use's
// app.use((req, res, next)=>{



// })

//site under maintenance through middleware
// app.use((req, res, next)=>{
//     res.status(503).send('Seite is currently down. Check back later')
// })

//accept json data from client
app.use(express.json())

app.use(userRouter)
app.use(taskRouter)

//
// Without middleware:   new request -> run route handler
//
// With middleware:    new request -> run route handler
//

app.listen(port, ()=>{
    console.log('Server on port ', port)
})

