import axios from 'axios';
import moment from 'moment';
import React, { useState, useEffect } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useStateValue } from '../StateProvider';

const CommentItem = ({ comment }) => {
    const [active, setActive] = useState('')
    const [userComment, setUserComment] = useState({})
    const [{ token }] = useStateValue()


    let headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }
    const getUser = async () => {
        await axios.get(`https://internal-app-dpm.herokuapp.com/usuario/${comment.userId}`, { headers })
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
    const handleEditPost = async (comment, action) => {
        let headers = {
            'Content-Type': 'application/json',
            "token": `${token}`
        }
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
                    await axios.put(`https://internal-app-dpm.herokuapp.com/comment/${comment._id}`,
                        {
                            "estado": !comment.estado
                        }, { headers })
                        .then(async () => {
                            await axios.get(`https://internal-app-dpm.herokuapp.com/allposts`, { headers })
                                .then(resp => {
                                    let likes = resp.data.posts.map(item => item.likes)
                                    setLikesQuantity(likes.flat(1).length)
                                    setPostsQuantity(resp.data.cuantos)
                                    setPosts(resp.data.posts)
                                })
                        })
                }
            })
        } else if (action === 'ocultar') {
            Swal.fire({
                title: 'Deseas inactivar este post?',
                showCloseButton: true,
                showCancelButton: true,
                focusConfirm: false,
                confirmButtonText:
                    'Inactivar',
                cancelButtonText:
                    'Cancelar'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await axios.put(`https://internal-app-dpm.herokuapp.com/comment/${post._id}`,
                        {
                            "estado": !post.estado
                        }, { headers })
                        .then(async () => {
                            await axios.get(`https://internal-app-dpm.herokuapp.com/allposts`, { headers })
                                .then(resp => {
                                    let likes = resp.data.posts.map(item => item.likes)
                                    setLikesQuantity(likes.flat(1).length)
                                    setPostsQuantity(resp.data.cuantos)
                                    setPosts(resp.data.posts)
                                })
                        })
                }
            })
        }
    }
    return (
        <li
            onClick={() => handleExpandCollaps(comment._id)}
            className={active === comment._id ? 'PostsComments-posts-list-control item-active'
                : 'PostsComments-posts-list-control'}>
            <div>
                <span>{comment.content}</span>
                <span>{getPostDate(comment.date)}</span>
                <span>{userComment.nombre} {userComment.apellido}</span>
                <span className="comments-lists-control-actions">
                    <OverlayTrigger
                        placement="top"
                        delay={{ show: 100, hide: 100 }}
                        overlay={renderTooltipSee}
                    >
                        <i
                            onClick={() => handleEditPost(comment, 'ver')}
                            className={comment.estado ? 'button-watch-post disabled far fa-eye' : 'button-watch-post far fa-eye'}
                        ></i>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="top"
                        delay={{ show: 100, hide: 100 }}
                        overlay={renderTooltipHide}
                    >
                        <i class="fas fa-eye-slash"></i>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="top"
                        delay={{ show: 100, hide: 100 }}
                        overlay={renderTooltipDelete}
                    >
                        <i class="fas fa-trash-alt"></i>
                    </OverlayTrigger>
                </span>
            </div>

        </li>
    )
}

export default CommentItem
