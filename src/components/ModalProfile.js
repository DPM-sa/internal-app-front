import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import { useStateValue } from '../StateProvider'
import axios from 'axios'
import './ModalProfile.css'

const ModalProfile = () => {
    const [{ token }] = useStateValue()

    const history = useHistory()
    const { id } = useParams()

    const [user, setUser] = useState({})

    const headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }

    const getSlider = async () => {
        await axios.get(`https://internal-app-dpm.herokuapp.com/usuario/${id}`, { headers })
            .then(resp => {
                setUser(resp.data.user)
            })
    }

    useEffect(() => {
        getSlider()
    }, [])

    const handleClose = () => {
        history.goBack()
    }

    return (
        <Modal size="lg" className="ModalProfile" show={true} onHide={handleClose}>
            <Modal.Header closeButton>

            </Modal.Header>
            <Modal.Body>
                <div className="d-flex flex-column align-items-center text-center">
                    {user.image ? <img src={user.image} className="profile-image-medium rounded-circle" width="150" /> : <i class="far fa-user no-image-profile-medium"></i>}
                    <div className="mt-3">
                        <h4>{user.nombre} {user.apellido}</h4>
                        <p className="text-secondary mb-1">{user.position && user.position}</p>
                        <p className="text-muted font-size-sm">{user.sector && user.sector}</p>
                    </div>
                </div>
                <div className="Profile__data">
                    <div className="Profile__data-row">
                        <div><h6>User</h6></div>
                        <div><p>{user.user}</p></div>
                    </div>
                    <div className="Profile__data-row">
                        <div><h6>Nombre</h6></div>
                        <div><p>{user.nombre} {user.apellido}</p></div>
                    </div>
                    <div className="Profile__data-row">
                        <div>
                            <h6>Email</h6>
                        </div>
                        <div>
                            <p>{user.email && user.email}</p>
                        </div>
                    </div>
                    <div className="Profile__data-row">
                        <div><h6>Telefono</h6></div>
                        <div><p>{user.phone && user.phone}</p></div>
                    </div>
                    <div className="Profile__data-row">
                        <div><h6>Fecha de nacimiento</h6></div>
                        <div><p>{user.birth && user.birth}</p></div>
                    </div>
                    <div className="Profile__data-row">
                        <div><h6>Cargo</h6></div>
                        <div><p>{user.position && user.position}</p></div>
                    </div>
                    <div className="Profile__data-row">
                        <div><h6>Sector</h6></div>
                        <div><p>{user.sector && user.sector}</p></div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ModalProfile
