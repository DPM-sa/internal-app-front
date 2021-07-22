import React from 'react'
import { Spinner } from 'react-bootstrap'
import './SpinnerComponent.css'

const SpinnerComponent = () => {
    return (
        <div className="Spinner">
            <Spinner animation="border" />
        </div>
    )
}

export default SpinnerComponent
