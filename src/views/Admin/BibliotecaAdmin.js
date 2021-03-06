import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'
import SidebarAdmin from '../../components/Admin/SidebarAdmin'
import { storage } from '../../config/firebase'
import { useStateValue } from '../../StateProvider'
import './BibliotecaAdmin.css'
import { Folders } from '../../components/Admin/Folders'
import { apiURL } from '../../config/api'


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
function sortGreatest(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = i; j < arr.length; j++) {
            if (arr[i].title.toLowerCase() > arr[j].title.toLowerCase()) {
                let temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            };
        };
    };
    return arr;
};
const reverseFiles = (arr) => {
    return arr.sort((a, b) => {
        return new Date(b.date).getTime()
            - new Date(a.date).getTime()
    })
}
const orderFiles = (arr) => {
    return arr.sort((a, b) => {
        return new Date(a.date).getTime()
            - new Date(b.date).getTime()
    })
}

const BibliotecaAdmin = () => {
    const [{ token, editOrNewFile, user }] = useStateValue()
    const headers = { 'Content-Type': 'application/json', "token": `${token}` }
    const history = useHistory()
    const [form, setForm] = useState({ search: '' })
    const { search } = form
    const [files, setFiles] = useState([])
    const [loadingFiles, setLoadingFiles] = useState(false)
    const [typeOrder, setTypeOrder] = useState('alfabetico')
    const [sector, setSector] = useState('');

    const admin = (user.role === "ADMIN_ROLE");
    const editor = (user.role === "EDITOR_ROLE");
    const initialFolder = admin ? "General" : user.sector;


    const handleSubmit = (e) => {
        e.preventDefault()
        axios.get(`${apiURL}/allfiles`, { headers })
            .then(resp => {
                setFiles(resp.data.filesDB.filter(file => file.title.toLowerCase().includes(search.toLowerCase())))
            })
    }
    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }
    const getFiles = () => {
        setLoadingFiles(true)
        axios.get(`${apiURL}/allfiles`, { headers })
            .then(resp => {
                if (typeOrder === 'alfabetico') {
                    setFiles(sortGreatest(resp.data.filesDB))
                } else if (typeOrder === 'antiguos') {
                    setFiles(orderFiles(resp.data.filesDB))
                } else if (typeOrder === 'recientes') {
                    setFiles(reverseFiles(resp.data.filesDB))
                }
                openFolder(initialFolder)
                setLoadingFiles(false)
            })
    }
    useEffect(() => {
        getFiles()
    }, [editOrNewFile, typeOrder])

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
                    await axios.put(`${apiURL}/file/${file._id}`,
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
                    await axios.put(`${apiURL}/file/${file._id}`,
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
                    await axios.delete(`${apiURL}/file/${file._id}`, { headers })
                        .then(() => {
                            getFiles()
                        })
                })

            }
        })
    }

    const openFolder = (sector) => {
        setSector(sector);
    }

    return (
        <>
            <SidebarAdmin />
            <div className="PostsAdmin">
                <div className="PostsAdmin-container">
                    <h1>Biblioteca de archivos</h1>
                    <div className="PostsAdmin-content">
                        <div className="PostsAdmin-content-actions">
                            <Link to={`/bibliotecaadmin/newfile/${sector}`} className="PostsAdmin-content-actions-item">
                                <span>+</span>
                                <p>Cargar un nuevo archivo</p>
                            </Link>
                        </div>
                        <div className="BibliotecaAdmin__content">

                            {admin && <Folders
                                openFolder={openFolder}
                                actualFolder={sector}
                            />}

                            {editor && <Folders
                                openFolder={openFolder}
                                actualFolder={sector}
                                editor={true}
                                sectoresEditor={user.sectores}
                            />}

                            <div className="root-title"><i className="far fa-folder"></i> {sector}</div>

                            <div className="Biblioteca__search">
                                <form onSubmit={handleSubmit} id="biblioteca">
                                    <input name="search" value={search} onChange={handleInputChange} type="text" className="Biblioteca__search-input" placeholder="Buscar un archivo por nombre" />
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

                            <div className="BibliotecaAdmin-files">
                                {
                                    loadingFiles &&
                                    <p>Cargando...</p>
                                }
                                {
                                    !loadingFiles &&
                                    files.filter(f => f.sector === sector).map
                                        (file => (
                                            <div key={file._id} className="BibliotecaAdmin-file">
                                                <i className="far fa-file-alt Biblioteca__file-icon"></i>
                                                <p>{file.title}</p>
                                                <div className="BibliotecaAdmin-file-actions">
                                                    <OverlayTrigger
                                                        placement="top"
                                                        delay={{ show: 100, hide: 100 }}
                                                        overlay={renderTooltipDownload}
                                                    >
                                                        <a href={file.url} target="_blank" download>
                                                            <i className="fas fa-download"></i>
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
                                                        <i onClick={() => editFile(file._id)} className="fas fa-pen"></i>
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
                                                            className="fas fa-trash-alt"
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
            </div>
        </>
    )
}

export default BibliotecaAdmin
