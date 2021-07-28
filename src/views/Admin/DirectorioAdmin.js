import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import SidebarAdmin from '../../components/Admin/SidebarAdmin'
import { storage } from '../../config/firebase'
import { useStateValue } from '../../StateProvider'

const DirectorioAdmin = () => {
    const history = useHistory()

    const [{ token, editOrNewUser }] = useStateValue()
    const headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }
    const [users, setUsers] = useState([])
    const [loadingUsers, setLoadingUsers] = useState(false)
    const [usersQuantity, setUsersQuantity] = useState(0)
    const [usersActive, setUsersActive] = useState(0)
    const [usersInactive, setUsersInactive] = useState(0)

    const getUsers = async () => {
        setLoadingUsers(true)
        await axios.get(`https://internal-app-dpm.herokuapp.com/allusuarios`, { headers })
            .then(resp => {
                let usersActiveArr = resp.data.usuarios.filter(user => user.estado)
                let usersInactiveArr = resp.data.usuarios.filter(user => !user.estado)
                setUsersQuantity(resp.data.cuantos)
                setUsersActive(usersActiveArr.length)
                setUsersInactive(usersInactiveArr.length)
                if (typeOrder === 'alfabetico') {
                    setUsers(sortGreatest(resp.data.usuarios))
                } else if ((typeOrder === 'antiguos')) {
                    setUsers(orderUsers(resp.data.usuarios))
                } else if (typeOrder === 'recientes') {
                    setUsers(reverseUsers(resp.data.usuarios))
                }
                setLoadingUsers(false)
            })
    }

    const [form, setForm] = useState({
        search: ''
    })
    const { search } = form
    const [typeOrder, setTypeOrder] = useState('antiguos')
    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        await axios.get(`https://internal-app-dpm.herokuapp.com/allusuarios`, { headers })
            .then(resp => {
                setUsers(resp.data.usuarios.filter(user => user.nombre.toLowerCase().includes(search.toLowerCase())))
            })
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

    useEffect(() => {
        getUsers()
    }, [editOrNewUser, typeOrder])

    const renderTooltipSee = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Ver usuario
        </Tooltip>
    );
    const renderTooltipEdit = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Editar usuario
        </Tooltip>
    );
    const renderTooltipHide = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Ocultar usuario
        </Tooltip>
    );
    const renderTooltipDelete = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Eliminar usuario
        </Tooltip>
    );
    const handleEditUser = async (user, action) => {
        if (user.estado && action === "ver") return
        if (!user.estado && action === "ocultar") return
        if (action === 'ver') {
            Swal.fire({
                title: 'Deseas activar este usuario?',
                showCloseButton: true,
                showCancelButton: true,
                focusConfirm: false,
                confirmButtonText:
                    'Activar',
                cancelButtonText:
                    'Cancelar'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await axios.put(`https://internal-app-dpm.herokuapp.com/usuario/${user._id}`,
                        {
                            "estado": !user.estado
                        }, { headers })
                        .then(() => {
                            getUsers()
                        })
                }
            })
        } else if (action === 'ocultar') {
            Swal.fire({
                title: 'Deseas inactivar este usuario?',
                showCloseButton: true,
                showCancelButton: true,
                focusConfirm: false,
                confirmButtonText:
                    'Inactivar',
                cancelButtonText:
                    'Cancelar'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await axios.put(`https://internal-app-dpm.herokuapp.com/usuario/${user._id}`,
                        {
                            "estado": !user.estado
                        }, { headers })
                        .then(() => {
                            getUsers()
                        })
                }
            })
        }
    }

    const handleDeleteUser = async (user) => {
        Swal.fire({
            title: 'Deseas eliminar este usuario?',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText:
                'Eliminar',
            cancelButtonText:
                'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!user.image || user.image === "") {
                    await axios.delete(`https://internal-app-dpm.herokuapp.com/usuario/${user._id}`, { headers })
                        .then(() => {
                            getUsers()
                        })
                } else if (user.image || user.image !== "") {
                    const storageRef = storage.ref().child('profileImages').child(`${user.fileId}`)
                    storageRef.delete().then(async () => {
                        await axios.delete(`https://internal-app-dpm.herokuapp.com/usuario/${user._id}`, { headers })
                            .then(() => {
                                getUsers()
                            })
                    })
                }
            }
        })
    }
    const editUser = (id) => {
        history.push(`directorioadmin/edituser/${id}`)
    }
    return (
        <>
            <SidebarAdmin />
            <div className="PostsAdmin">
                <div className="PostsAdmin-container">
                    <h1>Directorio de usuarios</h1>
                    <div className="PostsAdmin-content">
                        <div className="PostsAdmin-content-actions">
                            <Link to="/directorioadmin/nuevousuario" className="PostsAdmin-content-actions-item">
                                <span>+</span>
                                <p>Crear un nuevo usuario</p>
                            </Link>
                            <div className="PostsAdmin-content-actions-item">
                                <span>{usersQuantity}</span>
                                <p>Usuarios creados</p>
                            </div>
                            <div className="PostsAdmin-content-actions-item">
                                <span>{usersActive}</span>
                                <p>Usuarios activos</p>
                            </div>
                            <div className="PostsAdmin-content-actions-item">
                                <span>{usersInactive}</span>
                                <p>Usuarios inactivos</p>
                            </div>
                        </div>
                        <div className="PostsAdmin-posts">
                            <div className="Directorio__search">
                                <form id="directorio" onSubmit={handleSubmit}>
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
                            <ul className="PostsAdmin-posts-list">
                                <li className="PostsAdmin-posts-list-header">
                                    <span>Usuario</span>
                                    <span>Nombre y apellido</span>
                                    <span>Acciones</span>
                                </li>
                                <ul className="PostsAdmin-posts-list-body">
                                    {
                                        loadingUsers &&
                                        <li>Cargando...</li>
                                    }
                                    {
                                        !loadingUsers &&
                                        users.map(user => (
                                            <li key={user._id} className="PostsAdmin-posts-list-control">
                                                <span>{user.user}</span>
                                                <span>{user.nombre} {user.apellido}</span>
                                                <span className="posts-lists-control-actions">
                                                    <OverlayTrigger
                                                        placement="top"
                                                        delay={{ show: 100, hide: 100 }}
                                                        overlay={renderTooltipSee}
                                                    >
                                                        <i
                                                            onClick={() => handleEditUser(user, 'ver')}
                                                            className={user.estado ? 'button-watch-post disabled far fa-eye' : 'button-watch-post far fa-eye'}
                                                        ></i>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger
                                                        placement="top"
                                                        delay={{ show: 100, hide: 100 }}
                                                        overlay={renderTooltipEdit}
                                                    >
                                                        <i onClick={() => editUser(user._id)} class="fas fa-pen"></i>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger
                                                        placement="top"
                                                        delay={{ show: 100, hide: 100 }}
                                                        overlay={renderTooltipHide}
                                                    >
                                                        <i
                                                            onClick={() => handleEditUser(user, 'ocultar')}
                                                            className={user.estado
                                                                ? 'button-watch-hidden fas fa-eye-slash'
                                                                : 'button-watch-hidden disabled fas fa-eye-slash'
                                                            }
                                                        ></i>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger
                                                        placement="top"
                                                        delay={{ show: 100, hide: 100 }}
                                                        overlay={renderTooltipDelete}
                                                    >
                                                        <i
                                                            onClick={() => handleDeleteUser(user)}
                                                            class="fas fa-trash-alt"
                                                        ></i>
                                                    </OverlayTrigger>
                                                </span>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DirectorioAdmin
