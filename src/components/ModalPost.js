import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useStateValue } from '../StateProvider'
import { Modal } from 'react-bootstrap'
import './ModalPost.css'

const ModalPost = () => {
    const [{ postSelected, comments, token, user }, dispatch] = useStateValue()

    const [form, setForm] = useState({
        comment: ''
    })
    const { comment } = form

    const [isPostLiked, setIsPostLiked] = useState(false)
    const [postLikes, setPostLikes] = useState(0)

    
    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        await axios.post(`https://internal-app-dpm.herokuapp.com/post/${postSelected._id}`,
            {
                "content": `${comment}`
            },
            { headers })
            .then(async () => {
                await axios.get(`https://internal-app-dpm.herokuapp.com/post/${postSelected._id}/comments`, { headers })
                    .then(async (resp) => {
                        dispatch({
                            type: "SELECT_POST",
                            postSelected: postSelected,
                            comments: resp.data.comments
                        })
                    })
            })
    }

    const handleClose = async (e) => {
        dispatch({
            type: "SELECT_POST",
            postSelected: null,
            comments: null
        })
    }

    useEffect(() => {
        if (postSelected.likes.length > 0 && postSelected.likes.find(like => like._id === user._id)) {
            setIsPostLiked(true)
        } else {
            setIsPostLiked(false)
        }
        setPostLikes(postSelected.likes.length)
    }, [])

    const handleLike = async () => {
        await axios.put(`https://internal-app-dpm.herokuapp.com/post/${postSelected._id}/like`, {}, { headers })
            .then(async () => {
                await axios.get(`https://internal-app-dpm.herokuapp.com/post/${postSelected._id}`, { headers })
                    .then(async (resp) => {
                        setIsPostLiked(!isPostLiked)
                        setPostLikes(resp.data.post.likes.length)
                    })
            })
    }

    return (
        <Modal className="ModalPost" show={postSelected} onHide={handleClose}>
            <Modal.Body className="ModalPost__content">
                <img src="https://cdn.pixabay.com/photo/2016/07/03/17/48/lost-places-1495150_960_720.jpg" className="ModalPost__img" />
                <div className="ModalPost__center">
                    <div className="ModalPost__center-likes">
                        <span>
                            {
                                isPostLiked ? <i onClick={handleLike} className="fas fa-heart liked"></i> : <i onClick={handleLike} className="far fa-heart"></i>
                            }
                            {postLikes}
                        </span>
                    </div>
                    <div className="ModalPost__center-comments">
                        <span>
                            <i className="far fa-comments"></i>
                        </span>
                        {comments.length}
                    </div>
                </div>
                <h3>{postSelected.title}</h3>
                <p>{postSelected.content}</p>
                <div className="ModalPost__tags">
                    {
                        postSelected.tags.length > 0
                        && postSelected.tags.map(tag => (
                            <span className="ModalPost__tag">#{tag}</span>
                        ))
                    }
                </div>
                <form onSubmit={handleSubmit} className="comment-box add-comment">
                    <input value={comment} name="comment" onChange={handleInputChange} type="text" placeholder="Haz un comentario" autoComplete="off" />
                    <button type="submit" className="btn btn-default">Comentar</button>
                </form>
                Comentarios:
                {
                    comments.length > 0
                        ? comments.map(comment => (
                            <div className="comment-box">
                                <span className="commenter-pic">
                                    <img src="./assets/no-image.jpg" className="img-fluid" />
                                </span>
                                <span className="commenter-name">
                                    {comment.userId.nombre} {comment.userId.apellido}<span className="comment-time">2 hours ago</span>
                                </span>
                                <p className="comment-txt more">
                                    {comment.content}
                                </p>
                            </div>
                        ))
                        : <p>No hay comentarios, realiza uno</p>

                }
            </Modal.Body>
        </Modal>
    )
}

export default ModalPost
