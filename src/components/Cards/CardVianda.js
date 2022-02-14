import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'


const renderTooltipSee = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        Ver archivo
    </Tooltip>
);
const renderTooltipEdit = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        Editar archivo
    </Tooltip>
);
const renderTooltipHide = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        Ocultar archivo
    </Tooltip>
);
const renderTooltipDelete = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        Eliminar archivo
    </Tooltip>
);



export const CardVianda = ({item}) => {
    return (
        <div key={item._id} className="BibliotecaAdmin-file cards">
            <i className="far fa-file-alt Biblioteca__file-icon"></i>
            <p>{item.nombre}</p>
            <div className="BibliotecaAdmin-file-actions cards">

                <OverlayTrigger
                    placement="top"
                    delay={{ show: 100, hide: 100 }}
                    overlay={renderTooltipSee}
                >
                    <i
                        //onClick={() => handleEditFile(item, 'ver')}
                        className={item.habilitado ? 'button-watch-post disabled far fa-eye' : 'button-watch-post far fa-eye'}
                    ></i>
                </OverlayTrigger>

                <OverlayTrigger
                    placement="top"
                    delay={{ show: 100, hide: 100 }}
                    overlay={renderTooltipEdit}
                >
                    <i
                        onClick={() => { }}
                        className="fas fa-pen"></i>
                </OverlayTrigger>

                <OverlayTrigger
                    placement="top"
                    delay={{ show: 100, hide: 100 }}
                    overlay={renderTooltipHide}
                >
                    <i
                        //onClick={() => handleEditFile(file, 'ocultar')}
                        className={item.habilitado
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
                        // onClick={() => handleDeleteFile(file)}
                        className="fas fa-trash-alt"
                    ></i>
                </OverlayTrigger>

            </div>
        </div>
    )
}
