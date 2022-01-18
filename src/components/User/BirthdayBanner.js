import React from 'react'
import './BirthdayBanner.css'



const BirthdayBanner = ({ dataString, isClose, handleClose }) => {

    if(isClose){
        return <></>
    }

    return (
        <div className="BirthdayBanner">
            <div className='close' onClick={handleClose}>X</div>
            <div className='scroll-text'>
                <span className='title'>Hoy cumplen años:</span>  
                {dataString} 
                <span className='title'>¡No olvides saludarlos!</span>
            </div>
        </div>
    )
}

export default BirthdayBanner
