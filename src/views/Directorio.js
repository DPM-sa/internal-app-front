import axios from 'axios'
import React, { useEffect, useState } from 'react'
import NavbarProfile from '../components/NavbarProfile'
import { useStateValue } from '../StateProvider'
import { Modal } from 'react-bootstrap'
import './Directorio.css'
const Directorio = () => {
    const [{ token }] = useStateValue()
    const [users, setUsers] = useState([])
    const [form, setForm] = useState({
        search: ''
    })
    const [user, setUser] = useState(null)
    const { search } = form
    const headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }
    useEffect(() => {
        const getEmployees = async () => {
            await axios.get(`https://internal-app-dpm.herokuapp.com/usuarios`, { headers })
                .then(resp => {
                    setUsers(resp.data.usuarios)
                })
        }
        getEmployees()
    }, [])
    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        await axios.get(`https://internal-app-dpm.herokuapp.com/users/buscar/${search}`, { headers })
            .then(resp => {
                setUsers(resp.data.userDB)
            })
    }
    const handleClick = (user) => {
        setUser(user)
    }
    const handleClose = () => {
        setUser(null)
    }
    return (
        <>
            <NavbarProfile />
            <div className="Directorio__search">
                <form onSubmit={handleSubmit}>
                    <input value={search} name="search" onChange={handleInputChange} type="text" className="Directorio__search-input" placeholder="Busca un colaraborador/a por nombre" />
                    <i className="fas fa-search Directorio__search-icon"></i>
                </form>
                <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        Ordenar alfabeticamente
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li><a className="dropdown-item" href="#">Más recientes</a></li>
                        <li><a className="dropdown-item" href="#">Más antiguos</a></li>
                    </ul>
                </div>
            </div>
            <ul className="Directorio__list">
                <div className="Directorio__list-header">
                    <span className="Directorio__list-header-section">Nombre y apellido</span>
                    <span className="Directorio__list-header-section">Cargo</span>
                    <span className="Directorio__list-header-section">Sector</span>
                </div>
                {
                    users.map(user => (
                        <div key={user._id} className="Directorio__list-control" onClick={() => handleClick(user)}>
                            <div className="Directorio__list-control-section name">
                                {user.image ? <img className="Directorio__list-image" src="./assets/no-image.jpg" /> : <i class="far fa-user Directorio__user-no-image"></i>}
                                {user.nombre} {user.apellido}
                            </div>
                            <div className="Directorio__list-control-section charge">
                                Cargo
                            </div>
                            <div className="Directorio__list-control-section sector">
                                Sector
                            </div>
                        </div>
                    ))
                }
            </ul>
            <Modal show={user} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Usuario</Modal.Title>
                </Modal.Header>
                {user &&
                    <Modal.Body className="modalBody">
                        <img src="./assets/no-image.jpg" className="modalBody__img" />
                        <h5>{user.nombre} {user.apellido}</h5>
                    </Modal.Body>
                }
            </Modal>
        </>
    )
}

export default Directorio
