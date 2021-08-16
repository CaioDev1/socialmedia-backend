const route = require('express').Router()
const yup = require('yup')
const mongoose = require('mongoose')
const mongoTimestampFormat = require('../utils/mongoTimestampFormat')

const postCollection = require('../database/postModel')
const usersCollection = require('../database/userModel')

/* PEGAR POST ÚNICO */
module.exports = function(io) {
    route.get('/getpost/:postid', (req, res, next) => {
        const postid = req.params.postid
    
        let schema = yup.string().test('ObjectId', 'this is not a valid database ID', value => {
            return mongoose.isValidObjectId(value)
        })
    
        schema.validate(postid).then(() => {
            postCollection.findById({_id: mongoose.Types.ObjectId(postid)}).then(post => {
                if(post) {
                    res.send({
                        username: post.username,
                        photo: post.photo,
                        content: post.content,
                        _id: post._id,
                        userId: post.userId,
                        comments: post.comments,
                        timestamp: mongoTimestampFormat.toDateAndTime(post.timestamp)
                    })
                } else {
                    res.status(404).send({
                        message: 'Post not found.'
                    })
                }
            })
        }).catch(err => next(err))
    })
    
    route.patch('/addcomment', (req, res, next) => {
        const {postid, content, db_user_id} = req.body
    
        let schema = yup.object().shape({
            postid: yup.string().test('ObjectId', 'this is not a valid database ID', value => {
                return mongoose.isValidObjectId(value)
            }),
            db_user_id: yup.string().test('ObjectId', 'this is not a valid database ID', value => {
                return mongoose.isValidObjectId(value)
            }),
            content: yup.string().min(1).max(400).required()
        })
    
        schema.validate({
            postid,
            db_user_id,
            content
        }, {
            abortEarly: false
        }).then(() => {
            postCollection.updateOne({_id: mongoose.Types.ObjectId(postid)}, {$push: {comments: {
                userId: mongoose.Types.ObjectId(req.session.user.db_user_id),
                username: req.session.user.username,
                photo: req.session.user.photo,
                content
            }}}).then(() => {
                io.io.emit('newcomment')
                res.send({message: 'Comment added'})
            }).catch(err => next(err))
        }).catch(err => next(err))
    })

    return route
}