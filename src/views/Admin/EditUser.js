import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { storage } from '../../config/firebase'
import { useStateValue } from '../../StateProvider'

const EditUser = () => {
    const { id } = useParams()
    const history = useHistory()
    const [{ token, editOrNewUser }, dispatch] = useStateValue()
    const [form, setForm] = useState({
        user: '',
        password: '',
        nombre: '',
        apellido: '',
        email: '',
        phone: '',
        birth: '',
        position: '',
        sector: ''
    })
    const [role, setRole] = useState('')
    const [fileId, setFileId] = useState('')
    const { user, password, nombre, apellido, email, phone, birth, position, sector } = form

    const [img, setImg] = useState('')
    const [imgTemp, setImgTemp] = useState('')
    const [imgToUpload, setImgToUpload] = useState({})

    const [loadingImg, setLoadingImg] = useState(false)
    const [loading, setLoading] = useState(false)
    const [userError, setUserError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [nombreError, setNombreError] = useState('')
    const [apellidoError, setApellidoError] = useState('')
    const [positionError, setPositionError] = useState('')
    const [sectorError, setSectorError] = useState('')

    const headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }

    const getUser = async () => {
        await axios.get(`https://internal-app-dpm.herokuapp.com/usuario/${id}`, { headers })
            .then(resp => {
                setForm({
                    user: resp.data.user.user,
                    nombre: resp.data.user.nombre,
                    apellido: resp.data.user.apellido,
                    email: resp.data.user.correo ? resp.data.user.correo : '',
                    phone: resp.data.user.phone ? resp.data.user.phone : '',
                    birth: resp.data.user.birth ? resp.data.user.birth : '',
                    position: resp.data.user.position,
                    sector: resp.data.user.sector
                })
                setRole(resp.data.user.role)
                console.log(resp.data.user)
                setFileId(resp.data.user.fileId)
                setImg(resp.data.user.image ? resp.data.user.image : '')
            })
    }

    const formatDateProfile = (date) => {
        return date.substring(0, 10)
    }
    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }
    useEffect(() => {
        getUser()
    }, [])
    const handleRole = (e) => {
        setRole(e.target.value)
    }
    const handleReturn = () => {
        history.push('/directorioadmin')
    }
    const handlePictureClick = () => {
        document.querySelector("#fileSelector").click()
    }
    const handleFileChange = (e) => {
        setLoadingImg(true)
        const file = e.target.files[0]
        if (file) {
            setImgToUpload(file)
            const reader = new FileReader();
            reader.onload = (event) => {
                setImgTemp(event.target.result)
            };
            reader.readAsDataURL(e.target.files[0])
        }
        setLoadingImg(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (user === "" || nombre === "" || apellido === "" || position === "" || sector === "") {
            if (user === "") {
                setUserError('El nombre de usuario es requerido')
            } else {
                setUserError('')
            }

            if (password === "") {
                setPasswordError('La contraseña es requerida')
            } else {
                setPasswordError('')
            }

            if (nombre === "") {
                setNombreError('El nombre es requerido')
            } else {
                setNombreError('')
            }

            if (apellido === "") {
                setApellidoError('El apellido es requerido')
            } else {
                setApellidoError('')
            }

            if (position === "") {
                setPositionError('La posicion es requerida')
            } else {
                setPositionError('')
            }

            if (sector === "") {
                setSectorError('El sector es requerido')
            } else {
                setSectorError('')
            }
            return
        }
        setLoading(true)
        if (!password) {
            if (imgTemp === "") {
                await axios.put(`https://internal-app-dpm.herokuapp.com/usuario/${id}`,
                    {
                        "user": `${user}`,
                        "nombre": `${nombre}`,
                        "apellido": `${apellido}`,
                        "correo": `${email}`,
                        "phone": `${phone}`,
                        "birth": `${birth}`,
                        "position": `${position}`,
                        "sector": `${sector}`,
                        "role": `${role}`
                    },
                    { headers })
                    .then(() => {
                        setLoading(false)
                        Swal.fire(
                            'Éxito',
                            'El usuario se ha actualizado con éxito',
                            'success'
                        ).then(resp => {
                            if (resp) {
                                dispatch({
                                    type: 'SET_EDIT_NEW_USER',
                                    editOrNewUser: !editOrNewUser
                                })
                                history.push('/directorioadmin')
                            }
                        })
                    })
            } else if (imgTemp !== "") {
                const storageRef = storage.ref().child('profileImages').child(`${fileId}`)
                const res = await storageRef.put(imgToUpload)
                const url = await storageRef.getDownloadURL()
                await axios.put(`https://internal-app-dpm.herokuapp.com/usuario/${id}`,
                    {
                        "user": `${user}`,
                        "nombre": `${nombre}`,
                        "apellido": `${apellido}`,
                        "correo": `${email}`,
                        "phone": `${phone}`,
                        "birth": `${birth}`,
                        "position": `${position}`,
                        "sector": `${sector}`,
                        "image": `${url}`,
                        "role": `${role}`
                    },
                    { headers })
                    .then(() => {
                        setLoading(false)
                        Swal.fire(
                            'Éxito',
                            'El usuario se ha actualizado con éxito',
                            'success'
                        ).then(resp => {
                            if (resp) {
                                dispatch({
                                    type: 'SET_EDIT_NEW_USER',
                                    editOrNewUser: !editOrNewUser
                                })
                                history.push('/directorioadmin')
                            }
                        })
                    })
            }
        } else if (password) {
            if (imgTemp === "") {
                await axios.put(`https://internal-app-dpm.herokuapp.com/usuario/${id}`,
                    {
                        "user": `${user}`,
                        "nombre": `${nombre}`,
                        "apellido": `${apellido}`,
                        "correo": `${email}`,
                        "password": `${password}`,
                        "phone": `${phone}`,
                        "birth": `${birth}`,
                        "position": `${position}`,
                        "sector": `${sector}`,
                        "role": `${role}`
                    },
                    { headers })
                    .then(() => {
                        setLoading(false)
                        Swal.fire(
                            'Éxito',
                            'El usuario se ha actualizado con éxito',
                            'success'
                        ).then(resp => {
                            if (resp) {
                                dispatch({
                                    type: 'SET_EDIT_NEW_USER',
                                    editOrNewUser: !editOrNewUser
                                })
                                history.push('/directorioadmin')
                            }
                        })
                    })
            } else if (imgTemp !== "") {
                const storageRef = storage.ref().child('profileImages').child(`${fileId}`)
                const res = await storageRef.put(imgToUpload)
                const url = await storageRef.getDownloadURL()
                await axios.put(`https://internal-app-dpm.herokuapp.com/usuario/${id}`,
                    {
                        "user": `${user}`,
                        "nombre": `${nombre}`,
                        "apellido": `${apellido}`,
                        "correo": `${email}`,
                        "password": `${password}`,
                        "phone": `${phone}`,
                        "birth": `${birth}`,
                        "position": `${position}`,
                        "sector": `${sector}`,
                        "image": `${url}`,
                        "role": `${role}`
                    },
                    { headers })
                    .then(() => {
                        setLoading(false)
                        Swal.fire(
                            'Éxito',
                            'El usuario se ha actualizado con éxito',
                            'success'
                        ).then(resp => {
                            if (resp) {
                                dispatch({
                                    type: 'SET_EDIT_NEW_USER',
                                    editOrNewUser: !editOrNewUser
                                })
                                history.push('/directorioadmin')
                            }
                        })
                    })
            }
        }
    }

    const handleDeleteImage = () => {
        setImg('')
        setImgTemp('')
        setImgToUpload({})
        if (img.startsWith('https://firebasestorage.googleapis.com/')) {
            const storageRef = storage.ref().child('profileImages').child(`${fileId}`)
            storageRef.delete().then(async () => {
                await axios.put(`https://internal-app-dpm.herokuapp.com/usuario/${id}`,
                    {
                        "image": ""
                    },
                    { headers })
            })
        }
    }

    return (
        <div className="PostComments">
            <div className="PostComments__container">
                <h1>Editar usuario</h1>
                <div className="NewUser__content">
                    <form onSubmit={handleSubmit} className="NewUser__data">
                        <div className="NewUser__data-row">
                            <label>Nombre de usuario</label>
                            <div>
                                <input disabled={loading} onChange={handleInputChange} type="text" name="user" value={user} />
                                {
                                    userError && !user
                                    && <span className="submitError">{userError}</span>
                                }
                            </div>
                        </div>
                        <div className="NewUser__data-row">
                            <label>Contraseña</label>
                            <div>
                                <input disabled={loading} onChange={handleInputChange} type="password" name="password" value={password} />
                                {
                                    passwordError && !password
                                    && <span className="submitError">{passwordError}</span>
                                }
                            </div>
                        </div>
                        <div className="NewUser__data-row">
                            <label>Nombre</label>
                            <div>
                                <input disabled={loading} onChange={handleInputChange} type="text" name="nombre" value={nombre} />
                                {
                                    nombreError && !nombre
                                    && <span className="submitError">{nombreError}</span>
                                }
                            </div>
                        </div>
                        <div className="NewUser__data-row">
                            <label>Apellido</label>
                            <div>
                                <input disabled={loading} onChange={handleInputChange} type="text" name="apellido" value={apellido} />
                                {
                                    apellidoError && !apellido
                                    && <span className="submitError">{apellidoError}</span>
                                }
                            </div>
                        </div>
                        <div className="NewUser__data-row">
                            <label>Email (Opcional)</label>
                            <div>
                                <input disabled={loading} onChange={handleInputChange} type="email" name="email" value={email} />
                            </div>
                        </div>
                        <div className="NewUser__data-row">
                            <label>Teléfono (Opcional)</label>
                            <div>
                                <input disabled={loading} onChange={handleInputChange} type="tel" name="phone" value={phone} />
                            </div>
                        </div>
                        <div className="NewUser__data-row">
                            <label>Fecha de nacimiento</label>
                            <div>
                                <input disabled={loading} onChange={handleInputChange} type="date" name="birth" value={birth && formatDateProfile(birth)} />
                            </div>
                        </div>
                        <div className="NewUser__data-row">
                            <label>Cargo</label>
                            <div>
                                <input disabled={loading} onChange={handleInputChange} type="text" name="position" value={position} />
                                {
                                    positionError && !position
                                    && <span className="submitError">{positionError}</span>
                                }
                            </div>
                        </div>
                        <div className="NewUser__data-row">
                            <label>Sector</label>
                            <div>
                                <input disabled={loading} onChange={handleInputChange} type="text" name="sector" value={sector} />
                                {
                                    sectorError && !sector
                                    && <span className="submitError">{sectorError}</span>
                                }
                            </div>
                        </div>
                        <div className="NewUser__data-row">
                            <label>Rol</label>
                            <div>
                                <select disabled={loading} onChange={handleRole} value={role}>
                                    <option value="">-- Seleccione --</option>
                                    <option value="USER_ROLE">Usuario</option>
                                    <option value="ADMIN_ROLE">Administrador</option>
                                </select>
                            </div>
                        </div>
                        <div className="NewUser__data-buttons">
                            <button disabled={loading} type="submit">
                                {
                                    loading
                                        ?
                                        <>
                                            Espere...
                                        </>
                                        :
                                        <>
                                            <i class="far fa-save"></i>
                                            Guardar
                                        </>
                                }
                            </button>
                            <button disabled={loading} onClick={handleReturn} type="button">
                                <i class="fas fa-chevron-left"></i>
                                Cancelar
                            </button>
                        </div>
                    </form>
                    <div className="NewUser__pic">
                        <input
                            id="fileSelector"
                            type="file"
                            name="file"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                        {
                            img && !imgTemp
                            &&
                            <>
                                <img src={img} className="Profile-pic" />
                                <p className={loading ? 'editImage disabled' : 'editImage'} onClick={handlePictureClick}>
                                    <i class="fas fa-plus"></i>
                                    Cambiar foto de perfil
                                </p>
                                <p className={loading ? 'editImage disabled' : 'editImage'} onClick={handleDeleteImage}>
                                    <i class="fas fa-trash-alt"></i>
                                    Eliminar foto de perfil
                                </p>
                            </>
                        }
                        {
                            imgTemp
                            && <>
                                <img src={imgTemp} className="Profile-pic" />
                                <p className={loading ? 'editImage disabled' : 'editImage'} onClick={handlePictureClick}>
                                    <i class="fas fa-plus"></i>
                                    Cambiar foto de perfil
                                </p>
                                <p className={loading ? 'editImage disabled' : 'editImage'} onClick={handleDeleteImage}>
                                    <i class="fas fa-trash-alt"></i>
                                    Eliminar foto de perfil
                                </p>
                            </>
                        }
                        {
                            !img && !imgTemp &&
                            <button disabled={loadingImg || loading} onClick={handlePictureClick} className="Upload-pic">
                                {loadingImg
                                    ?
                                    <>
                                        Espere...
                                    </>
                                    :
                                    <>
                                        <i class="fas fa-plus"></i>
                                        <p>Cargar imagen de perfil</p>
                                    </>}
                            </button>
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditUser
