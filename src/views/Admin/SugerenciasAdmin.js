import axios from 'axios'
import React, { useEffect, useState } from 'react'
import SidebarAdmin from '../../components/SidebarAdmin'
import SugerenciaItem from '../../components/SugerenciaItem'
import { useStateValue } from '../../StateProvider'
import './SugerenciasAdmin.css'
const SugerenciasAdmin = () => {
    const [{ token, sugerenciaSelected, userMessage }] = useStateValue()
    const headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }
    const [sugerencias, setSugerencias] = useState([])

    const getSugerencias = async () => {
        await axios.get(`https://internal-app-dpm.herokuapp.com/allmessages`, { headers })
            .then(resp => setSugerencias(resp.data.messages))
    }
    useEffect(() => {
        getSugerencias()
    }, [])

    return (
        <>
            <SidebarAdmin />
            <div className="PostsAdmin">
                <div className="PostsAdmin-container">
                    <h1>Sugerencias Recibidas</h1>
                    <div className="SugerenciasAdmin">
                        <ul className="PostsAdmin-posts-list">
                            <li className="PostsAdmin-posts-list-header">
                                <span>Sugerencia</span>
                                <span>Nombre</span>
                                <span>Fecha</span>
                                <span>Acciones</span>
                            </li>
                            <ul className="PostsAdmin-posts-list-body">
                                {
                                    sugerencias.map(sugerencia => (
                                        <SugerenciaItem sugerencia={sugerencia} />
                                    ))
                                }
                            </ul>
                        </ul>
                        <div className="border-sugerencias"></div>
                        {
                            sugerenciaSelected
                            &&
                            <div className="messageSelected">

                                <div className="messageSelected-title">
                                    <label>Titulo</label>
                                    <p>{sugerenciaSelected.title}</p>
                                </div>

                                <div className="messageSelected-user">
                                    <span>
                                        <label>Colaborador</label>
                                        <p>{userMessage.nombre} {userMessage.apellido}</p>
                                    </span>
                                    <span>
                                        <label>Cargo</label>
                                        <p>{userMessage.position}</p>
                                    </span>
                                    <span>
                                        <label>Sector</label>
                                        <p>{userMessage.sector}</p>
                                    </span>
                                </div>

                                <div className="messageSelected-content">
                                    <label>Sugerencia</label>
                                    <div>
                                        {sugerenciaSelected.content}
                                    </div>
                                </div>

                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default SugerenciasAdmin
