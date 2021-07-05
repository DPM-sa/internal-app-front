import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useStateValue } from '../StateProvider'
import Post from './Post'
import './PostSection.css'
import ModalPost from './ModalPost'

const PostSection = () => {
    const [{ token, postSelected, posts }, dispatch] = useStateValue()

    const headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }

    const [maxPosts, setMaxPosts] = useState(0)
    const [comments, setComments] = useState([])
    const [postsToShow, setPostsToShow] = useState(2)
    const [form, setForm] = useState({
        search: ""
    })

    const [tags, setTags] = useState([])

    const { search } = form

    const getPosts = async () => {
        await axios.get(`https://internal-app-dpm.herokuapp.com/posts?limite=${postsToShow}`, { headers })
            .then(resp => {
                setMaxPosts(resp.data.cuantos)
                console.log(resp)
                dispatch({
                    type: "SET_POSTS",
                    posts: resp.data.posts
                })
            })
    }

    useEffect(() => {
        const getTags = async () => {
            await axios.get('https://internal-app-dpm.herokuapp.com/tags', { headers })
                .then(resp => {
                    setTags(resp.data.arrayWithoutRepeatedTags)
                })
        }
        const getComments = async () => {
            await axios.get(`https://internal-app-dpm.herokuapp.com/comments`, { headers })
                .then(resp => {
                    setComments(resp.data.commentsDB)
                })
        }
        getTags()
        getComments()
    }, [])

    useEffect(() => {
        getPosts()
    }, [postsToShow])

    const handleSubmit = async (e) => {
        e.preventDefault()
        await axios.get(`https://internal-app-dpm.herokuapp.com/posts/buscar/${search}`, { headers })
            .then(resp => {
                if (resp.data.postDB.length > 0) {
                    dispatch({
                        type: "SET_POSTS",
                        posts: resp.data.postDB
                    })
                }
            })
    }

    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const searchByTag = async (tag) => {
        await axios.get(`https://internal-app-dpm.herokuapp.com/tag/${tag}`, { headers })
            .then(resp => {
                dispatch({
                    type: "SET_POSTS",
                    posts: resp.data.postDB
                })
            })
    }

    const showMorePosts = () => {
        setPostsToShow(postsToShow + 2)
    }

    return (
        <>
            <div className="PostSection__search">

                <form onSubmit={handleSubmit} className="PostSection__search-form">
                    <input value={search} name="search" onChange={handleInputChange} className="PostSection__search-input" placeholder="Busca un post por título" type="text" />
                    <i className="fas fa-search"></i>
                </form>

                <div className="PostSection__filters">

                    <div className="dropdown PostSection__date">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            Ordenar por más nuevos
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li><a className="dropdown-item" href="#">Más recientes</a></li>
                            <li><a className="dropdown-item" href="#">Más antiguos</a></li>
                        </ul>
                    </div>

                    <div className="dropdown PostSection__tag">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            Filtrar por categorias
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li>
                                <span className="dropdown-item">Todos</span>
                            </li>
                            {
                                tags.map((item, idx) => (
                                    <li key={idx}>
                                        <span onClick={() => searchByTag(item)} className="dropdown-item">{item}</span>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>

                </div>

            </div>
            <div className="PostSection">
                {posts.map(post => (
                    <Post key={post._id} comments={comments} title={post.title} content={post.content} post={post} date={post.date} />
                ))}
            </div>
            {
                postSelected && <ModalPost />
            }
            {
                (posts.length > 0 && postsToShow >= maxPosts)
                    ? <p className="text-center">No hay mas posts para mostrar</p>
                    : <button onClick={showMorePosts} className="btn PostSection__loadmore">
                        + Cargar más publicaciones
                    </button>
            }

        </>
    )
}

export default PostSection
