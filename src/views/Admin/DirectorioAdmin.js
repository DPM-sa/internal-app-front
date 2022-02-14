import React, { useState } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import SidebarAdmin from '../../components/Admin/SidebarAdmin'
import { storage } from '../../config/firebase'
import { useStateValue } from '../../StateProvider'
import * as api from '../../services/api'
import './DirectorioAdmin.css'
import { useGetAllUsers } from '../../hooks/useGetAllUsers'
import * as swalAlerts from '../../alerts/SwalAlerts'
import { CardInfo } from '../../components/Cards/CardInfo'

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

const DirectorioAdmin = () => {
    const history = useHistory()
    const [{ editOrNewUser }] = useStateValue()
    const [typeOrder, setTypeOrder] = useState('antiguos')
    const { users, loadingUsers, usersQuantity, usersActive, usersInactive,
        setUsers, getUsers } = useGetAllUsers(editOrNewUser, typeOrder)
    const [form, setForm] = useState({ search: '' })

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        api.getAllUsers()
            .then(resp => {
                setUsers(resp.data.usuarios.filter(user => user.nombre.toLowerCase().includes(form.search.toLowerCase())))
            })
    }

    const handleEditUser = async (user, action) => {
        if (user.estado && action === "ver") return
        if (!user.estado && action === "ocultar") return
        if (action === 'ver') {
            swalAlerts
                .activar('usuario')
                .then((result) => {
                    if (result.isConfirmed) {
                        api.editUser({ "estado": !user.estado }, user._id).then(() => getUsers())
                    }
                })
        } else if (action === 'ocultar') {
            swalAlerts
                .desactivar('usuario')
                .then((result) => {
                    if (result.isConfirmed) {
                        api.editUser({ "estado": !user.estado }, user._id).then(() => getUsers())
                    }
                })
        }
    }

    const handleDeleteUser = async (user) => {
        swalAlerts
            .eliminar('usuario')
            .then(async (result) => {
                if (result.isConfirmed) {
                    if (!user.image || user.image === "") {
                        api.deleteUser(user._id)
                            .then(() => {
                                getUsers()
                            })
                    } else {
                        const storageRef = storage.ref().child('profileImages').child(`${user.fileId}`)
                        storageRef.delete()
                            .then(() => {
                                api.deleteUser(user._id)
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
                            <CardInfo title="Usuarios creados" value={usersQuantity} />
                            <CardInfo title="Usuarios activos" value={usersActive} />
                            <CardInfo title="Usuarios inactivos" value={usersInactive} />
                        </div>
                        <div className="PostsAdmin-posts">

                            <div className="Directorio__search">
                                <form id="directorio" onSubmit={handleSubmit}>
                                    <input value={form.search} name="search" onChange={handleInputChange} type="text" className="Directorio__search-input" placeholder="Busca un colaraborador/a por nombre" />
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
                                    {loadingUsers ?
                                        <li>Cargando...</li>
                                        :
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
                                                        <i onClick={() => editUser(user._id)} className="fas fa-pen"></i>
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
                                                            className="fas fa-trash-alt"
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
