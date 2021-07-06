import React from 'react'
import './Post.css'
import { useStateValue } from '../StateProvider'
import moment from 'moment'
import axios from 'axios'

const Post = ({ title, content, post, date, commentsLength }) => {

    const [{ token, user }, dispatch] = useStateValue()
    const headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }
    const handleOpenModal = async (post) => {
        await axios.get(`https://internal-app-dpm.herokuapp.com/post/${post._id}/comments`, { headers })
            .then(resp => {
                dispatch({
                    type: 'SELECT_POST',
                    postSelected: post,
                    comments: resp.data.comments
                })
            })
    }
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
    return (
        <>
            <div className="Post">
                <img src="https://cdn.pixabay.com/photo/2016/07/03/17/48/lost-places-1495150_960_720.jpg" className="Post__top-image" />
                <div className="Post__top-date">
                    {day} - {month} - {year}
                </div>

                <div className="Post__bottom">
                    <h5 className="card-title">
                        {title}
                    </h5>
                    <p className="card-text">
                        {content}
                    </p>

                    <div className="Post__bottom-actions">
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
                                <span className="Post__bottom-tag">
                                    {tag}
                                </span>
                            ))
                        }
                        </span>
                    </div>
                    <button onClick={() => handleOpenModal(post)} className="btn Post__see-more">
                        + Ver más
                    </button>
                </div>

            </div>
        </>
    )
}

export default Post
