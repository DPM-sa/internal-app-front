import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useStateValue } from '../../StateProvider'
import Post from './Post'
import './PostSection.css'
import SpinnerComponent from './SpinnerComponent'
const PostSection = () => {
    const [{ token, posts}, dispatch] = useStateValue()
    const headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }
    const [postsPerPage, setPostsPerPage] = useState(2)

    const [loading, setLoading] = useState(false)

    const currentPosts = posts.slice(0, postsPerPage)

    const paginate = () => {
        setPostsPerPage(postsPerPage + 2)
    }
    const getPosts = async () => {
        setLoading(true)
        await axios.get(`https://internal-app-dpm.herokuapp.com/posts`, { headers })
            .then(resp => {
                dispatch({
                    type: "SET_POSTS",
                    posts: resp.data.posts
                })
                dispatch({
                    type: 'SEARCHING_POST',
                    searching: ''
                })
                setLoading(false)
            })
    }

    useEffect(() => {
        getPosts()
    }, [])

    if (loading) return <SpinnerComponent />

    return (
        <>
            <div className="PostSection">
                {
                    currentPosts.length === 0 &&
                    <div className="PostSection__alert-no-posts">
                        <p>No hay posts con ese termino</p>
                    </div>
                }
                {
                    currentPosts.map(post => (
                        <Post key={post._id} title={post.title} content={post.content} post={post} date={post.date} />
                    ))
                }
            </div>
            {
                currentPosts.length < posts.length
                &&
                <button onClick={paginate} className="PostSection__loadmore">
                    + Cargar más publicaciones
                </button>
            }
        </>
    )
}

export default PostSection
