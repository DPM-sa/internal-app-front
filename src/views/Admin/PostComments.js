import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'
import { useStateValue } from '../../StateProvider'
import CommentItem from '../../components/Admin/CommentItem'
import './PostComments.css'

const PostComments = () => {
    const { id } = useParams()
    const [{ token, commentsPost }, dispatch] = useStateValue()
    const [loadingComments, setLoadingComments] = useState(false)
    const history = useHistory()

    const headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }

    const getComments = async () => {
        setLoadingComments(true)
        await axios.get(`https://internal-app-dpm.herokuapp.com/post/${id}/allcomments`, { headers })
            .then(async (resp) => {
                dispatch({
                    type: 'SET_COMMENTS_POST',
                    commentsPost: resp.data.comments
                })
                setLoadingComments(false)
            })
    }

    useEffect(() => {
        getComments()
    }, [])

    const handleReturn = () => {
        history.goBack()
        dispatch({
            type: 'SET_COMMENTS_POST',
            commentsPost: []
        })
    }

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
                                loadingComments &&
                                <li>Cargando...</li>
                            }
                            {
                                (!loadingComments && commentsPost.length > 0)
                                && commentsPost.map(comment => (
                                    <CommentItem key={comment._id} comment={comment} />
                                ))
                            }
                            {
                                (!loadingComments && commentsPost.length === 0)
                                && <li>No se han realizado comentarios en esta publicación</li>
                            }
                        </ul>
                    </ul>
                    <button onClick={handleReturn} className="PostComments-button-return">
                        Volver
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PostComments
