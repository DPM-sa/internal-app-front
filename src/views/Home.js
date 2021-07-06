import React from 'react'
import NavbarProfile from '../components/NavbarProfile'
import Carousel from '../components/Carousel'
import PostSection from '../components/PostSection'
import Options from '../components/Options'
import Footer from '../components/Footer'
const Home = () => {
    
    return (
        <>
            <NavbarProfile />
            <Carousel />
            <PostSection />
            <Options />
            <Footer />
        </>
    )
}

export default Home
