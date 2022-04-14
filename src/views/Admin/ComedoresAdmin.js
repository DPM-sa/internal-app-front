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
import { useGetAllComedores } from '../../hooks/useGetAllComedores';
import { formatFecha } from '../../utils/helpers';
import { useGetInformesMensuales } from '../../hooks/useGetInformesMensuales';

const renderTooltipSee = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        Ver comedor
    </Tooltip>
);

const renderTooltipEdit = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        Editar comedor
    </Tooltip>
);

const renderTooltipHide = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        Ocultar comedor
    </Tooltip>
);

const renderTooltipDelete = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        Eliminar comedor
    </Tooltip>
);

const ComedoresAdmin = () => {
    const history = useHistory()
    const [{ editOrNewUser }] = useStateValue()
    const [typeOrder, setTypeOrder] = useState('antiguos')
    const {
        comedores,
        loadingComedores,
        getComedores
    } = useGetAllComedores(editOrNewUser, typeOrder)
    const { reservasTotales } = useGetInformesMensuales()


    const handleEditComedor = async (comedor, action) => {
        if (comedor.habilitado && action === "ver") return
        if (!comedor.habilitado && action === "ocultar") return
        if (action === 'ver') {
            swalAlerts
                .activar('comedor')
                .then((result) => {
                    if (result.isConfirmed) {
                        api.editComedor({ ...comedor, "habilitado": true }, comedor._id).then(() => getComedores())
                    }
                })
        } else if (action === 'ocultar') {
            swalAlerts
                .desactivar('comedor')
                .then((result) => {
                    if (result.isConfirmed) {
                        api.editComedor({ ...comedor, "habilitado": false }, comedor._id).then(() => getComedores())
                    }
                })
        }
    }

    const handleDeleteComedor = async (comedor) => {
        swalAlerts
            .eliminar('comedor')
            .then((result) => {
                if (result.isConfirmed) {
                    api.deleteComedor(comedor._id).then(() => getComedores())
                }
            })
    }

    const editComedor = (id) => {
        history.push(`comedoresadmin/edit/${id}`)
    }

    return (
        <>
            <SidebarAdmin />
            <div className="PostsAdmin">
                <div className="PostsAdmin-container">
                    <h1>Gestionar comedores</h1>
                    <div className="PostsAdmin-content">

                        <div className="PostsAdmin-content-actions">
                            <Link
                                to="/comedoresadmin/nuevo"
                                className="PostsAdmin-content-actions-item">
                                <span>+</span>
                                <p style={{ padding: 5 }}>Crear un nuevo comedor</p>
                            </Link>
                            <CardInfo title='Estadísticas de “02/2022”' />
                            <CardInfo title='Viandas solicitadas' value={reservasTotales} />
                            <CardInfo title='Turnos solicitados' value={0} />
                        </div>

                        <div className="PostsAdmin-posts">
                            <ul className="PostsAdmin-posts-list">
                                <li className="PostsAdmin-posts-list-header">
                                    <span>Comedor</span>
                                    <span>Fecha de creación</span>
                                    <span>Acciones</span>
                                </li>
                                <ul className="PostsAdmin-posts-list-body">
                                    {loadingComedores ? <li>Cargando...</li>
                                        : comedores.map(comedor => (
                                            <li key={comedor._id} className="PostsAdmin-posts-list-control">
                                                <span>{comedor.nombre}</span>
                                                <span>{formatFecha(comedor.date)}</span>
                                                <span className="posts-lists-control-actions">

                                                    <OverlayTrigger
                                                        placement="top"
                                                        delay={{ show: 100, hide: 100 }}
                                                        overlay={renderTooltipEdit}
                                                    >
                                                        <i onClick={() => editComedor(comedor._id)} className="fas fa-pen" />
                                                    </OverlayTrigger>

                                                    {comedor.habilitado ?

                                                        <OverlayTrigger
                                                            placement="top"
                                                            delay={{ show: 100, hide: 100 }}
                                                            overlay={renderTooltipHide}
                                                        >
                                                            <i
                                                                onClick={() => handleEditComedor(comedor, 'ocultar')}
                                                                className={comedor.habilitado
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
                                                                onClick={() => handleEditComedor(comedor, 'ver')}
                                                                className={comedor.habilitado ? 'button-watch-post disabled far fa-eye' : 'button-watch-post far fa-eye'}
                                                            />
                                                        </OverlayTrigger>

                                                    }

                                                    <OverlayTrigger
                                                        placement="top"
                                                        delay={{ show: 100, hide: 100 }}
                                                        overlay={renderTooltipDelete}
                                                    >
                                                        <i onClick={() => handleDeleteComedor(comedor)} className="fas fa-trash-alt" />
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

export default ComedoresAdmin
