import React, { useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import SidebarAdmin from '../../components/Admin/SidebarAdmin';
import { useStateValue } from '../../StateProvider';
import * as api from '../../services/api';
import './DirectorioAdmin.css';
import * as swalAlerts from '../../alerts/SwalAlerts';
import { CardInfo } from '../../components/Cards/CardInfo';
import { useGetAllSalas } from '../../hooks/useGetAllSalas';
import { formatFecha } from '../../utils/helpers';
import { useGetInformesMensuales } from '../../hooks/useGetInformesMensuales';

const renderTooltipSee = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        Ver reunión
    </Tooltip>
);

const renderTooltipEdit = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        Editar reunión
    </Tooltip>
);

const renderTooltipHide = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        Ocultar reunión
    </Tooltip>
);

const renderTooltipDelete = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        Eliminar reunión
    </Tooltip>
);

const SalaReunionesAdmin = () => {
    const history = useHistory()
    const [{ editOrNewUser }] = useStateValue()
    const [typeOrder, setTypeOrder] = useState('antiguos')
    const {
        salas,
        loadingSalas,
        getSalas
    } = useGetAllSalas(editOrNewUser, typeOrder)
    const { reservasTotales } = useGetInformesMensuales()


    const handleEditComedor = async (comedor, action) => {
        if (comedor.habilitado && action === "ver") return
        if (!comedor.habilitado && action === "ocultar") return
        if (action === 'ver') {
            swalAlerts
                .activar('comedor')
                .then((result) => {
                    if (result.isConfirmed) {
                        api.editComedor({ ...comedor, "habilitado": true }, comedor._id).then(() => getSalas())
                    }
                })
        } else if (action === 'ocultar') {
            swalAlerts
                .desactivar('comedor')
                .then((result) => {
                    if (result.isConfirmed) {
                        api.editComedor({ ...comedor, "habilitado": false }, comedor._id).then(() => getSalas())
                    }
                })
        }
    }

    const handleDeleteComedor = async (user) => {
        // swalAlerts
        //     .eliminarUsuario()
        //     .then(async (result) => {
        //         if (result.isConfirmed) {
        //             if (!user.image || user.image === "") {
        //                 api.deleteUser(user._id)
        //                     .then(() => {
        //                         getSalas()
        //                     })
        //             } else {
        //                 const storageRef = storage.ref().child('profileImages').child(`${user.fileId}`)
        //                 storageRef.delete()
        //                     .then(() => {
        //                         api.deleteUser(user._id)
        //                             .then(() => {
        //                                 getSalas()
        //                             })
        //                     })
        //             }
        //         }
        //     })
    }

    const handleEdit = (id) => {
        history.push(`reunionesadmin/edit/${id}`)
    }

    return (
        <>
            <SidebarAdmin />
            <div className="PostsAdmin">
                <div className="PostsAdmin-container">
                    <h1>Gestionar salas de reuniones</h1>
                    <div className="PostsAdmin-content">

                        <div className="PostsAdmin-content-actions">
                            <Link
                                to="/reunionesadmin/nuevo"
                                className="PostsAdmin-content-actions-item">
                                <span>+</span>
                                <p style={{ padding: 5 }}>Crear una nueva sala de reuniones</p>
                            </Link>
                            <CardInfo title='Estadísticas de “mm/aaaa”' />
                            <CardInfo title='Reuniones organizadas' value={reservasTotales} />
                            <CardInfo title='Asistentes a reuniones' value={0} />
                        </div>

                        <div className="PostsAdmin-posts">
                            <ul className="PostsAdmin-posts-list">
                                <li className="PostsAdmin-posts-list-header">
                                    <span>Sala de reuniones</span>
                                    <span>Fecha de creación</span>
                                    <span>Acciones</span>
                                </li>
                                <ul className="PostsAdmin-posts-list-body">
                                    {loadingSalas ? <li>Cargando...</li>
                                        : salas.map(sala => (
                                            <li key={sala._id} className="PostsAdmin-posts-list-control">
                                                <span>{sala.nombre}</span>
                                                <span>{formatFecha(sala.date)}</span>
                                                <span className="posts-lists-control-actions">

                                                    {/* TODO: refactorizar, codigo repetido */}
                                                    <OverlayTrigger
                                                        placement="top"
                                                        delay={{ show: 100, hide: 100 }}
                                                        overlay={renderTooltipSee}
                                                    >
                                                        <i
                                                           // onClick={() => handleEditComedor(comedor, 'ver')}
                                                            className={sala.habilitado ? 'button-watch-post disabled far fa-eye' : 'button-watch-post far fa-eye'}
                                                        />
                                                    </OverlayTrigger>

                                                    <OverlayTrigger
                                                        placement="top"
                                                        delay={{ show: 100, hide: 100 }}
                                                        overlay={renderTooltipEdit}
                                                    >
                                                        <i 
                                                             onClick={() => handleEdit(sala._id)} 
                                                            className="fas fa-pen" 
                                                        />
                                                    </OverlayTrigger>

                                                    <OverlayTrigger
                                                        placement="top"
                                                        delay={{ show: 100, hide: 100 }}
                                                        overlay={renderTooltipHide}
                                                    >
                                                        <i
                                                           // onClick={() => handleEditComedor(comedor, 'ocultar')}
                                                            className={sala.habilitado
                                                                ? 'button-watch-hidden fas fa-eye-slash'
                                                                : 'button-watch-hidden disabled fas fa-eye-slash'
                                                            }
                                                        />
                                                    </OverlayTrigger>

                                                    <OverlayTrigger
                                                        placement="top"
                                                        delay={{ show: 100, hide: 100 }}
                                                        overlay={renderTooltipDelete}
                                                    >
                                                        <i 
                                                            //onClick={() => handleDeleteComedor(comedor)} 
                                                            className="fas fa-trash-alt" />
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

export default SalaReunionesAdmin