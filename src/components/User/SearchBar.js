import React, { useEffect, useState } from 'react'
import { useStateValue } from '../../StateProvider'
import axios from 'axios'
import './SearchBar.css'

const SearchBar = () => {
    const [{ token, posts }, dispatch] = useStateValue()
    const [tags, setTags] = useState([])

    const [form, setForm] = useState({
        search: ""
    })
    const { search } = form

    const headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }

    const getTags = async () => {
        await axios.get('https://internal-app-dpm.herokuapp.com/tags', { headers })
            .then(resp => {
                setTags(resp.data.arrayWithoutRepeatedTags)
            })
    }

    useEffect(() => {
        getTags()
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        let searchLowerCase = search.toLowerCase()
        dispatch({
            type: 'SEARCHING_POST',
            searching: search
        })
        getPostsBySearching(searchLowerCase)
        setForm({
            search: ''
        })
    }

    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
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

    const orderPosts = () => {
        dispatch({
            type: "SET_POSTS",
            posts: posts.sort((a, b) => {
                return new Date(b.date).getTime() -
                    new Date(a.date).getTime()
            })
        })
    }

    const getPostsBySearching = async (search) => {
        await axios.get(`https://internal-app-dpm.herokuapp.com/posts`, { headers })
            .then(resp => {
                dispatch({
                    type: "SET_POSTS",
                    posts: resp.data.posts.filter(post => post.title.toLowerCase().includes(search))
                })
            })
    }

    const getPostsByTag = async (tag) => {
        await axios.get(`https://internal-app-dpm.herokuapp.com/posts`, { headers })
            .then(resp => {
                dispatch({
                    type: "SET_POSTS",
                    posts: resp.data.posts.filter(post => {
                        return (post.tags.indexOf(tag) >= 0)
                    })
                })
            })
    }
    const getPosts = async () => {
        await axios.get(`https://internal-app-dpm.herokuapp.com/posts`, { headers })
            .then(resp => {
                dispatch({
                    type: "SET_POSTS",
                    posts: resp.data.posts
                })
            })
    }
    const searchByTag = async (tag) => {
        dispatch({
            type: 'SEARCHING_POST',
            searching: ''
        })
        if (tag === 'Todos') {
            getPosts()
        } else {
            getPostsByTag(tag)
        }
    }
    return (
        <div className="SearchBar">
            <form onSubmit={handleSubmit} className="SearchBar__form">
                <input value={search} name="search" onChange={handleInputChange} className="SearchBar__form-input" placeholder="Busca un post por título" type="text" />
                <i className="fas fa-search"></i>
            </form>
            <div className="SearchBar__filters">
                <div className="dropdown SearchBar__filters-date">
                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        Ordenar por más nuevos
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li onClick={orderPosts} className="dropdown-item">Más recientes</li>
                        <li onClick={reversePosts} className="dropdown-item">Más antiguos</li>
                    </ul>
                </div>
                <div className="dropdown SearchBar__filters-tag">
                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        Filtrar por categorias
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li>
                            <span onClick={() => searchByTag('Todos')} className="dropdown-item">Todos</span>
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
    )
}

export default SearchBar
