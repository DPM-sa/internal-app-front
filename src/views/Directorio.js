import axios from 'axios'
import React, { useEffect, useState, useMemo } from 'react'
import NavbarProfile from '../components/NavbarProfile'
import { useStateValue } from '../StateProvider'
import { Modal } from 'react-bootstrap'
import Footer from '../components/Footer'
import './Directorio.css'
import SpinnerComponent from '../components/SpinnerComponent'
const Directorio = () => {
    const [{ token }] = useStateValue()

    const [users, setUsers] = useState([])

    const [form, setForm] = useState({
        search: ''
    })
    const { search } = form

    const [user, setUser] = useState(null)
    const [typeOrder, setTypeOrder] = useState('alfabetico')
    const [loading, setLoading] = useState(false)
    let headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }
    function sortGreatest(arr) {
        for (let i = 0; i < arr.length; i++) {
            for (let j = i; j < arr.length; j++) {
                if (arr[i].nombre.toLowerCase() > arr[j].nombre.toLowerCase()) {
                    let temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                };
            };
        };
        return arr;
    };
    const reversed = (arr) => {
        return arr.reverse()
    }
    const getEmployees = async () => {
        setLoading(true)
        await axios.get(`https://internal-app-dpm.herokuapp.com/usuarios`, { headers })
            .then(resp => {
                if (typeOrder === 'alfabetico') {
                    console.log(resp.data.usuarios)
                    setUsers(sortGreatest(resp.data.usuarios))
                } else if (typeOrder === 'antiguos') {
                    setUsers(resp.data.usuarios)
                } else if (typeOrder === 'recientes') {
                    setUsers(reversed(resp.data.usuarios))
                }
                setLoading(false)
            })
    }

    useEffect(() => {
        getEmployees()
    }, [typeOrder])

    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        await axios.get(`https://internal-app-dpm.herokuapp.com/usuarios`, { headers })
            .then(resp => {
                setUsers(resp.data.usuarios.filter(user => user.nombre.toLowerCase().includes(search.toLowerCase())))
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
            <div className="Directorio__banner">
                <img className="Directorio__banner-img" src="./assets/banner-directorio.jpg" />
                <div className="Directorio__banner-content">
                    <h1>Directorio de usuarios</h1>
                    <p>Encontra aqui a todos los colaboradores de DPM</p>
                    <button className="Directorio__banner-button">+ Ver más</button>
                </div>
            </div>
            <div className="Directorio__search">
                <form onSubmit={handleSubmit}>
                    <input value={search} name="search" onChange={handleInputChange} type="text" className="Directorio__search-input" placeholder="Busca un colaraborador/a por nombre" />
                    <i className="fas fa-search Directorio__search-icon"></i>
                </form>
                <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        {typeOrder === 'alfabetico' && 'Ordenar alfabeticamente'}
                        {typeOrder === 'recientes' && 'Más recientes'}
                        {typeOrder === 'antiguos' && 'Más antiguos'}
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li onClick={() => setTypeOrder('alfabetico')} className="dropdown-item">Ordenar alfabeticamente</li>
                        <li onClick={() => setTypeOrder('recientes')} className="dropdown-item">Más recientes</li>
                        <li onClick={() => setTypeOrder('antiguos')} className="dropdown-item">Más antiguos</li>
                    </ul>
                </div>
            </div>

            <ul className="Directorio__list">

                <li className="Directorio__list-header">
                    <span className="Directorio__list-header-section">Nombre y apellido</span>
                    <span className="Directorio__list-header-section">Cargo</span>
                    <span className="Directorio__list-header-section">Sector</span>
                </li>
                <ul className="Directorio__list-body">
                    {
                        loading && <SpinnerComponent />
                    }
                    {
                        (!loading && users.length === 0)
                        &&
                        <li className="Directorio__list-control">
                            No existen usuarios con ese nombre
                        </li>
                    }
                    {
                        !loading && users.map(user => (
                            <li key={user._id} className="Directorio__list-control" onClick={() => handleClick(user)}>
                                <div className="Directorio__list-control-section name">
                                    {user.image ? <img className="Directorio__list-image" src={user.image} /> : <i class="far fa-user Directorio__user-no-image"></i>}
                                    {user.nombre} {user.apellido}
                                </div>
                                <div className="Directorio__list-control-section charge">
                                    Cargo
                                </div>
                                <div className="Directorio__list-control-section sector">
                                    Sector
                                </div>
                            </li>
                        ))
                    }
                </ul>
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
            <Footer />
        </>
    )
}

export default Directorio
