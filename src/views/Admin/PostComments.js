import axios from 'axios'
import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'
import { useStateValue } from '../../StateProvider'
import CommentItem from '../../components/Admin/CommentItem'
import './PostComments.css'

const PostComments = () => {
    const { id } = useParams()
    const [{ token, commentsPost }, dispatch] = useStateValue()

    const history = useHistory()

    const headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }

    const getComments = async () => {
        await axios.get(`https://internal-app-dpm.herokuapp.com/post/${id}/allcomments`, { headers })
            .then(async (resp) => {
                dispatch({
                    type: 'SET_COMMENTS_POST',
                    commentsPost: resp.data.comments
                })
            })
    }

    useEffect(() => {
        getComments()
    }, [])

    const handleReturn = () => {
        history.goBack()
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
                                commentsPost.length > 0 &&
                                commentsPost.map(comment => (
                                    <CommentItem comment={comment} />
                                ))
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
