import React, { useState } from 'react'
import axios from 'axios';
import { useStateValue } from '../StateProvider';
import { useHistory } from 'react-router-dom';
import './Login.css'

const Login = () => {
    const [{ }, dispatch] = useStateValue()
    const [form, setForm] = useState({
        username: "",
        password: ""
    })

    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    const history = useHistory()
    const { username, password } = form

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        let headers = {
            'Content-Type': 'application/json'
        }
        setLoading(true)
        axios.post('https://internal-app-dpm.herokuapp.com/login',
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

    return (
        <div className="Login">
            <div className="card login-card">
                <div className="row no-gutters">
                    <div className="col-md-5 Login__img-div">
                        <img src="./assets/fondo-login.png" alt="login" className="login-card-img" />
                        <div className="Login__img-content">
                            <img className="Login__logo" src="./assets/logo-footer.png" />
                            <p>Nuevo espacio de comunicación interna.</p>
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
                                <input name="login" className="Login__button" type="submit" value="Iniciar sesión" />
                            </form>
                            <p className="forgot-password-link">Olvidaste tu usuario o contraseña?</p>
                            <p className="forgot-password-link">Hace click aqui</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login
