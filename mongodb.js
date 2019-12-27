//crud create delete updaate delete

// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID
// or
const {MongoClient, ObjectID} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

//self generate id
// const id = new ObjectID()
// console.log(id.toHexString().length)
// console.log(id.id.length)
// console.log(id.getTimestamp())

  // {} matched any document
MongoClient.connect(connectionURL, { useNewUrlParser:true }, (error, client)=>{

    if(error){
        return console.log('Enable to conenct to database!')
    }

    const db = client.db(databaseName)

    // db.collection('users').deleteMany({
    //     age:27
    // }).then((result)=>{
    //     console.log(result.deletedCount)
    // }).catch((error)=>{
    //     console.log(error)
    // })       


//    db.collection('users').updateMany({
    // since i have not mentioned anything, it selectes everything
//     }, {
//         $unset:{  // read then update
//             agesadd:"",
//             ages:""
//         }
//     }).then((result)=>{
//         console.log(result.matchedCount)
//     }).catch((error)=>{
//         console.log(error)
//     })



    // db.collection('tasks').updateMany({
    //     completed:false
    // },{
    //     $set:{
    //         completed:true
    //     }
    // }).then((result)=>{
    //     console.log(result.matchedCount)
    // }).catch((error)=>{
    //     console.log(error)
    // })

    //if finding by id, then use like this new ObjectID("5df698ff50a4bb0d2c34dce1") since it is binary data(ObjectID)
    // db.collection('users').findOne({
    //     _id: new ObjectID("5df698ff50a4bb0d2c34dce1")
    // }, (error, user)=>{
    //     if(error){
    //         return console.log('Unale to fetch')
    //     }
    //     console.log(user)
    // })


    //find returns a cursor(pointer)
    // db.collection('users').find({
    //    age:27
    // }).toArray((error, users)=>{
    //     console.log(users)
    // })

    // db.collection('users').find({
    //     age:27
    //  }).count((error, count)=>{
    //      console.log(count)
    //  })

        // db.collection('users').insertOne({
        //     name:'noddy',
        //     age:27
        // }, (error, result)  => {
        //     if(error){
        //             return console.log('Unable to insert user')
        //     }
        //     console.log(result.ops)
        // })
        // db.collection('tasks').insertMany([
        //     {
        //         description:'Clean the house',
        //         completed:true
        //     },
        //     {
        //         description:'Renew inspection',
        //         completed:false
        //     },
        //     {
        //         description:'Pot Plants',
        //         completed:false
        //     }
        // ], (error, result)=>{

        //     if(error){
        //         return console.log('Unable to insert tasks!')
        //     }

        //     console.log(result.ops)

        // })
})



