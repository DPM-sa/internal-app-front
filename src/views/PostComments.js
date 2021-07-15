import axios from 'axios'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useParams } from 'react-router'
import { useStateValue } from '../StateProvider'
import './PostComments.css'

const PostComments = () => {
    const { id } = useParams()
    const [{ token }] = useStateValue()
    const [comments, setComments] = useState([])
    const [active, setActive] = useState('')

    const handleExpandCollaps = (id) => {
        if (active === id) {
            setActive('')
        } else {
            setActive(id)
        }
    }

    let headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }
    const getComments = async () => {
        await axios.get(`https://internal-app-dpm.herokuapp.com/post/${id}/comments`, { headers })
            .then(async (resp) => {
                setComments(resp.data.comments)
            })
    }
    const renderTooltipSee = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Ver publicacion
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
    useEffect(() => {
        getComments()
    }, [])
    return (
        <div className="PostComments">
            <div className="PostComments__container">
                <div className="PostsComments-posts">
                    <ul className="PostsComments-posts-list">
                        <li className="PostsComments-posts-list-header">
                            <span>Comentario</span>
                            <span>Fecha</span>
                            <span>Nombre y apellido</span>
                            <span>Acciones</span>
                        </li>
                        <ul className="PostsComments-posts-list-body">
                            {
                                comments.length > 0 &&
                                comments.map(comment => (
                                    <li 
                                        onClick={() => handleExpandCollaps(comment._id)} 
                                        className={active === comment._id ? 'PostsComments-posts-list-control item-active' 
                                        : 'PostsComments-posts-list-control'}>
                                        <div>
                                            <span>{comment.content}</span>
                                            <span>{getPostDate(comment.date)}</span>
                                            <span>Nombre y apellido</span>
                                            <span className="comments-lists-control-actions">
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
                                ))
                            }
                        </ul>
                    </ul>
                </div>
                <button>
                    Volver
                </button>
            </div>
        </div>
    )
}

export default PostComments
