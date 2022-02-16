import React from 'react'
import { Link as LinkScroll } from "react-scroll";
import './Banner.css'
const Banner = ({ image, title, content, linkto, link=true }) => {
    return (
        <div className="Banner">
            <img className="Banner-img" src={image} />
            <div className="Banner-content">
                <h1>{title}</h1>
                <p>{content}</p>
                {link && <LinkScroll to={linkto} className="Banner-button">+ Ver más</LinkScroll>}
            </div>
        </div>
    )
}

export default Banner
