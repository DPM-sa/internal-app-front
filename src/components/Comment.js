import axios from 'axios'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useStateValue } from '../StateProvider'

const Comment = ({ comment }) => {
    const { userId } = comment

    const [{ token }] = useStateValue()

    const [user, setUser] = useState({})

    const headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }

    const getUser = async () => {
        await axios.get(`https://internal-app-dpm.herokuapp.com/usuario/${userId}`, { headers })
            .then(resp => {
                setUser(resp.data.user)
            })
    }

    useEffect(() => {
        getUser()
    }, [])

    const commentDate = (date) => {
        return moment(date).format('D MMM YYYY')
    }

    return (
        <div className="comment-box">
            <span className="commenter-pic">
                {user.image ? <img className="profile-image-small" src={user.image} /> : <i class="far fa-user no-image-profile-small"></i>}
            </span>
            <span className="commenter-name">
                {user.nombre} {user.apellido}<span className="comment-time">{commentDate(comment.date)}</span>
            </span>
            <p className="comment-txt">
                {comment.content}
            </p>
        </div>
    )
}

export default Comment
