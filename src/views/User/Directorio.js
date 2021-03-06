import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useStateValue } from '../../StateProvider'
import Footer from '../../components/User/Footer'
import NavbarProfile from '../../components/User/NavbarProfile'
import SpinnerComponent from '../../components/User/SpinnerComponent'
import WhatsappBtn from '../../components/User/WhatsappBtn'
import Banner from '../../components/User/Banner'
import './Directorio.css'
import { apiURL } from '../../config/api'

const Directorio = () => {
    const [{ token }] = useStateValue()
    let headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const [users, setUsers] = useState([])
    const [form, setForm] = useState({
        search: ''
    })
    const { search } = form
    const [typeOrder, setTypeOrder] = useState('antiguos')
    const [loading, setLoading] = useState(false)

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

    const reverseUsers = (arr) => {
        return arr.sort((a, b) => {
            return new Date(b.date).getTime()
                - new Date(a.date).getTime()
        })
    }

    const orderUsers = (arr) => {
        return arr.sort((a, b) => {
            return new Date(a.date).getTime()
                - new Date(b.date).getTime()
        })
    }

    const getEmployees = async () => {
        setLoading(true)
        await axios.get(`${apiURL}/usuarios`, { headers })
            .then(resp => {
                if (typeOrder === 'alfabetico') {
                    setUsers(sortGreatest(resp.data.usuarios))
                } else if ((typeOrder === 'antiguos')) {
                    setUsers(orderUsers(resp.data.usuarios))
                } else if (typeOrder === 'recientes') {
                    setUsers(reverseUsers(resp.data.usuarios))
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
        await axios.get(`${apiURL}/usuarios`, { headers })
            .then(resp => {
                setUsers(resp.data.usuarios.filter(user => user.nombre.toLowerCase().includes(search.toLowerCase())))
            })
    }


    return (
        <>
            <NavbarProfile />
            <Banner image={'/assets/banner-directorio.jpg'} title={'Directorio de usuarios'} content={'Encontr?? aqu?? a todos los colaboradores de DPM'} linkto={'directorio'} />
            <div className="Directorio__search">
                <form id="directorio" onSubmit={handleSubmit}>
                    <input value={search} name="search" onChange={handleInputChange} type="text" className="Directorio__search-input" placeholder="Busca un colaraborador/a por nombre" />
                    <i className="fas fa-search Directorio__search-icon"></i>
                </form>
                <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        {typeOrder === 'alfabetico' && 'Ordenar alfabeticamente'}
                        {typeOrder === 'recientes' && 'M??s recientes'}
                        {typeOrder === 'antiguos' && 'M??s antiguos'}
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li onClick={() => setTypeOrder('alfabetico')} className="dropdown-item">Ordenar alfabeticamente</li>
                        <li onClick={() => setTypeOrder('recientes')} className="dropdown-item">M??s recientes</li>
                        <li onClick={() => setTypeOrder('antiguos')} className="dropdown-item">M??s antiguos</li>
                    </ul>
                </div>
            </div>

            <ul className="Directorio__list">

                <li className="Directorio__list-header">
                    <span>Nombre y apellido</span>
                    <span>Cargo</span>
                    <span>Sector</span>
                    <span>Telefono</span>
                    <span>Correo</span>
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
                            <li key={user._id} className="Directorio__list-control">
                                <Link to={`/directorio/profile/${user._id}`} className="Directorio__list-control-section name">
                                    {user.image ? <img className="profile-image-small" src={user.image} /> : <i className="far fa-user no-image-profile-small"></i>}
                                    {user.nombre} {user.apellido}
                                </Link>
                                <div className="Directorio__list-control-section">
                                    {user.position}
                                </div>
                                <div className="Directorio__list-control-section">
                                    {user.sector}
                                </div>
                                <div className="Directorio__list-control-section">
                                    {user.phone}
                                </div>
                                <div className="Directorio__list-control-section">
                                    {user.correo}
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </ul>
            <WhatsappBtn />
            <Footer />
        </>
    )
}

export default Directorio
