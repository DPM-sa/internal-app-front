import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import { useStateValue } from '../../StateProvider'
import axios from 'axios'
import './ModalPost.css'
import parse from 'html-react-parser'
import Comment from './Comment'

const ModalPost = () => {
    const [{ token, user, commentsPost }, dispatch] = useStateValue()

    const history = useHistory()

    const { id } = useParams()
    const [titlePost, setTitlePost] = useState('')
    const [contentPost, setContentPost] = useState('')
    const [likesPost, setLikesPost] = useState([])
    const [tagsPost, setTagsPost] = useState([])

    const [post, setPost] = useState({
        title: '',
        content: '',
        likes: [],
        tags: []
    })
    const { title, content, likes, tags } = post
    const [isPostLiked, setIsPostLiked] = useState(false)
    const [imgUrl, setImgUrl] = useState('')
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

    const getPosts = async () => {
        await axios.get(`https://internal-app-dpm.herokuapp.com/posts`, { headers })
            .then(resp => {
                dispatch({
                    type: "SET_POSTS",
                    posts: resp.data.posts
                })
            })
    }

    const getPost = async () => {
        await axios.get(`https://internal-app-dpm.herokuapp.com/post/${id}`, { headers })
            .then(resp => {
                setPost({
                    title: resp.data.post.title,
                    content: resp.data.post.content,
                    likes: resp.data.post.likes,
                    tags: resp.data.post.tags
                })
                setImgUrl(resp.data.post.image)
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
                dispatch({
                    type: 'SET_COMMENTS_POST',
                    commentsPost: resp.data.comments
                })
            })
    }

    const handleLike = async () => {
        await axios.put(`https://internal-app-dpm.herokuapp.com/post/${id}/like`, {}, { headers })
            .then(async () => {
                await axios.get(`https://internal-app-dpm.herokuapp.com/post/${id}`, { headers })
                    .then(() => {
                        getPost()
                        getPosts()
                    })
            })
    }

    useEffect(() => {
        dispatch({
            type: 'SET_OPEN_POST',
            openPost: true
        })
    }, [])

    const handleClose = () => {
        history.push('/home')
        dispatch({
            type: 'SET_COMMENTS_POST',
            commentsPost: []
        })
        dispatch({
            type: 'SET_OPEN_POST',
            openPost: false
        })
    }

    const truncateContent = (content) => {
        return content.substring(0, 80) + "..."
    }

    return (
        <>
            <Modal size="lg" className="ModalPost" show={true} onHide={handleClose}>
                <Modal.Header closeButton>
                    <img src={imgUrl} className="ModalPost__header-img" />
                    <div className="ModalPost__header-content">
                        <div className="ModalPost-header-top">
                            <h4>{title}</h4>
                            <p>{parse(truncateContent(content))}</p>
                        </div>
                        <div className="ModalPost__header-actions">
                            <span>
                                {
                                    isPostLiked ? <i onClick={handleLike} className="fas fa-heart liked"></i> : <i onClick={handleLike} className="far fa-heart"></i>
                                }
                                {likes.length}
                            </span>
                            <span>
                                <i className="far fa-comments"></i>
                                {commentsPost.length}
                            </span>
                            <span>
                                <i class="fas fa-tags"></i>
                                {
                                    tags.map(tag => (
                                        <span className="ModalPost__header-actions-tag">
                                            {tag}
                                        </span>
                                    ))
                                }
                            </span>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body className="ModalPost__content">
                    <p className="ModalPost__content-text">{parse(content)}</p>
                    <form onSubmit={handleSubmit} className="comment-box add-comment">
                        <input value={comment} name="comment" onChange={handleInputChange} type="text" placeholder="Haz un comentario" autoComplete="off" className="ModalPost__content-input" />
                        <button disabled={comment === ""} type="submit" className="ModalPost__content-button">Comentar</button>
                    </form>
                    <label className="ModalPost__content-comments-label">Comentarios:</label>
                    {
                        commentsPost.length > 0
                            ? commentsPost.map(comment => (
                                <Comment comment={comment} />
                            ))
                            : <p className="ModalPost__content-comments-no-comment">No hay comentarios, realiza uno</p>

                    }
                    <button className="ModalPost__back-button" onClick={handleClose}><i class="fas fa-chevron-left"></i> Volver</button>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ModalPost
