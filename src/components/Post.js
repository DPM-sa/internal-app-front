import React, { useState } from 'react'
import './Post.css'
import { useStateValue } from '../StateProvider'
import moment from 'moment'
import axios from 'axios'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import parse from 'html-react-parser'

const Post = ({ title, content, post, date }) => {
    const [{ token, user }] = useStateValue()
    let headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }
    const [commentsLength, setCommentsLength] = useState([])

    const getComments = async () => {
        await axios.get(`https://internal-app-dpm.herokuapp.com/comments`, { headers })
            .then(resp => {
                setCommentsLength(resp.data.commentsDB)
            })
    }

    useEffect(() => {
        getComments()
    }, [])

    const commentsLengthNumber = commentsLength.filter(comment => post._id === comment.postId)

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
    return (
        <>
            <div className="Post">
                <img src="https://cdn.pixabay.com/photo/2016/07/03/17/48/lost-places-1495150_960_720.jpg" className="Post__image" />

                <div className="Post__content">
                    <div className="Post__date">
                        {day} - {month} - {year}
                    </div>
                    <div className="Post__content-bottom">
                        <h5>
                            {title}
                        </h5>
                        <div className="Post__content-content">
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
                                <i class="fas fa-tags"></i>
                                {
                                    post.tags.length > 0
                                    && post.tags.map(tag => (
                                        <span className="Post__content-tag">
                                            {tag}
                                        </span>
                                    ))
                                }
                            </span>
                        </div>
                        <Link to={`/home/post/${post._id}`} className="Post__see-more">
                            + Ver más
                        </Link>
                    </div>

                </div>

            </div>
        </>
    )
}

export default Post
