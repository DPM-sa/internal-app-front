import React, { useEffect } from 'react'
import NavbarProfile from '../components/NavbarProfile'
import Carousel from '../components/Carousel'
import PostSection from '../components/PostSection'
import Options from '../components/Options'
import SearchBar from '../components/SearchBar'
import Footer from '../components/Footer'
import WhatsappBtn from '../components/WhatsappBtn'

const Home = () => {

    return (
        <>
            <NavbarProfile />
            <Carousel />
            <SearchBar />
            <PostSection />
            <Options />
            <WhatsappBtn />
            <Footer />
        </>
    )
}

export default Home
