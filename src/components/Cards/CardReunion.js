import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import { cancelarReservaSala, eliminarReservaSala } from '../../services/api';


const renderTooltipEdit = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        Editar reunion
    </Tooltip>
);

const renderTooltipCancelar = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        cancelar reunion
    </Tooltip>
);

const renderTooltipDelete = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        Eliminar reunion
    </Tooltip>
);



export const CardReunion = ({
    item,
    handleRefresh = () => { }
}) => {

    const history = useHistory()

    const handleDesactivar = () => {
        cancelarReservaSala({ ...item, habilitado: false })
            .then(() => {
                Swal.fire('Éxito', 'La reunion se ha cancelado con éxito', 'success')
                    .then(() => handleRefresh())
            })
            .catch(() => {
                Swal.fire('Error', 'Ha ocurrido un error, comuníquese con el administrador', 'error')
            })
    }

    const handleEliminar = () => {
        eliminarReservaSala(item._id)
            .then(() => {
                Swal.fire('Éxito', 'La reunion se ha eliminado con éxito', 'success')
                    .then(() => handleRefresh())
            })
            .catch(() => {
                Swal.fire('Error', 'Ha ocurrido un error, comuníquese con el administrador', 'error')
            })
    }




    return (
        <div key={item._id} className="BibliotecaAdmin-file cards">
            <i className="far fa-file-alt Biblioteca__file-icon"></i>
            <p>{item.nombrereunion}</p>
            <div className="BibliotecaAdmin-file-actions cards">

                <OverlayTrigger
                    placement="top"
                    delay={{ show: 100, hide: 100 }}
                    overlay={renderTooltipEdit}
                >
                    <i
                        onClick={() => history.push(`/reunionesadmin/editreunion/${item?._id}`)}
                        className="fas fa-pen"></i>
                </OverlayTrigger>


                <OverlayTrigger
                    placement="top"
                    delay={{ show: 100, hide: 100 }}
                    overlay={renderTooltipDelete}
                >
                    <i
                        onClick={() => handleEliminar(item)}
                        className="fas fa-trash-alt"
                    ></i>
                </OverlayTrigger>

                {item.habilitado &&
                    <OverlayTrigger
                        placement="top"
                        delay={{ show: 100, hide: 100 }}
                        overlay={renderTooltipCancelar}
                    >
                        <i
                            onClick={() => handleDesactivar(item)}
                            className="fas fa-ban"
                        ></i>
                    </OverlayTrigger>}

            </div>
        </div>
    )
}
