import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import { editViandabyId } from '../../services/api';


const renderTooltipSee = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        Habilitar vianda
    </Tooltip>
);
const renderTooltipEdit = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        Editar vianda
    </Tooltip>
);
const renderTooltipHide = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        Desactivar vianda
    </Tooltip>
);
// const renderTooltipDelete = (props) => (
//     <Tooltip id="button-tooltip" {...props}>
//         Eliminar vianda
//     </Tooltip>
// );



export const CardVianda = ({
    item,
    handleRefresh
}) => {

    const history = useHistory()

    const handleActivar = (id) => {
        editViandabyId({ ...item, habilitado: true }, id)
            .then(() => {
                Swal.fire('Éxito', 'La vianda se ha activado con éxito', 'success')
                    .then(() => handleRefresh())
            })
            .catch(() => {
                Swal.fire('Error', 'Ha ocurrido un error, comuníquese con el administrador', 'error')
            })
    }

    const handleDesactivar = (id) => {
        editViandabyId({ ...item, habilitado: false }, id)
            .then(() => {
                Swal.fire('Éxito', 'La vianda se ha desactivado con éxito', 'success')
                .then(() => handleRefresh())
            })
            .catch(() => {
                Swal.fire('Error', 'Ha ocurrido un error, comuníquese con el administrador', 'error')
            })
    }


    return (
        <div key={item._id} className="BibliotecaAdmin-file cards">
            <i className="far fa-file-alt Biblioteca__file-icon"></i>
            <p>{item.nombre}</p>
            <div className="BibliotecaAdmin-file-actions cards">
                {item.habilitado ?
                    <OverlayTrigger
                        placement="top"
                        delay={{ show: 100, hide: 100 }}
                        overlay={renderTooltipHide}
                    >
                        <i onClick={() => handleDesactivar(item._id)} className={'button-watch-post far fa-eye'}></i>
                    </OverlayTrigger>
                    :
                    <OverlayTrigger
                        placement="top"
                        delay={{ show: 100, hide: 100 }}
                        overlay={renderTooltipSee}
                    >
                        <i onClick={() => handleActivar(item._id)} className='button-watch-hidden fas fa-eye-slash'></i>
                    </OverlayTrigger>
                }


                <OverlayTrigger
                    placement="top"
                    delay={{ show: 100, hide: 100 }}
                    overlay={renderTooltipEdit}
                >
                    <i
                        onClick={() => history.push(`/comedoresadmin/viandasedit/${item?._id}`)}
                        className="fas fa-pen"></i>
                </OverlayTrigger>



                {/* <OverlayTrigger
                    placement="top"
                    delay={{ show: 100, hide: 100 }}
                    overlay={renderTooltipDelete}
                >
                    <i
                        // onClick={() => handleDeleteFile(file)}
                        className="fas fa-trash-alt"
                    ></i>
                </OverlayTrigger> */}

            </div>
        </div>
    )
}
