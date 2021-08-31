import axios from 'axios'
import React, { useState } from 'react'
import { useHistory } from 'react-router'
import Swal from 'sweetalert2'
import { storage } from '../../config/firebase'
import { useStateValue } from '../../StateProvider'
import { v4 as uuidv4 } from 'uuid';
import './NewUser.css'
const NewUser = () => {
    const [{ token, editOrNewUser }, dispatch] = useStateValue()
    let headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }
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
    const [role, setRole] = useState('USER_ROLE')
    const { user, password, nombre, apellido, email, phone, birth, position, sector } = form
    const [img, setImg] = useState({})
    const [imgTemp, setImgTemp] = useState('')
    const [loadingImg, setLoadingImg] = useState(false)
    const [loading, setLoading] = useState(false)
    const [userError, setUserError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [nombreError, setNombreError] = useState('')
    const [apellidoError, setApellidoError] = useState('')
    const [positionError, setPositionError] = useState('')
    const [sectorError, setSectorError] = useState('')

    const history = useHistory()
    const handlePictureClick = () => {
        document.querySelector("#fileSelector").click()
    }

    const handleFileChange = (e) => {
        setLoadingImg(true)
        const file = e.target.files[0]
        if (file) {
            setImg(file)
            const reader = new FileReader();
            reader.onload = (event) => {
                setImgTemp(event.target.result)
            };
            reader.readAsDataURL(e.target.files[0])
        }
        setLoadingImg(false)
    }
    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (user === "" || password === "" || nombre === "" || apellido === "" || position === "" || sector === "") {
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
        const fileId = uuidv4();
        /*crea un fileId y lo asigna para evitar la sobrecarga en storage de firebase */
        if (imgTemp === "") {
            await axios.post("https://internal-app-dpm.herokuapp.com/usuario",
                {
                    "nombre": `${nombre}`,
                    "apellido": `${apellido}`,
                    "user": `${user}`,
                    "correo": `${email}`,
                    "password": `${password}`,
                    "role": `${role}`,
                    "position": `${position}`,
                    "sector": `${sector}`,
                    "phone": `${phone}`,
                    "birth": `${birth}`,
                    "fileId": `${fileId}`
                },
                { headers })
                .then(() => {
                    setLoading(false)
                    Swal.fire(
                        'Éxito',
                        'El usuario se ha creado con éxito',
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
                }).catch(() => {
                    Swal.fire(
                        'Error',
                        'Ha ocurrido un error, comuníquese con el administrador',
                        'error'
                    ).then((resp) => {
                        if (resp) {
                            setLoading(false)
                        }

                    })
                })
        } else if (imgTemp !== "") {
            const storageRef = storage.ref().child('profileImages').child(`${fileId}`)
            const res = await storageRef.put(img)
            const url = await storageRef.getDownloadURL()
            await axios.post("https://internal-app-dpm.herokuapp.com/usuario",
                {
                    "nombre": `${nombre}`,
                    "apellido": `${apellido}`,
                    "user": `${user}`,
                    "correo": `${email}`,
                    "password": `${password}`,
                    "role": `${role}`,
                    "position": `${position}`,
                    "sector": `${sector}`,
                    "phone": `${phone}`,
                    "birth": `${birth}`,
                    "image": `${url}`,
                    "fileId": `${fileId}`
                },
                { headers })
                .then(() => {
                    setLoading(false)
                    Swal.fire(
                        'Éxito',
                        'El usuario se ha creado con éxito',
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
                }).catch(() => {
                    Swal.fire(
                        'Error',
                        'Ha ocurrido un error, comuníquese con el administrador',
                        'error'
                    ).then((resp) => {
                        if (resp) {
                            setLoading(false)
                        }

                    })
                })
        }
    }
    const handleRole = (e) => {
        setRole(e.target.value)
    }
    const handleReturn = () => {
        history.push('/directorioadmin')
    }
    return (
        <div className="PostComments">
            <div className="PostComments__container">
                <h1>Crear un nuevo usuario</h1>
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
                                <input disabled={loading} onChange={handleInputChange} type="date" name="birth" value={birth} />
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
                                    <option value="USER_ROLE">Usuario</option>
                                    <option value="ADMIN_ROLE">Administrador</option>
                                </select>
                            </div>
                        </div>
                        <div className="NewUser__data-buttons">
                            <button disabled={loading} type="submit">
                                <i class="far fa-save"></i>
                                Guardar
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
                            imgTemp
                                ? <img src={imgTemp} className="Profile-pic" />
                                : <button disabled={loadingImg || loading} onClick={handlePictureClick} className="Upload-pic">
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

export default NewUser
