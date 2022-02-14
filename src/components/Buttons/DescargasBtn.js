import React from 'react'

export const DescargasBtn = ({ title, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="descargas-btn"
        >
            <p>{title}</p>
            <i className="fa fa-arrow-down"></i>
        </button>
    )
}
