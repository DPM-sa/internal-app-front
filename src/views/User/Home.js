import React from 'react'
import NavbarProfile from '../../components/User/NavbarProfile'
import Carousel from '../../components/User/Carousel'
import PostSection from '../../components/User/PostSection'
import Options from '../../components/User/Options'
import SearchBar from '../../components/User/SearchBar'
import Footer from '../../components/User/Footer'
import WhatsappBtn from '../../components/User/WhatsappBtn'

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
