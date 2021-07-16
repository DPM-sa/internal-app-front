import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useStateValue } from '../StateProvider'
import { Carousel as CarouselBt } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import './Carousel.css'

const Carousel = () => {
    const [{ token }] = useStateValue()
    const [slider, setSlider] = useState([])

    const headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }

    const getSlider = async () => {
        await axios.get('https://internal-app-dpm.herokuapp.com/sliders', { headers })
            .then(resp => {
                setSlider(resp.data.slidersDB)
            })
    }

    useEffect(() => {
        getSlider()
    }, [])

    return (
        <CarouselBt fade>
            {
                slider.map(item => (
                    <CarouselBt.Item key={item._id}>
                        <img
                            className="d-block w-100"
                            src={item.image}
                        />
                        <CarouselBt.Caption>
                            <div className="Carousel-content">
                                <h3>{item.title}</h3>
                                <p>{item.content.substring(0, 100)}</p>
                                <a href={item.url} target="_blank" className="Carousel-btn">+ Ver más</a>
                            </div>
                        </CarouselBt.Caption>
                    </CarouselBt.Item>
                ))
            }
        </CarouselBt>
    )
}

export default Carousel
