require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')


const doWork = async(id, task)=>{

    const user = await Task.findByIdAndDelete(id)
    if(!user){
        throw new Error('No user found')
        
    }

    const count = await Task.countDocuments({completed:task})
    return count

}

const _id = '5df7cdc56b29c6270436afbd'
const task_completed = false
doWork(_id, task_completed).then((count)=>{
    console.log(count)
}).catch((error)=>{
    console.log(error)
})