const route = require('express').Router()
const mongoose = require('mongoose')
const postCollection = require('../database/postModel')
const usersCollection = require('../database/userModel')
const mongoTimestampFormat = require('../utils/mongoTimestampFormat')

const yup = require('yup')

module.exports = function(io) {
    /* ADICIONAR NOVO POST NO BANCO DE DADOS */
    route.post('/posts', (req, res, next) => {
        let {content} = req.body

        let schema = yup.object().shape({
            content: yup.string().min(1).max(400).required(),
        })

        schema.validate({
            content
        }, {
            abortEarly: false
        }).then(() => {
            const newPost = new postCollection({
                userId: mongoose.Types.ObjectId(req.session.user.db_user_id),
                photo: req.session.user.photo,
                username: req.session.user.username,
                content,
            })
            
            newPost.save().then(() => {
                io.io.emit('newpost')
                res.send({message: 'Post sent successfully.'})
            }).catch(err => next(err))
        }).catch(err => next(err))
    })


    /* ENVIAR OS POSTS */
    route.get('/posts', function(req, res, next) {
        const from = Number(req.query.from)
        const to = Number(req.query.to)

        let schema = yup.object().shape({
            from: yup.number().integer().min(0).required(),
            to: yup.number().integer().positive().required()
        })

        schema.validate({
            from,
            to
        }, {
            abortEarly: false
        }).then(() => {
            postCollection.find({}, {
                username: true,
                photo: true,
                content: true,
                userId: true,
                timestamp: true
            }).sort({_id: -1}).skip(from).limit(10).then(doc => {
                if(doc) {
                    doc = doc.map(post => {
                        return {
                            username: post.username,
                            photo: post.photo,
                            content: post.content,
                            _id: post._id,
                            userId: post.userId,
                            timestamp: mongoTimestampFormat.toDateAndTime(post.timestamp)
                        }
                    })
                    
                    postCollection.estimatedDocumentCount().then(allPostsLength => {
                        res.send({posts: doc, allPostsLength})
                    }).catch(err => next(err))
                } else {
                    res.status(404).send({
                        message: 'Post not found.'
                    })
                }
            })
        }).catch(err => next(err))
    }) 

    /* RETORNA O NÚMERO DE LIKES DE CADA POST E OS LIKES JÁ DADOS PELO USUÁRIO */
    route.get('/post-buttons', (req, res, next) => {
        const {postid, db_user_id} = req.query

        let schema = yup.object().shape({
            postid: yup.string().test('ObjectId', 'this is not a valid database ID', value => {
                return mongoose.isValidObjectId(value)
            }),
            db_user_id: yup.string().test('ObjectId', 'this is not a valid database ID', value => {
                return mongoose.isValidObjectId(value)
            })
        })

        schema.validate({
            postid,
            db_user_id
        }, {
            abortEarly: false
        }).then(() => {
            // FAZER COM QUE RETORNE O ARRAY ESPECIFICO DO REACTEDPOSTS
            usersCollection.findById({_id: mongoose.Types.ObjectId(db_user_id)}, {
                reactedPosts: {
                    $elemMatch: {
                        postId: mongoose.Types.ObjectId(postid)
                    }
                }
            }).then(userDoc => {
                postCollection.aggregate()
                .match({_id: mongoose.Types.ObjectId(postid)})
                .project({
                    like: true,
                    love: true,
                    comments: {$size:"$comments"}
                }).exec(function(err, doc) {
                    err && next(err)

                    if(doc) {
                        doc = doc[0]
                        let reactionSaved = {}

                        if(userDoc.reactedPosts.length) reactionSaved = userDoc.reactedPosts[0]

                        res.send({
                            like: {
                                value: doc.like,
                                isClicked: reactionSaved.like ? reactionSaved.like : false
                            },
                            love: {
                                value: doc.love,
                                isClicked: reactionSaved.love ? reactionSaved.love : false
                            },
                            comments: doc.comments,
                        })
                    }
                })
            }).catch(err => next(err))
        }).catch(err => next(err))
    })


    /* ATUALIZAR VALORES DE LIKE, LOVE, E COMMENTS */
    route.patch('/post-buttons', (req, res, next) => {
        const {iconName, postid, isButtonClicked, db_user_id} = req.body

        let schema = yup.object().shape({
            iconName: yup.string().equals(['like', 'love']).required(),
            postid: yup.string().test('ObjectId', 'this is not a valid database ID', value => {
                return mongoose.isValidObjectId(value)
            }),
            isButtonClicked: yup.bool().strict(true).required(),
            db_user_id: yup.string().test('ObjectId', 'this is not a valid database ID', value => {
                return mongoose.isValidObjectId(value)
            })
        })

        schema.validate({
            iconName,
            postid,
            isButtonClicked,
            db_user_id
        }, {
            abortEarly: false
        }).then(() => {
            postCollection.updateOne({_id: mongoose.Types.ObjectId(postid)}, {$inc: {[iconName]: isButtonClicked ? 1 : -1}}, err => {err && next(err)})
        
            usersCollection.findOneAndUpdate({
                _id: mongoose.Types.ObjectId(db_user_id), 
                'reactedPosts.postId': mongoose.Types.ObjectId(postid)
            }, {
                $set: {[`reactedPosts.$.${iconName}`]: isButtonClicked}
            }, {
                new: true
            }).then(doc => {
                if(!doc) {
                    let pattern = {
                        like: false,
                        love: false,
                    }

                    usersCollection.updateOne({_id: mongoose.Types.ObjectId(db_user_id)}, {$push: {reactedPosts: {postId: mongoose.Types.ObjectId(postid), ...pattern, [iconName]: true}}}, err => {err && next(err)})
                } else {
                    for(let post of doc.reactedPosts) {
                        !post.like && !post.love && doc.updateOne({$pull: {reactedPosts: {postId: mongoose.Types.ObjectId(post.postId)}}}, err => {err && next(err)})
                    }
                }
                
                io.io.emit(postid)
                io.io.emit('topposts')
                res.send({message: 'Reaction sent successfully'}) 
            }).catch(err => next(err))
        }).catch(err => next(err))
    })


    return route
}