import React, { useState, useEffect } from 'react'
import SidebarAdmin from '../../components/Admin/SidebarAdmin'
import './PostsAdmin.css'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useStateValue } from '../../StateProvider'
import axios from 'axios'
import { Link, useHistory } from 'react-router-dom'
import moment from 'moment'
import Swal from 'sweetalert2'

const PostsAdmin = () => {
    const history = useHistory()

    const [{ token }] = useStateValue()
    const headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }
    const [posts, setPosts] = useState([])
    const [postsQuantity, setPostsQuantity] = useState(0)
    const [likesQuantity, setLikesQuantity] = useState(0)
    const [commentsQuantity, setCommentsQuantity] = useState(0)

    const getPosts = async () => {
        await axios.get(`https://internal-app-dpm.herokuapp.com/allposts`, { headers })
            .then(resp => {
                let likes = resp.data.posts.map(item => item.likes)
                setLikesQuantity(likes.flat(1).length)
                setPostsQuantity(resp.data.cuantos)
                setPosts(resp.data.posts)
            })
    }

    const getComments = async () => {
        await axios.get(`https://internal-app-dpm.herokuapp.com/allcomments`, { headers })
            .then(resp => {
                console.log(resp.data)
                setCommentsQuantity(resp.data.commentsDB.length)
            })
    }

    useEffect(() => {
        getPosts()
    }, [])

    useEffect(() => {
        getComments()
    }, [])

    const renderTooltipSee = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Ver publicacion
        </Tooltip>
    );
    const renderTooltipEdit = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Editar publicacion
        </Tooltip>
    );
    const renderTooltipHide = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Ocultar publicacion
        </Tooltip>
    );
    const renderTooltipDelete = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Eliminar publicacion
        </Tooltip>
    );

    const getPostDate = (date) => {
        return moment(date).format('D MMM YYYY')
    }
    const editPost = (id) => {
        history.push(`/editpost/${id}`)
    }

    const handleEditPost = async (post, action) => {
        if (post.estado && action === "ver") return
        if (!post.estado && action === "ocultar") return
        if (action === 'ver') {
            Swal.fire({
                title: 'Deseas activar este post?',
                showCloseButton: true,
                showCancelButton: true,
                focusConfirm: false,
                confirmButtonText:
                    'Activar',
                cancelButtonText:
                    'Cancelar'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await axios.put(`https://internal-app-dpm.herokuapp.com/post/${post._id}`,
                        {
                            "estado": !post.estado
                        }, { headers })
                        .then(() => {
                            getPosts()
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
                    await axios.put(`https://internal-app-dpm.herokuapp.com/post/${post._id}`,
                        {
                            "estado": !post.estado
                        }, { headers })
                        .then(() => {
                            getPosts()
                        })
                }
            })
        }
    }

    const handleDeletePost = async (id) => {
        Swal.fire({
            title: 'Deseas eliminar este post?',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText:
                'Eliminar',
            cancelButtonText:
                'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete(`https://internal-app-dpm.herokuapp.com/post/${id}`, { headers })
                    .then(() => {
                        getPosts()
                    })
            }
        })
    }

    return (
        <>
            <SidebarAdmin />
            <div className="PostsAdmin">
                <div className="PostsAdmin-container">
                    <h1>Gestionar publicaciones</h1>
                    <div className="PostsAdmin-content">
                        <div className="PostsAdmin-content-actions">
                            <Link to="/nuevopost" className="PostsAdmin-content-actions-item">
                                <span>+</span>
                                <p>Crear una nueva publicacion</p>
                            </Link>
                            <div className="PostsAdmin-content-actions-item">
                                <span>{postsQuantity}</span>
                                <p>Publicaciones realizadas</p>
                            </div>
                            <div className="PostsAdmin-content-actions-item">
                                <span>{likesQuantity}</span>
                                <p>Likes recibidos</p>
                            </div>
                            <div className="PostsAdmin-content-actions-item">
                                <span>{commentsQuantity}</span>
                                <p>Comentarios recibidos</p>
                            </div>
                        </div>
                        <div className="PostsAdmin-posts">
                            <ul className="PostsAdmin-posts-list">
                                <li className="PostsAdmin-posts-list-header">
                                    <span>Publicacion</span>
                                    <span>Fecha</span>
                                    <span>Acciones</span>
                                </li>
                                <ul className="PostsAdmin-posts-list-body">
                                    {
                                        posts.map(post => (
                                            <li className="PostsAdmin-posts-list-control">
                                                <span>{post.title}</span>
                                                <span>{getPostDate(post.date)}</span>
                                                <span className="posts-lists-control-actions">
                                                    <OverlayTrigger
                                                        placement="top"
                                                        delay={{ show: 100, hide: 100 }}
                                                        overlay={renderTooltipSee}
                                                    >
                                                        <i
                                                            onClick={() => handleEditPost(post, 'ver')}
                                                            className={post.estado ? 'button-watch-post disabled far fa-eye' : 'button-watch-post far fa-eye'}
                                                        ></i>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger
                                                        placement="top"
                                                        delay={{ show: 100, hide: 100 }}
                                                        overlay={renderTooltipEdit}
                                                    >
                                                        <i onClick={() => editPost(post._id)} class="fas fa-pen"></i>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger
                                                        placement="top"
                                                        delay={{ show: 100, hide: 100 }}
                                                        overlay={renderTooltipHide}
                                                    >
                                                        <i
                                                            onClick={() => handleEditPost(post, 'ocultar')}
                                                            className={post.estado
                                                                ? 'button-watch-hidden fas fa-eye-slash'
                                                                : 'button-watch-hidden disabled fas fa-eye-slash'
                                                            }
                                                        ></i>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger
                                                        placement="top"
                                                        delay={{ show: 100, hide: 100 }}
                                                        overlay={renderTooltipDelete}
                                                    >
                                                        <i
                                                            onClick={() => handleDeletePost(post._id)}
                                                            class="fas fa-trash-alt"
                                                        ></i>
                                                    </OverlayTrigger>
                                                </span>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PostsAdmin
