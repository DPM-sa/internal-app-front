import axios from 'axios'
import React, { useState } from 'react'
import NavbarProfile from '../components/NavbarProfile'
import { useStateValue } from '../StateProvider'
import { firebase, storage } from '../config/firebase'
import './Profile.css'
const Profile = () => {
    const [{ user, token }] = useStateValue()
    const [edit, setEdit] = useState(false)
    const [form, setForm] = useState({
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        phone: user.phone ? user.phone : "",
        birth: user.birth ? user.birth : "",
        position: user.position ? user.position : "",
        sector: user.sector ? user.sector : ""
    })
    const [imageProfile, setImageProfile] = useState(user.image ? user.image : '')
    const { nombre, apellido, email, phone, birth, position, sector } = form
    const handleEdit = () => {
        setEdit(!edit)
    }
    const headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
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
            .then(resp => {
                console.log(resp)
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
        const file = e.target.files[0]
        const storageRef = storage.ref().child('profileImages').child(`${user.user}`)
        const res = await storageRef.put(file)
        const url = await storageRef.getDownloadURL()
        setImageProfile(url)
    }
    return (
        <>
            <NavbarProfile />
            <div className="Profile">
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex flex-column align-items-center text-center">
                            <img src={imageProfile ? imageProfile : './assets/no-image.jpg'} alt="Admin" className="rounded-circle" width="150" />
                            <div className="mt-3">
                                <h4>{user.nombre} {user.apellido}</h4>
                                <p className="text-secondary mb-1">{user.position && user.position}</p>
                                <p className="text-muted font-size-sm">{user.sector && user.sector}</p>
                                <input
                                    id="fileSelector"
                                    type="file"
                                    name="file"
                                    style={{ display: "none" }}
                                    onChange={handleFileChange}
                                />
                                {edit && <p onClick={handlePictureClick} className="text-primary">Cambiar foto de perfil</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {
                    edit
                        ? <div className="card">
                            <form className="card-body" onSubmit={handleSubmit} >
                                <div className="row mb-3">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Nombre</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        <input type="text" className="form-control" name="nombre" value={nombre} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Apellido</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        <input type="text" className="form-control" name="apellido" value={apellido} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Email</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        <input type="text" className="form-control" name="email" value={email} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Telefono</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        <input type="text" className="form-control" name="phone" value={phone} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Fecha de nacimiento</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        <input type="date" className="form-control" name="birth" value={birth} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Cargo</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        <input type="text" className="form-control" name="position" value={position} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Sector</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        <input type="text" className="form-control" name="sector" value={sector} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-3">
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        <button onClick={handleEdit} className="btn btn-secondary px-4 mr-1">Cancelar</button>
                                        <button className="btn btn-primary px-4" type="submit">Guardar cambios</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        :
                        <div className="card mb-3">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">User</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">{user.user}</div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Nombre</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">{user.nombre} {user.apellido}</div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Email</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">{user.email && user.email}</div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Telefono</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">{user.phone && user.phone}</div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Fecha de nacimiento</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">{user.birth && user.birth}</div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Cargo</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">{user.position && user.position}</div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Sector</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">{user.sector && user.sector}</div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-12">
                                        <button onClick={handleEdit} className="btn btn-info">Edit</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </div>
        </>
    )
}

export default Profile
