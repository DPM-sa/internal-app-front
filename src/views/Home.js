import React from 'react'
import NavbarProfile from '../components/NavbarProfile'
import Carousel from '../components/Carousel'
import PostSection from '../components/PostSection'
import Options from '../components/Options'
import { useStateValue } from '../StateProvider'
import SpinnerComponent from '../components/SpinnerComponent'
const Home = () => {
    const [{ posts }] = useStateValue()
    return (
        <>
            <NavbarProfile />
            {
                posts.length > 0
                    ?
                    <>
                        <Carousel />
                        <PostSection />
                        <Options />
                    </>
                    : <SpinnerComponent />

            }

        </>
    )
}

export default Home
