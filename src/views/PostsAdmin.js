import React, { useState, useEffect } from 'react'
import SidebarAdmin from './SidebarAdmin'
import './PostsAdmin.css'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useStateValue } from '../StateProvider'
import axios from 'axios'
import { Link, useHistory } from 'react-router-dom'
import moment from 'moment'

const PostsAdmin = () => {
    const history = useHistory()
    const [{ token }] = useStateValue()
    const [posts, setPosts] = useState([])
    const [postsQuantity, setPostsQuantity] = useState(0)
    const [likesQuantity, setLikesQuantity] = useState(0)
    const getPosts = async () => {
        let headers = {
            'Content-Type': 'application/json',
            "token": `${token}`
        }
        await axios.get(`https://internal-app-dpm.herokuapp.com/posts`, { headers })
            .then(resp => {
                let likes = resp.data.posts.map(item => item.likes)
                setLikesQuantity(likes.flat(1).length)
                setPostsQuantity(resp.data.cuantos)
                setPosts(resp.data.posts)
            })
    }

    useEffect(() => {
        getPosts()
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
                                <span>375</span>
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
                                                        <i class="far fa-eye"></i>
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
