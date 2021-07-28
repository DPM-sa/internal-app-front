import React, { useState } from 'react'
import axios from 'axios';
import { useStateValue } from '../../StateProvider';
import { useHistory } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import './Login.css'

const Login = () => {
    const [{ }, dispatch] = useStateValue()
    let headers = {
        'Content-Type': 'application/json'
    }
    const history = useHistory()
    const [form, setForm] = useState({
        username: "",
        password: ""
    })
    const { username, password } = form
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingRecover, setLoadingRecover] = useState(false)
    const [show, setShow] = useState(false);
    const [formRecover, setFormRecover] = useState({
        usernameRecover: ''
    })
    const { usernameRecover } = formRecover
    const [msg, setMsg] = useState('')
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        if (username === "" || password === "") return
        await axios.post('https://internal-app-dpm.herokuapp.com/login',
            {
                "user": `${username}`,
                "password": `${password}`
            },
            { headers }
        ).then(resp => {
            dispatch({
                type: 'LOGIN',
                token: resp.data.token,
                user: resp.data.usuario
            })
            setLoading(false)
            setError(false)
            history.push('/home')
        }).catch(() => {
            setLoading(false)
            setError(true)
        })
    }
    const handleRecoverChange = (e) => {
        setFormRecover({
            ...formRecover,
            [e.target.name]: e.target.value
        })
    }
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const sendRecoverPassword = async (e) => {
        e.preventDefault()
        if (usernameRecover === "") return
        setLoadingRecover(true)
        await axios.post('https://internal-app-dpm.herokuapp.com/recoverpassword',
            {
                "user": `${usernameRecover}`
            },
            { headers })
            .then((resp) => {
                if (resp.data.ok === true) {
                    setLoadingRecover(false)
                    setFormRecover({
                        usernameRecover: ''
                    })
                    setMsg('Enviado')
                } else if (resp.data.ok === false) {
                    setLoadingRecover(false)
                    setFormRecover({
                        usernameRecover: ''
                    })
                    setMsg('Error')
                }
            })
    }

    return (
        <>
            <div className="Login">
                <div className="card login-card">
                    <div className="row no-gutters">
                        <div className="col-md-5 Login__img-div">
                            <img src="./assets/fondo-login.png" alt="login" className="login-card-img" />
                            <div className="Login__img-content">
                                <div className="Login__logo-cropped">
                                    <img className="Login__logo" src="./assets/logo-footer.png" />
                                </div>
                                <p className="Login__text">Nuevo espacio de comunicación interna.</p>
                            </div>
                        </div>
                        <div className="col-md-7">
                            <div className="card-body">
                                <p className="login-card-description">Iniciar sesión</p>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label className="Login__label">Nombre de usuario</label>
                                        <input type="text" value={username} name="username" onChange={handleChange} className="form-control" />
                                    </div>
                                    <div className="form-group mb-4">
                                        <label className="Login__label">Password</label>
                                        <input type="password" value={password} name="password" onChange={handleChange} className="form-control" />
                                    </div>
                                    {
                                        !loading ?
                                            <button disabled={username === "" || password === ""} name="login" className="Login__button" type="submit"><i class="fas fa-check"></i> Iniciar sesión</button>
                                            :
                                            <button disabled name="login" className="Login__button" type="submit">Espere...</button>
                                    }
                                </form>
                                {error && <p className="Login__error">Nombre de usuario o contraseña incorrecto.</p>}
                                <p className="forgot-password-link">¿Olvidaste tu usuario o contraseña?</p>
                                <p onClick={handleShow} className="forgot-password-link">Hace <u>click aquí</u></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal className="Login__modal" show={show} onHide={handleClose}>
                <Modal.Header>
                    <button onClick={handleClose} className="Login__modal-button-close">
                        <span aria-hidden="true">×</span>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={sendRecoverPassword}>
                        <label>Enviar correo a RRHH notificando que olvidé mi contraseña</label>
                        <input name="usernameRecover" value={usernameRecover} onChange={handleRecoverChange} className="Login__modal-input" type="text" placeholder="Ingresa tu nombre de usuario" />
                    </form>
                    {
                        msg !== ''
                        &&
                        <p className={msg === 'Error' ? 'recover-msg error' : 'recover-msg success'}>{msg}</p>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <button className="Login__modal-button" onClick={handleClose}>
                        Cerrar
                    </button>
                    <button disabled={usernameRecover === ""} className="Login__modal-button" onClick={sendRecoverPassword}>
                        {loadingRecover ? 'Espere...' : 'Enviar'}
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Login
