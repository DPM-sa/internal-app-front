import axios from 'axios'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useStateValue } from '../../StateProvider'
import { Modal } from 'react-bootstrap'
import { useParams } from 'react-router-dom'


const Comment = ({ comment }) => {
    const { userId } = comment
    const { id } = useParams()
    const [{ token, user }, dispatch] = useStateValue()

    const [userComment, setUserComment] = useState({})

    const headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }

    const getUser = async () => {
        await axios.get(`https://internal-app-dpm.herokuapp.com/usuario/${userId}`, { headers })
            .then(resp => {
                setUserComment(resp.data.user)
            })
    }

    useEffect(() => {
        getUser()
    }, [])

    const commentDate = (date) => {
        return moment(date).format('D MMM YYYY')
    }
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const getComments = async () => {
        await axios.get(`https://internal-app-dpm.herokuapp.com/post/${id}/comments`, { headers })
            .then(async (resp) => {
                dispatch({
                    type: 'SET_COMMENTS_POST',
                    commentsPost: resp.data.comments
                })
            })
    }
    const handleDelete = async () => {
        await axios.delete(`https://internal-app-dpm.herokuapp.com/comment/${comment._id}`, { headers })
            .then(() => {
                getComments()
                setShow(false)
            })
    }
    return (
        <>
            <div className="comment-box">
                <span className="commenter-pic">
                    {userComment.image ? <img className="profile-image-small" src={userComment.image} /> : <i class="far fa-user no-image-profile-small"></i>}
                </span>
                <span className="commenter-name">
                    {userComment.nombre} {userComment.apellido}<span className="comment-time">{commentDate(comment.date)}</span>
                </span>
                {user._id === userId && <i onClick={handleShow} class="icon-delete-comment fas fa-trash-alt"></i>}
                <p className="comment-txt">
                    {comment.content}
                </p>
            </div>
            <Modal className="Login__modal" show={show} onHide={handleClose}>
                <Modal.Header>
                    <button onClick={handleClose} className="Login__modal-button-close">
                        <span aria-hidden="true">×</span>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <p>¿Desea eliminar este comentario?</p>
                </Modal.Body>
                <Modal.Footer>
                    <button className="Login__modal-button" onClick={handleClose}>
                        Cerrar
                    </button>
                    <button className="Login__modal-button" onClick={handleDelete}>
                        Eliminar
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Comment
