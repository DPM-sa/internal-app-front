import React, { useEffect } from 'react'
import NavbarProfile from '../components/NavbarProfile'
import Carousel from '../components/Carousel'
import PostSection from '../components/PostSection'
import Options from '../components/Options'
import SearchBar from '../components/SearchBar'
import Footer from '../components/Footer'
import { useStateValue } from '../StateProvider'
import axios from 'axios'

const Home = () => {
    const [{ user }, dispatch] = useStateValue()

    let headers = {
        'Content-Type': 'application/json'
    }
    const getToken = () => {
        axios.post('https://internal-app-dpm.herokuapp.com/renew',
            {
                "user": `${user.user}`
            },
            { headers }
        ).then(resp => {
            dispatch({
                type: 'LOGIN',
                token: resp.data.token,
                user: resp.data.usuario
            })
        })
    }

    useEffect(() => {
        if (user) {
            getToken()
        }
    }, [])
    return (
        <>
            <NavbarProfile />
            <Carousel />
            <SearchBar />
            <PostSection />
            <Options />
            <Footer />
        </>
    )
}

export default Home
