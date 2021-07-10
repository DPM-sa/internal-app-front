import React, { useEffect, useState } from 'react'
import { useStateValue } from '../StateProvider'
import { Modal } from 'react-bootstrap'
import { useHistory, useParams } from 'react-router-dom'
import axios from 'axios'
import './ModalPost.css'
const ModalSlider = () => {

    const [{ token }] = useStateValue()

    const history = useHistory()
    const { id } = useParams()

    const [slider, setSlider] = useState({})

    const headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }

    const getSlider = async () => {
        await axios.get(`https://internal-app-dpm.herokuapp.com/slider/${id}`, { headers })
            .then(resp => {
                setSlider(resp.data.slider)
            })
    }

    useEffect(() => {
        getSlider()
    }, [])

    const handleClose = () => {
        history.push('/home')
    }

    return (
        <Modal size="lg" className="ModalPost" show={true} onHide={handleClose}>
            <Modal.Header closeButton>
                <img src={slider.image} className="ModalPost__header-img" />
                <div className="ModalPost__header-content">
                    <h4>{slider.title}</h4>
                    <p>{slider.content}</p>
                </div>
            </Modal.Header>
            <Modal.Body className="ModalPost__content">
                <p className="ModalPost__content-text">{slider.content}</p>
            </Modal.Body>
        </Modal>
    )
}

export default ModalSlider
