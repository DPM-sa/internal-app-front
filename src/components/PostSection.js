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
    const [postsToShow, setPostsToShow] = useState(2)

    const [commentsLength, setCommentsLength] = useState([])
    
    const [isSearching, setIsSearching] = useState(false)
    const [tags, setTags] = useState([])

    const [form, setForm] = useState({
        search: ""
    })
    const { search } = form

    const getPosts = async () => {
        setIsSearching(false)
        await axios.get(`https://internal-app-dpm.herokuapp.com/posts?limite=10`, { headers })
            .then(resp => {
                setMaxPosts(resp.data.cuantos)
                dispatch({
                    type: "SET_POSTS",
                    posts: resp.data.posts
                })
            })
    }

    const getTags = async () => {
        await axios.get('https://internal-app-dpm.herokuapp.com/tags', { headers })
            .then(resp => {
                setTags(resp.data.arrayWithoutRepeatedTags)
            })
    }

    const getComments = async () => {
        await axios.get(`https://internal-app-dpm.herokuapp.com/comments`, { headers })
            .then(resp => {
                setCommentsLength(resp.data.commentsDB)
            })
    }

    useEffect(() => {
        getTags()
    }, [])

    useEffect(() => {
        getComments()
    }, [])

    useEffect(() => {
        getPosts()
    }, [])

    const handleSubmit = async (e) => {
        setIsSearching(false)
        e.preventDefault()
        await axios.get(`https://internal-app-dpm.herokuapp.com/posts/buscar/${search}`, { headers })
            .then(resp => {
                dispatch({
                    type: "SET_POSTS",
                    posts: resp.data.postDB
                })
                setIsSearching(true)
            })
    }

    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const searchByTag = async (tag) => {
        setIsSearching(false)
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
    const reversePosts = () => {
        dispatch({
            type: "SET_POSTS",
            posts: posts.sort((a, b) => {
                return new Date(a.date).getTime() -
                    new Date(b.date).getTime()
            })
        })
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
                            <li onClick={getPosts} className="dropdown-item">Más recientes</li>
                            <li onClick={reversePosts} className="dropdown-item">Más antiguos</li>
                        </ul>
                    </div>

                    <div className="dropdown PostSection__tag">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            Filtrar por categorias
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li>
                                <span onClick={getPosts} className="dropdown-item">Todos</span>
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
                {
                    (isSearching && posts.length > 0)
                    &&
                    <>
                        <div className="PostSection__alert-no-posts">
                            <p>Resultados de la busqueda: {search}</p>
                            <button className="PostSection__alert-button" onClick={getPosts}>Volver</button>
                        </div>
                        {
                            posts.map(post => (
                                <Post key={post._id} commentsLength={commentsLength} title={post.title} content={post.content} post={post} date={post.date} />
                            ))
                        }
                    </>
                }
                {
                    (isSearching && posts.length === 0)
                    &&
                    <div className="PostSection__alert-no-posts">
                        <p>No se encontraron resultados con la busqueda: {search}</p>
                        <button className="PostSection__alert-button" onClick={getPosts}>Volver</button>
                    </div>
                }
                {
                    !isSearching &&
                    posts.map(post => (
                        <Post key={post._id} commentsLength={commentsLength} title={post.title} content={post.content} post={post} date={post.date} />
                    ))
                }
            </div>

            {
                postSelected && <ModalPost />
            }
            {
                posts.length !== 0 &&
                <button onClick={showMorePosts} className="btn PostSection__loadmore">
                    + Cargar más publicaciones
                </button>
            }

        </>
    )
}

export default PostSection
