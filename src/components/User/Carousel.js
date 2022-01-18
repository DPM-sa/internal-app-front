import React from 'react'
import { Carousel as CarouselBt } from 'react-bootstrap'
import './Carousel.css'
import { useGetSliders } from '../../hooks/useGetSliders'

const Carousel = () => {
    const { slider } = useGetSliders()

    return (
        <CarouselBt fade>
            {
                slider.map(item => (
                    <CarouselBt.Item key={item._id}>
                        <img
                            className="d-block w-100 carousel-img"
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
