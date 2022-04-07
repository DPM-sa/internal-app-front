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
        Ver sala
    </Tooltip>
);

const renderTooltipEdit = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        Editar sala
    </Tooltip>
);

const renderTooltipHide = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        Ocultar sala
    </Tooltip>
);

const renderTooltipDelete = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        Eliminar sala
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


    const handleEditComedor = async (sala, action) => {
        if (sala.habilitado && action === "ver") return
        if (!sala.habilitado && action === "ocultar") return
        if (action === 'ver') {
            swalAlerts
                .activar('sala')
                .then((result) => {
                    if (result.isConfirmed) {
                        api.editSala({ ...sala, "habilitado": true }, sala._id).then(() => getSalas())
                    }
                })
        } else if (action === 'ocultar') {
            swalAlerts
                .desactivar('sala')
                .then((result) => {
                    if (result.isConfirmed) {
                        api.editSala({ ...sala, "habilitado": false }, sala._id).then(() => getSalas())
                    }
                })
        }
    }

    const handleDeleteSala = (sala) => {
        swalAlerts
            .eliminar('sala')
            .then(() => {
                api.deleteSala(sala._id)
                    .then(() => {
                        getSalas()
                    })
            })
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
                                                        overlay={renderTooltipEdit}
                                                    >
                                                        <i
                                                            onClick={() => handleEdit(sala._id)}
                                                            className="fas fa-pen"
                                                        />
                                                    </OverlayTrigger>

                                                    {sala.habilitado ?
                                                        <OverlayTrigger
                                                            placement="top"
                                                            delay={{ show: 100, hide: 100 }}
                                                            overlay={renderTooltipHide}
                                                        >
                                                            <i
                                                                onClick={() => handleEditComedor(sala, 'ocultar')}
                                                                className={sala.habilitado
                                                                    ? 'button-watch-hidden fas fa-eye-slash'
                                                                    : 'button-watch-hidden disabled fas fa-eye-slash'
                                                                }
                                                            />
                                                        </OverlayTrigger>
                                                        :
                                                        <OverlayTrigger
                                                            placement="top"
                                                            delay={{ show: 100, hide: 100 }}
                                                            overlay={renderTooltipSee}
                                                        >
                                                            <i
                                                                onClick={() => handleEditComedor(sala, 'ver')}
                                                                className={sala.habilitado ? 'button-watch-post disabled far fa-eye' : 'button-watch-post far fa-eye'}
                                                            />
                                                        </OverlayTrigger>


                                                    }
                                                    
                                                    <OverlayTrigger
                                                        placement="top"
                                                        delay={{ show: 100, hide: 100 }}
                                                        overlay={renderTooltipDelete}
                                                    >
                                                        <i 
                                                            onClick={() => handleDeleteSala(sala)} 
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
