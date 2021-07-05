import React, { useState } from 'react'
import NavbarProfile from '../components/NavbarProfile'
import { useStateValue } from '../StateProvider'
import './Profile.css'
const Profile = () => {

    const [edit, setEdit] = useState(false)

    const handleEdit = () => {
        setEdit(!edit)
    }
    const [{ user }] = useStateValue()
    return (
        <>
            <NavbarProfile />
            <div className="Profile">
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex flex-column align-items-center text-center">
                            <img src="./assets/no-image.jpg" alt="Admin" className="rounded-circle" width="150" />
                            <div className="mt-3">
                                <h4>{user.nombre} {user.apellido}</h4>
                                <p className="text-secondary mb-1">{user.position && user.position}</p>
                                <p className="text-muted font-size-sm">{user.sector && user.sector}</p>
                                {edit && <p className="text-primary">Cambiar foto de perfil</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {
                    edit
                        ? <div className="card">
                            <div className="card-body">
                                <div className="row mb-3">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Full Name</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        <input type="text" className="form-control" value="John Doe" />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Email</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        <input type="text" className="form-control" value="john@example.com" />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Phone</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        <input type="text" className="form-control" value="(239) 816-9029" />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Mobile</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        <input type="text" className="form-control" value="(320) 380-4539" />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Address</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        <input type="text" className="form-control" value="Bay Area, San Francisco, CA" />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-3">
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        <input type="button" onClick={handleEdit} className="btn btn-secondary px-4" value="Cancelar" />
                                        <input type="button" className="btn btn-primary px-4" value="Save Changes" />
                                    </div>
                                </div>
                            </div>
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
