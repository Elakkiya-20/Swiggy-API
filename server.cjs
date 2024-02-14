const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')

const {Restaurant, Users} = require('./schema.cjs')

const app = express()
app.use(bodyParser.json())

async function connectToDb() {
    try {
        await mongoose.connect('mongodb+srv://melakkiya799:Elakkiya20@cluster0.l5eq2as.mongodb.net/Swiggy?retryWrites=true&w=majority')
        console.log('DB connection established ;)')
        const port =process.env.PORT || 8000
        app.listen(port, function() {
            console.log(`Listening on port ${port}...`)
        })
    } catch(error) {
        console.log(error)
        console.log('Couldn\'t establish connection :(')
    }
}
connectToDb()

/**
 * /add-restaurant : post
 * /get-restaurant-details : get
 * /create-new-user : post
 * /validate-user : post
 */

app.post('/add-restaurant', async function(request, response) {
    try {
        await Restaurant.create({
            "areaName" : request.body.areaName,
            "avgRating" : request.body.avgRating,
            "costForTwo" : request.body.costForTwo,
            "cuisines" : request.body.cuisines,
            "imageLink":request.body.imageLink,
            "name" : request.body.name
        })
        response.status(201).json({
            "status" : "success",
            "message" : "restaurant entry successful"
        })
    } catch(error) {
        response.status(500).json({
            "status" : "failure",
            "message" : "restaurant entry unsuccessful",
            "error" : error
        })
    }
})

app.get('/get-restaurant-details', async function(request, response) {
    try {
        const restaurantDetails = await Restaurant.find()
        response.status(200).json(restaurantDetails)
    } catch(error) {
        response.status(500).json({
            "status" : "failure",
            "message" : "could not fetch",
            "error" : error
        })
    }
})

app.delete('/delete-restaurant-detail/:id', async function(request, response) {
    try {
        const restaurant = await Restaurant.findByIdAndDelete(request.params.id)
        if (restaurant) {
            await Restaurant.findByIdAndDelete(request.params.id)
            response.status(200).json({
                "status": "success",
                "message": "deleted successfully"
            })
        } else {
            response.status(404).json({
                "status": "failure",
                "message":"entry not found"
            })
        }

    } catch (error) {
        response.status(500).json({
            "status": "failure",
            "message": "couldnot fetch details",
            "error": error
        })
    }
})

app.post('/create-new-user', async function(request, response) {
    try {
         await Users.create({
             "userName" : request.body.userName,
             "email" : request.body.email,
             "password" : request.body.password,
             "contact" : request.body.contact
         })
         response.status(201).json({
         "status" : "success",
         "message" : "user created"
         })
    } catch(error) {
         response.status(500).json({
             "status" : "failure",
             "message" : "internal server error"
         })
    }
 })
 
 app.post('/validate-user', async function(request, response) {
     try {
         const user = await Users.findOne({
             "email" : request.body.email,
             "password" : request.body.password 
         })
         if(user) {
             response.status(200).json({
                 "message" : "valid user"
             })
         } else {
             response.status(401).json({
                 "message" : "invalid user"
             })
         }
     } catch(error) {
         response.status(500).json({
             "message" : "internal server error"
         })
     }
 })