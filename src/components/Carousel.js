import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useStateValue } from '../StateProvider'
import { Carousel as CarouselBt } from 'react-bootstrap'
import './Carousel.css'

const Carousel = () => {
    const [{ token }] = useStateValue()
    const [slider, setSlider] = useState([])
    useEffect(() => {
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
                            alt="First slide"
                        />
                        <CarouselBt.Caption>
                            <h3>{item.title}</h3>
                            <p>{item.content}</p>
                            <button className="btn btn-primary">Ver más</button>
                        </CarouselBt.Caption>
                    </CarouselBt.Item>
                ))
            }
        </CarouselBt>
    )
}

export default Carousel
