import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useStateValue } from '../StateProvider'
import { Modal } from 'react-bootstrap'
import './ModalPost.css'
import moment from 'moment'
import { useHistory, useParams } from 'react-router-dom'

const ModalPost = () => {
    const [{ token, user }] = useStateValue()

    const history = useHistory()

    const { id } = useParams()

    const [titlePost, setTitlePost] = useState('')
    const [contentPost, setContentPost] = useState('')
    const [likesPost, setLikesPost] = useState([])
    const [tagsPost, setTagsPost] = useState([])
    const [isPostLiked, setIsPostLiked] = useState(false)
    const [comments, setComments] = useState([])
    const [form, setForm] = useState({
        comment: ''
    })
    const { comment } = form

    useEffect(() => {
        getComments()
    }, [])

    useEffect(() => {
        getPost()
    }, [])

    const headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }

    const getPost = async () => {
        await axios.get(`https://internal-app-dpm.herokuapp.com/post/${id}`, { headers })
            .then(resp => {
                setTitlePost(resp.data.post.title)
                setContentPost(resp.data.post.content)
                setLikesPost(resp.data.post.likes)
                setTagsPost(resp.data.post.tags)
                if (resp.data.post.likes.find(like => like._id === user._id)) {
                    setIsPostLiked(true)
                } else {
                    setIsPostLiked(false)
                }
            })
    }

    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (comment === "") return
        await axios.post(`https://internal-app-dpm.herokuapp.com/post/${id}`,
            {
                "content": `${comment}`
            },
            { headers })
            .then(async () => {
                getComments()
                setForm({
                    comment: ''
                })
            })
    }

    const getComments = async () => {
        await axios.get(`https://internal-app-dpm.herokuapp.com/post/${id}/comments`, { headers })
            .then(async (resp) => {
                setComments(resp.data.comments)
            })
    }

    const handleLike = async () => {
        await axios.put(`https://internal-app-dpm.herokuapp.com/post/${id}/like`, {}, { headers })
            .then(async () => {
                await axios.get(`https://internal-app-dpm.herokuapp.com/post/${id}`, { headers })
                    .then(async (resp) => {
                        setIsPostLiked(!isPostLiked)
                        setLikesPost(resp.data.post.likes)
                    })
            })
    }

    const handleClose = () => {
        history.goBack()
    }
    const commentDate = (date) => {
        return moment(date).format('D MMM YYYY')
    }
    return (
        <Modal size="lg" className="ModalPost" show={true} onHide={handleClose}>
            <Modal.Header closeButton>
                <img src="https://cdn.pixabay.com/photo/2016/07/03/17/48/lost-places-1495150_960_720.jpg" className="ModalPost__img" />
                <div className="ModalPost-content">
                    <h4>{titlePost}</h4>
                    <p>{contentPost}</p>
                    <div className="ModalPost-actions">
                        <span>
                            {
                                isPostLiked ? <i onClick={handleLike} className="fas fa-heart liked"></i> : <i onClick={handleLike} className="far fa-heart"></i>
                            }
                            {likesPost.length}
                        </span>
                        <span>
                            <i className="far fa-comments"></i>
                            {comments.length}
                        </span>
                        <span>
                            <i class="fas fa-tags"></i>
                            {
                                tagsPost.map(tag => (
                                    <span className="ModalPost-tag">
                                        {tag}
                                    </span>
                                ))
                            }
                        </span>
                    </div>
                </div>
            </Modal.Header>
            <Modal.Body className="ModalPost__content">
                <p className="ModalPost__content-text">{contentPost}</p>
                <form onSubmit={handleSubmit} className="comment-box add-comment">
                    <input value={comment} name="comment" onChange={handleInputChange} type="text" placeholder="Haz un comentario" autoComplete="off" className="ModalPost__content-input" />
                    <button type="submit" className="ModalPost__content-button">Comentar</button>
                </form>
                <label className="ModalPost__content-comments-label">Comentarios:</label>
                {
                    comments.length > 0
                        ? comments.map(comment => (
                            <div className="comment-box">
                                <span className="commenter-pic">
                                    {comment.userId.image ? <img className="Directorio__list-image" src={comment.userId.image} /> : <i class="far fa-user Directorio__user-no-image"></i>}
                                </span>
                                <span className="commenter-name">
                                    {comment.userId.nombre} {comment.userId.apellido}<span className="comment-time">{commentDate(comment.date)}</span>
                                </span>
                                <p className="comment-txt">
                                    {comment.content}
                                </p>
                            </div>
                        ))
                        : <p className="ModalPost__content-comments-no-comment">No hay comentarios, realiza uno</p>

                }
            </Modal.Body>
        </Modal>
    )
}

export default ModalPost
