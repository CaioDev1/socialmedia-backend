const route = require('express').Router()
const yup = require('yup')
const mongoose = require('mongoose')
const mongoTimestampFormat = require('../utils/mongoTimestampFormat')

const postCollection = require('../database/postModel')

route.get('/userposts', (req, res, next) => {
    const {db_user_id} = req.query
    const from = Number(req.query.from)
    const to = Number(req.query.to)

    let schema = yup.object().shape({
        db_user_id: yup.string().test('ObjectId', 'this is not a valid database ID', value => {
            return mongoose.isValidObjectId(value)
        }).required(),
        from: yup.number().integer().min(0).required(),
        to: yup.number().integer().positive().required()
    })

    schema.validate({
        db_user_id,
        from,
        to
    }).then(() => {
        postCollection.find({userId: mongoose.Types.ObjectId(db_user_id)}, {
            like: false,
            love: false,
            comments: false
        }).skip(from).limit(to).then(doc => {
            if(doc) {
                doc = doc.map(post => {
                    return {
                        username: post.username,
                        photo: post.photo,
                        content: post.content,
                        _id: post._id,
                        userId: post.userId,
                        date: mongoTimestampFormat.toDate(post.timestamp)
                    }
                })
    
                postCollection.estimatedDocumentCount().then(value => {
                    res.send({posts: doc, allPostsLength: value})
                })
            } else {
                res.status(404).send({
                    message: 'Posts not found.'
                })
            }
        }) 
    }).catch(err => next(err))
})

module.exports = route