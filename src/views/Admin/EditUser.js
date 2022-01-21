import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { storage } from '../../config/firebase'
import { useStateValue } from '../../StateProvider'
import CreatableSelect from 'react-select/creatable';
import { useGetUser } from '../../hooks/useGetUser'
import { editUser } from '../../services/api'
import sectoresMock from '../../data/sectoresMock'


const formatDateProfile = (date) => {
    return date.substring(0, 10)
}

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
        sector: '',
        sectores: []
    })

    const ruta = "https://internal-app-dpm.herokuapp.com";

    const [role, setRole] = useState('')
    const [fileId, setFileId] = useState('')
    const { user, password, nombre, apellido, email, phone, birth, position, sector, sectores } = form

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
    const userInfo = useGetUser(id)
    const [optionsSectores, setOptionsSectores] = useState(sectoresMock)
    const [newOptionsSectores, setNewOptionsSectores] = useState([])

    const handleSectores = (values) => {
        const valuesToArray = values.map(item => item.value)
        let hayNewValues = values.find(op => op.__isNew__ && !newOptionsSectores.includes(op))
        if (hayNewValues) {
            setOptionsSectores(optionsSectores.concat(hayNewValues))
            setNewOptionsSectores(newOptionsSectores.concat(hayNewValues))
        }
        setForm({ ...form, sectores: valuesToArray })
    }

    useEffect(() => {
        if (!userInfo.error) {
            setForm(userInfo.userForm)
            setRole(userInfo.role)
            setFileId(userInfo.fileId)
            setImg(userInfo.image)
            let hayNuevosSectores = userInfo.userForm?.sectores?.filter(sec => !sectoresMock.find(mock => mock.value == sec))
            if (hayNuevosSectores) {
                let newSectores = hayNuevosSectores.map(sec => { return { value: sec, label: sec } })
                let newArr = optionsSectores.concat(newSectores)
                setOptionsSectores(newArr)
            }
        }
    }, [userInfo]);

    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

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
        //TODO: pasar todas estas validaciones a YUP y usar Formik.
        if (user === "" || nombre === "" || apellido === "" || position === "" || sector === "") {
            setUserError(user === "" ? 'El nombre de usuario es requerido' : '')
            setPasswordError(password === "" ? 'La contraseña es requerida' : '')
            setNombreError(nombre === "" ? 'El nombre es requerido' : '')
            setApellidoError(apellido === "" ? 'El apellido es requerido' : '')
            setPositionError(position === "" ? 'La posicion es requerida' : '')
            setSectorError(sector === "" ? 'El sector es requerido' : '')
            return
        }
        setLoading(true)

        let editedUser = {
            "user": `${user}`,
            "nombre": `${nombre}`,
            "apellido": `${apellido}`,
            "correo": `${email}`,
            "phone": `${phone}`,
            "birth": `${birth}`,
            "position": `${position}`,
            "sector": `${sector}`,
            "role": `${role}`,
            "sectores": sectores
        }

        if (imgTemp !== "") {
            const storageRef = storage.ref().child('profileImages').child(`${fileId}`)
            const res = await storageRef.put(imgToUpload)
            const url = await storageRef.getDownloadURL()
            editedUser = { ...editedUser, "image": `${url}` }
        }

        if (password) {
            editedUser = { ...editedUser, "password": `${password}` }
        }

        editUser(editedUser, id).then(() => {
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

    const handleDeleteImage = () => {
        const headers = {
            'Content-Type': 'application/json',
            "token": `${token}`
        }
        setImg('')
        setImgTemp('')
        setImgToUpload({})
        if (img.startsWith('https://firebasestorage.googleapis.com/')) {
            const storageRef = storage.ref().child('profileImages').child(`${fileId}`)
            storageRef.delete().then(async () => {
                await axios.put(`${ ruta }/usuario/${id}`,
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
                                <select disabled={loading} onChange={handleInputChange} value={sector} name='sector'>
                                    {
                                       optionsSectores && optionsSectores.map( p => (  
                                            <option value={ p.label }>{ p.label }</option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>

                        <div className="NewUser__data-row">
                            <label>Sectores</label>
                            <CreatableSelect
                                isMulti
                                onChange={handleSectores}
                                options={optionsSectores}
                                placeholder="Elegir sectores"
                                // formatCreateLabel={userInput => `Agregar: ${userInput}`}
                                classNamePrefix="react-select"
                                value={optionsSectores.filter(val => sectores?.includes(val.value))}
                            // noOptionsMessage={NoOptionsMessage}
                            //isDisabled={loading}
                            />
                        </div>
                        <div className="NewUser__data-row">
                            <label>Rol</label>
                            <div>
                                <select disabled={loading} onChange={handleRole} value={role}>
                                    <option value="">-- Seleccione --</option>
                                    <option value="USER_ROLE">Usuario</option>
                                    <option value="EDITOR_ROLE">Editor</option>
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
                                <img src={img} className="Profile-pic" alt="Profile-pic" />
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
                                <img alt="Profile-pic" src={imgTemp} className="Profile-pic" />
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
