import React, { useState, useEffect } from 'react'
import axios from 'axios';
import moment from 'moment';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useStateValue } from '../../StateProvider';
import { apiURL } from '../../config/api';

const CommentItem = ({ comment }) => {

    const [active, setActive] = useState('')
    const [userComment, setUserComment] = useState({})
    const { id } = useParams()

    const [{ token }, dispatch] = useStateValue()
    const headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }

    const getComments = async () => {
        await axios.get(`${apiURL}/post/${id}/allcomments`, { headers })
            .then(async (resp) => {
                dispatch({
                    type: 'SET_COMMENTS_POST',
                    commentsPost: resp.data.comments
                })
            })
    }

    const getUser = async () => {
        await axios.get(`${apiURL}/usuario/${comment.userId}`, { headers })
            .then(resp => {
                setUserComment(resp.data.user)
            })
    }

    useEffect(() => {
        getUser()
    }, [])

    const handleExpandCollaps = (id) => {
        if (active === id) {
            setActive('')
        } else {
            setActive(id)
        }
    }

    const renderTooltipSee = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Ver Comentario
        </Tooltip>
    );

    const renderTooltipHide = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Ocultar Comentario
        </Tooltip>
    );

    const renderTooltipDelete = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Eliminar Comentario
        </Tooltip>
    );

    const getPostDate = (date) => {
        return moment(date).format('D MMM YYYY')
    }

    const handleEditComment = async (comment, action) => {
        if (comment.estado && action === "ver") return
        if (!comment.estado && action === "ocultar") return
        if (action === 'ver') {
            Swal.fire({
                title: 'Deseas activar este comentario?',
                showCloseButton: true,
                showCancelButton: true,
                focusConfirm: false,
                confirmButtonText:
                    'Activar',
                cancelButtonText:
                    'Cancelar'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await axios.put(`${apiURL}/comment/${comment._id}`,
                        {
                            "estado": !comment.estado
                        }, { headers })
                        .then(() => {
                            getComments()
                        })
                }
            })
        } else if (action === 'ocultar') {
            Swal.fire({
                title: 'Deseas inactivar este comentario?',
                showCloseButton: true,
                showCancelButton: true,
                focusConfirm: false,
                confirmButtonText:
                    'Inactivar',
                cancelButtonText:
                    'Cancelar'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await axios.put(`${apiURL}/comment/${comment._id}`,
                        {
                            "estado": !comment.estado
                        }, { headers })
                        .then(() => {
                            getComments()
                        })
                }
            })
        }
    }

    const handleDeleteComment = async (commentId) => {
        Swal.fire({
            title: 'Deseas eliminar este comentario?',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText:
                'Eliminar',
            cancelButtonText:
                'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete(`${apiURL}/comment/${commentId}`, { headers })
                    .then(() => {
                        getComments()
                    })
            }
        })
    }

    return (
        <li
            className={active === comment._id ? 'PostsComments-posts-list-control item-active'
                : 'PostsComments-posts-list-control'}>
            <div>
                <span onClick={() => handleExpandCollaps(comment._id)}>{comment.content}</span>
                <span>{getPostDate(comment.date)}</span>
                <span>{userComment.nombre} {userComment.apellido}</span>
                <span className="comments-lists-control-actions">
                    <OverlayTrigger
                        placement="top"
                        delay={{ show: 100, hide: 100 }}
                        overlay={renderTooltipSee}
                    >
                        <i
                            onClick={() => handleEditComment(comment, 'ver')}
                            className={comment.estado ? 'button-watch-post disabled far fa-eye' : 'button-watch-post far fa-eye'}
                        ></i>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="top"
                        delay={{ show: 100, hide: 100 }}
                        overlay={renderTooltipHide}
                    >
                        <i onClick={() => handleEditComment(comment, 'ocultar')}
                            className={comment.estado
                                ? 'button-watch-hidden fas fa-eye-slash'
                                : 'button-watch-hidden disabled fas fa-eye-slash'
                            }></i>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="top"
                        delay={{ show: 100, hide: 100 }}
                        overlay={renderTooltipDelete}
                    >
                        <i onClick={() => handleDeleteComment(comment._id)} className="fas fa-trash-alt"></i>
                    </OverlayTrigger>
                </span>
            </div>

        </li>
    )
}

export default CommentItem
