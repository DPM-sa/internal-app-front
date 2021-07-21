import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { storage } from '../../config/firebase'
import { useStateValue } from '../../StateProvider'

const EditUser = () => {
    const { id } = useParams()
    const history = useHistory()
    const [{ token }] = useStateValue()
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
    const { user, password, nombre, apellido, email, phone, birth, position, sector } = form
    const [img, setImg] = useState('')
    const [imgTemp, setImgTemp] = useState('')
    const [imgToUpload, setImgToUpload] = useState({})
    const [loadingImg, setLoadingImg] = useState(false)
    const [loading, setLoading] = useState(false)
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
        if (user === "" || nombre === "" || apellido === "" || position === "" || sector === "") return
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
                        )
                    })
            } else if (imgTemp !== "") {
                const storageRef = storage.ref().child('profileImages').child(`${user}`)
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
                        )
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
                        )
                    })
            } else if (imgTemp !== "") {
                const storageRef = storage.ref().child('profileImages').child(`${user}`)
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
                        )
                    })
            }
        }
    }

    const handleDeleteImage = () => {
        setImg('')
        setImgTemp('')
        setImgToUpload({})
        if (img.startsWith('https://firebasestorage.googleapis.com/')) {
            const storageRef = storage.ref().child('profileImages').child(`${user}`)
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
                            <input disabled={loading} onChange={handleInputChange} type="text" name="user" value={user} />
                        </div>
                        <div className="NewUser__data-row">
                            <label>Contraseña</label>
                            <input disabled={loading} onChange={handleInputChange} type="password" name="password" value={password} />
                        </div>
                        <div className="NewUser__data-row">
                            <label>Nombre</label>
                            <input disabled={loading} onChange={handleInputChange} type="text" name="nombre" value={nombre} />
                        </div>
                        <div className="NewUser__data-row">
                            <label>Apellido</label>
                            <input disabled={loading} onChange={handleInputChange} type="text" name="apellido" value={apellido} />
                        </div>
                        <div className="NewUser__data-row">
                            <label>Email (Opcional)</label>
                            <input disabled={loading} onChange={handleInputChange} type="email" name="email" value={email} />
                        </div>
                        <div className="NewUser__data-row">
                            <label>Teléfono (Opcional)</label>
                            <input disabled={loading} onChange={handleInputChange} type="tel" name="phone" value={phone} />
                        </div>
                        <div className="NewUser__data-row">
                            <label>Fecha de nacimiento</label>
                            <input disabled={loading} onChange={handleInputChange} type="date" name="birth" value={birth && formatDateProfile(birth)} />
                        </div>
                        <div className="NewUser__data-row">
                            <label>Cargo</label>
                            <input disabled={loading} onChange={handleInputChange} type="text" name="position" value={position} />
                        </div>
                        <div className="NewUser__data-row">
                            <label>Sector</label>
                            <input disabled={loading} onChange={handleInputChange} type="text" name="sector" value={sector} />
                        </div>
                        <div className="NewUser__data-row">
                            <label>Rol</label>
                            <select disabled={loading} onChange={handleRole} value={role}>
                                <option value="">-- Seleccione --</option>
                                <option value="USER_ROLE">Usuario</option>
                                <option value="ADMIN_ROLE">Administrador</option>
                            </select>
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
