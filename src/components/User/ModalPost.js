import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { CloseButton, Modal } from 'react-bootstrap'
import { useStateValue } from '../../StateProvider'
import axios from 'axios'
import './ModalPost.css'
import parse from 'html-react-parser'
import Comment from './Comment'
import { storage } from '../../config/firebase';
import { v4 as uuidv4 } from 'uuid';

const ModalPost = () => {
    const [{ token, user, commentsPost }, dispatch] = useStateValue()
    const history = useHistory()
    const { id } = useParams()
    const [post, setPost] = useState({
        title: '',
        content: '',
        likes: [],
        tags: []
    })
    const { title, content, likes, tags } = post
    const [isPostLiked, setIsPostLiked] = useState(false)
    const [imgUrl, setImgUrl] = useState('')
    const [imgUrlComment, setImgUrlComment] = useState('')
    const [form, setForm] = useState({
        comment: ''
    })
    const [loadingImg, setLoadingImg] = useState(false)
    const [loading, setLoading] = useState(false)
    const [filename, setFilename] = useState('')
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
        await axios.get(`https://interno-web-backend.dpm.com.ar/posts`, { headers })
            .then(resp => {
                dispatch({
                    type: "SET_POSTS",
                    posts: resp.data.posts
                })
            })
    }

    const getPost = async () => {
        await axios.get(`https://interno-web-backend.dpm.com.ar/post/${id}`, { headers })
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
        let _body = {
            "content": `${comment}`
        };

        if (imgUrlComment) {
            _body = { ..._body, image: imgUrlComment }
        }
        // let baseURL = 'http://localhost:4000';
        await axios.post(`https://interno-web-backend.dpm.com.ar/post/${id}`, _body, { headers })
            .then(async () => {
                getComments()
                setForm({
                    comment: ''
                })
                setFilename('')
                setImgUrlComment('')
            })
    }

    const getComments = async () => {
        await axios.get(`https://interno-web-backend.dpm.com.ar/post/${id}/comments`, { headers })
            .then(async (resp) => {
                dispatch({
                    type: 'SET_COMMENTS_POST',
                    commentsPost: resp.data.comments
                })
            })
    }

    const handleLike = async () => {
        await axios.put(`https://interno-web-backend.dpm.com.ar/post/${id}/like`, {}, { headers })
            .then(async () => {
                await axios.get(`https://interno-web-backend.dpm.com.ar/post/${id}`, { headers })
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

    const handlePictureClick = () => {
        document.querySelector("#fileSelector").click()
    }
    const handleFileChange = async (e) => {
        setLoadingImg(true)
        let fileId = uuidv4();
        const file = e.target.files[0]
        const storageRef = storage.ref().child('postImages').child(`${fileId}`)
        const res = await storageRef.put(file)
        const url = await storageRef.getDownloadURL()
        setImgUrlComment(url)
        setFilename(file.name)
        setLoadingImg(false)
    }

    return (
        <>
            <Modal size="lg" className="ModalPost" show={true} onHide={handleClose}>
                <Modal.Header closeButton >
                    <img src={imgUrl} className="ModalPost__header-img" />
                    <div className="ModalPost__header-content">
                        <div className="ModalPost-header-top">
                            <h4>{title}</h4>
                            {/*parse() parsea contenido html para luego renderizar */}
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
                                <i className="fas fa-tags"></i>
                                {
                                    tags.map((tag, i) => (
                                        <span key={i} className="ModalPost__header-actions-tag">
                                            {tag}
                                        </span>
                                    ))
                                }
                            </span>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body className="ModalPost__content">

                    {/*parse() parsea contenido html para luego renderizar */}
                    <p className="ModalPost__content-text">{parse(content)}</p>

                    <form onSubmit={handleSubmit} className="comment-box add-comment">
                        <input
                            value={comment}
                            name="comment"
                            onChange={handleInputChange}
                            type="text"
                            placeholder="Haz un comentario"
                            autoComplete="off"
                            className="ModalPost__content-input"
                        />
                        <input
                            id="fileSelector"
                            type="file"
                            name="file"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                            accept="image/png, image/gif, image/jpeg"
                        />
                        <button disabled={comment === ""} type="submit" className="ModalPost__content-button">Comentar</button>

                        <button
                            disabled={loadingImg || loading}
                            type="button"
                            onClick={handlePictureClick}
                            className="ModalPost__content-button"
                            style={{ backgroundColor: imgUrlComment !== '' ? 'green' : ''}}
                        >
                            {loadingImg ? <>Espere...</> : <i className="fas fa-image"/>}
                        </button>
                    </form>


                    <label className="ModalPost__content-comments-label">Comentarios:</label>
                    {
                        commentsPost.length > 0
                            ? commentsPost.map(comment => (
                                <Comment comment={comment} />
                            ))
                            : <p className="ModalPost__content-comments-no-comment">No hay comentarios, realiza uno</p>

                    }
                    <button className="ModalPost__back-button" onClick={handleClose}><i className="fas fa-chevron-left"></i> Volver</button>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ModalPost
