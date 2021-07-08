import axios from 'axios'
import React, { useState, useEffect } from 'react'
import NavbarProfile from '../components/NavbarProfile'
import { useStateValue } from '../StateProvider'
import { storage } from '../config/firebase'
import './Profile.css'
import Footer from '../components/Footer'
import moment from 'moment'
const Profile = () => {
    const [{ user, token }, dispatch] = useStateValue()
    let headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }
    const [edit, setEdit] = useState(false)
    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        email: '',
        phone: '',
        birth: '',
        position: '',
        sector: ''
    })
    const { nombre, apellido, email, phone, birth, position, sector } = form
    const [imageProfile, setImageProfile] = useState('')
    const [loading, setLoading] = useState(false)
    const [loadingImg, setLoadingImg] = useState(false)
    const getUser = async () => {
        await axios.get(`https://internal-app-dpm.herokuapp.com/usuario/${user._id}`, { headers })
            .then(resp => {
                console.log(resp.data)
                setForm({
                    nombre: resp.data.user.nombre,
                    apellido: resp.data.user.apellido,
                    email: resp.data.user.email ? resp.data.user.email : '',
                    phone: resp.data.user.phone ? resp.data.user.phone : '',
                    birth: resp.data.user.birth ? resp.data.user.birth : '',
                    position: resp.data.user.position ? resp.data.user.position : '',
                    sector: resp.data.user.sector ? resp.data.user.sector : '',
                })
                if (resp.data.user.image) {
                    setImageProfile(resp.data.user.image)
                }
            })
    }

    useEffect(() => {
        getUser()
    }, [loading])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        await axios.put(`https://internal-app-dpm.herokuapp.com/usuario/${user._id}`,
            {
                "nombre": `${nombre}`,
                "apellido": `${apellido}`,
                "email": `${email}`,
                "phone": `${phone}`,
                "birth": `${birth}`,
                "position": `${position}`,
                "sector": `${sector}`,
                "image": `${imageProfile}`
            },
            { headers })
            .then(() => {
                setLoading(false)
                setEdit(!edit)
            })
    }

    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handlePictureClick = () => {
        document.querySelector("#fileSelector").click()
    }

    const handleFileChange = async (e) => {
        setLoadingImg(true)
        const file = e.target.files[0]
        const storageRef = storage.ref().child('profileImages').child(`${user.user}`)
        const res = await storageRef.put(file)
        const url = await storageRef.getDownloadURL()
        setImageProfile(url)
        await axios.put(`https://internal-app-dpm.herokuapp.com/usuario/${user._id}`,
            {
                "image": `${url}`
            },
            { headers })
            .then(() => {
                setLoadingImg(false)
            })
    }

    const formatDateProfile = (date) => {
        return moment(date).format('D MMM YYYY')
    }

    const handleDeleteImage = () => {
        setLoadingImg(true)
        const storageRef = storage.ref().child('profileImages').child(`${user.user}`)
        storageRef.delete().then(async () => {
            setImageProfile('')
            await axios.put(`https://internal-app-dpm.herokuapp.com/usuario/${user._id}`,
                {
                    "image": ""
                },
                { headers })
                .then(() => {
                    setLoadingImg(false)
                })
        })
    }

    const handleEdit = () => {
        setEdit(!edit)
    }

    return (
        <>
            <NavbarProfile />
            <div className="Profile">
                <div className="card-body">
                    <div className="d-flex flex-column align-items-center text-center">
                        <img src={imageProfile ? imageProfile : './assets/no-image.jpg'} alt="Admin" className="rounded-circle" width="150" />
                        <div className="mt-3">
                            <h4>¡Hola {nombre} {apellido}!</h4>
                            <p className="text-secondary mb-1">{user.position && user.position}</p>
                            <p className="text-muted font-size-sm">{user.sector && user.sector}</p>
                            <input
                                id="fileSelector"
                                type="file"
                                name="file"
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />
                            {edit && !loadingImg
                                &&
                                <>
                                    <p onClick={handlePictureClick} className="text-primary">Cambiar foto de perfil</p>
                                    <p onClick={handleDeleteImage} className="text-primary">Eliminar foto de perfil</p>
                                </>
                            }
                            {
                                edit && loadingImg
                                &&
                                <p className="text-secondary">Cargando...</p>
                            }
                        </div>
                    </div>
                </div>

                {
                    edit
                        ?
                        <form onSubmit={handleSubmit} >
                            <div className="Profile__data-row">
                                <div>
                                    <h6>Nombre de usuario</h6>
                                </div>
                                <div>
                                    {user.user}
                                </div>
                            </div>
                            <div className="Profile__data-row">
                                <div>
                                    <h6>Nombre</h6>
                                </div>
                                <div>
                                    <input type="text" className="Profile__data-input" name="nombre" value={nombre} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="Profile__data-row">
                                <div>
                                    <h6>Apellido</h6>
                                </div>
                                <div>
                                    <input type="text" className="Profile__data-input" name="apellido" value={apellido} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="Profile__data-row">
                                <div>
                                    <h6>Email</h6>
                                </div>
                                <div>
                                    <input type="text" className="Profile__data-input" name="email" value={email} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="Profile__data-row">
                                <div>
                                    <h6>Telefono</h6>
                                </div>
                                <div>
                                    <input type="text" className="Profile__data-input" name="phone" value={phone} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="Profile__data-row">
                                <div>
                                    <h6>Fecha de nacimiento</h6>
                                </div>
                                <div>
                                    <input type="date" className="Profile__data-input" name="birth" value={birth} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="Profile__data-row">
                                <div>
                                    <h6>Cargo</h6>
                                </div>
                                <div>
                                    {position}
                                </div>
                            </div>
                            <div className="Profile__data-row">
                                <div>
                                    <h6>Sector</h6>
                                </div>
                                <div>
                                    {sector}
                                </div>
                            </div>
                            <div className="Profile__data-row-button">
                                <button onClick={handleEdit} >Cancelar</button>
                                <button type="submit">{loading ? 'Espere...' : 'Guardar cambios'}</button>
                            </div>
                        </form>

                        :
                        <div className="Profile__data">
                            <div className="Profile__data-row">
                                <div><h6>User</h6></div>
                                <div><p>{user.user}</p></div>
                            </div>
                            <div className="Profile__data-row">
                                <div><h6>Nombre</h6></div>
                                <div><p>{user.nombre} {user.apellido}</p></div>
                            </div>
                            <div className="Profile__data-row">
                                <div>
                                    <h6>Email</h6>
                                </div>
                                <div>
                                    <p>{email && email}</p>
                                </div>
                            </div>
                            <div className="Profile__data-row">
                                <div><h6>Telefono</h6></div>
                                <div><p>{phone && phone}</p></div>
                            </div>
                            <div className="Profile__data-row">
                                <div><h6>Fecha de nacimiento</h6></div>
                                <div><p>{birth && formatDateProfile(birth)}</p></div>
                            </div>
                            <div className="Profile__data-row">
                                <div><h6>Cargo</h6></div>
                                <div><p>{position && position}</p></div>
                            </div>
                            <div className="Profile__data-row">
                                <div><h6>Sector</h6></div>
                                <div><p>{sector && sector}</p></div>
                            </div>
                            <div className="Profile__data-row-button">
                                <button onClick={handleEdit} className="Profile__data-button">Editar</button>
                            </div>
                        </div>
                }
            </div>
            <Footer />
        </>
    )
}

export default Profile
