import React, { useState } from 'react'
import './Post.css'
import { useStateValue } from '../../StateProvider'
import moment from 'moment'
import axios from 'axios'
import { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import parse from 'html-react-parser'
import { apiURL } from '../../config/api'

const Post = ({ title, content, post, date }) => {
    const [{ token, user, openPost }] = useStateValue()
    const history = useHistory()
    let headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }
    const [commentsLength, setCommentsLength] = useState([])

    const getComments = async () => {
        await axios.get(`${apiURL}/comments`, { headers })
            .then(resp => {
                setCommentsLength(resp.data.commentsDB)
            })
    }

    useEffect(() => {
        getComments()
    }, [openPost])

    const commentsLengthNumber = commentsLength.filter(comment => post._id === comment.postId)

    /*formateo de fecha de posteo*/

    const fecha = moment(date).format('D MMM YYYY')
    const fechaArr = fecha.split(" ")
    const fechaObj = {}
    fechaObj.day = fechaArr[0]
    fechaObj.month = fechaArr[1]
    fechaObj.year = fechaArr[2]
    const { day, month, year } = fechaObj

    const userHasLiked = () => {
        if (post.likes.length > 0 && post.likes.find(like => like._id === user._id)) {
            return true
        } else {
            return false
        }
    }
    const truncateContent = (content) => {
        return content.substring(0, 120) + "..."
    }
    const handleOpenPost = () => {
        history.push(`/home/post/${post._id}`)
    }
    return (
        <>
            <div className="Post">
                <img src={post.image} className="Post__image" />

                <div className="Post__content">
                    <div className="Post__date">
                        {day} - {month} - {year}
                    </div>
                    <div className="Post__content-bottom">
                        <h5 onClick={handleOpenPost}>
                            {title}
                        </h5>
                        <div className="Post__content-content">
                            {/* parse() parsea contenido html para luego renderizarlo*/}
                            {parse(truncateContent(content))}
                        </div>

                        <div className="Post__content-actions">
                            <span>
                                {
                                    userHasLiked() ? <i className="fas fa-heart liked"></i> : <i className="far fa-heart"></i>
                                }
                                {post.likes.length}
                            </span>

                            <span>
                                <i className="far fa-comments"></i>
                                {commentsLengthNumber.length}
                            </span>

                            <span>
                                <i className="fas fa-tags"></i>
                                {
                                    post.tags.length > 0
                                    && post.tags.map((tag, i) => (
                                        <span key={i} className="Post__content-tag">
                                            {tag}
                                        </span>
                                    ))
                                }
                            </span>
                        </div>
                        <Link to={`/home/post/${post._id}`} className="Post__see-more">
                            + Ver m??s
                        </Link>
                    </div>

                </div>

            </div>
        </>
    )
}

export default Post
