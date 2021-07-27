import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'
import SidebarAdmin from '../../components/Admin/SidebarAdmin'
import { storage } from '../../config/firebase'
import { useStateValue } from '../../StateProvider'
import './BibliotecaAdmin.css'

const BibliotecaAdmin = () => {
    const [{ token }] = useStateValue()

    const headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }
    const history = useHistory()

    const [files, setFiles] = useState([])
    const [loadingFiles, setLoadingFiles] = useState(false)

    const getFiles = async () => {
        setLoadingFiles(true)
        await axios.get("https://internal-app-dpm.herokuapp.com/allfiles", { headers })
            .then(resp => {
                setFiles(resp.data.filesDB)
                setLoadingFiles(false)
            })
    }

    useEffect(() => {
        getFiles()
    }, [])

    const renderTooltipDownload = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Descargar archivo
        </Tooltip>
    );
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

    const editFile = (id) => {
        history.push(`bibliotecaadmin/editfile/${id}`)
    }

    const handleEditFile = async (file, action) => {
        if (file.estado && action === "ver") return
        if (!file.estado && action === "ocultar") return
        if (action === 'ver') {
            Swal.fire({
                title: 'Deseas activar este archivo?',
                showCloseButton: true,
                showCancelButton: true,
                focusConfirm: false,
                confirmButtonText:
                    'Activar',
                cancelButtonText:
                    'Cancelar'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await axios.put(`https://internal-app-dpm.herokuapp.com/file/${file._id}`,
                        {
                            "estado": !file.estado
                        }, { headers })
                        .then(() => {
                            getFiles()
                        })
                }
            })
        } else if (action === 'ocultar') {
            Swal.fire({
                title: 'Deseas inactivar este archivo?',
                showCloseButton: true,
                showCancelButton: true,
                focusConfirm: false,
                confirmButtonText:
                    'Inactivar',
                cancelButtonText:
                    'Cancelar'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await axios.put(`https://internal-app-dpm.herokuapp.com/file/${file._id}`,
                        {
                            "estado": !file.estado
                        }, { headers })
                        .then(() => {
                            getFiles()
                        })
                }
            })
        }
    }

    const handleDeleteFile = async (file) => {
        Swal.fire({
            title: 'Deseas eliminar este archivo?',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText:
                'Eliminar',
            cancelButtonText:
                'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const storageRef = storage.ref().child('BibliotecaFiles').child(`${file.fileId}`)
                storageRef.delete().then(async () => {
                    await axios.delete(`https://internal-app-dpm.herokuapp.com/file/${file._id}`, { headers })
                        .then(() => {
                            getFiles()
                        })
                })

            }
        })
    }
    return (
        <>
            <SidebarAdmin />
            <div className="PostsAdmin">
                <div className="PostsAdmin-container">
                    <h1>Biblioteca de archivos</h1>
                    <div className="PostsAdmin-content">
                        <div className="PostsAdmin-content-actions">
                            <Link to="bibliotecaadmin/newfile" className="PostsAdmin-content-actions-item">
                                <span>+</span>
                                <p>Cargar un nuevo archivo</p>
                            </Link>
                        </div>
                        <div className="BibliotecaAdmin-files">
                            {
                                loadingFiles &&
                                <p>Cargando...</p>
                            }
                            {
                                !loadingFiles &&
                                files.map(file => (
                                    <div className="BibliotecaAdmin-file">
                                        <i class="far fa-file-alt Biblioteca__file-icon"></i>
                                        <p>{file.title}</p>
                                        <div className="BibliotecaAdmin-file-actions">
                                            <OverlayTrigger
                                                placement="top"
                                                delay={{ show: 100, hide: 100 }}
                                                overlay={renderTooltipDownload}
                                            >
                                                <a href={file.url} target="_blank" download>
                                                    <i class="fas fa-download"></i>
                                                </a>
                                            </OverlayTrigger>
                                            <OverlayTrigger
                                                placement="top"
                                                delay={{ show: 100, hide: 100 }}
                                                overlay={renderTooltipSee}
                                            >
                                                <i
                                                    onClick={() => handleEditFile(file, 'ver')}
                                                    className={file.estado ? 'button-watch-post disabled far fa-eye' : 'button-watch-post far fa-eye'}
                                                ></i>
                                            </OverlayTrigger>
                                            <OverlayTrigger
                                                placement="top"
                                                delay={{ show: 100, hide: 100 }}
                                                overlay={renderTooltipEdit}
                                            >
                                                <i onClick={() => editFile(file._id)} class="fas fa-pen"></i>
                                            </OverlayTrigger>
                                            <OverlayTrigger
                                                placement="top"
                                                delay={{ show: 100, hide: 100 }}
                                                overlay={renderTooltipHide}
                                            >
                                                <i
                                                    onClick={() => handleEditFile(file, 'ocultar')}
                                                    className={file.estado
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
                                                    onClick={() => handleDeleteFile(file)}
                                                    class="fas fa-trash-alt"
                                                ></i>
                                            </OverlayTrigger>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BibliotecaAdmin
