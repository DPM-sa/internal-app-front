import axios from 'axios'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'
import { useStateValue } from '../StateProvider'

const SugerenciaItem = ({ sugerencia }) => {
    const [{ token }, dispatch] = useStateValue()
    const [userMessage, setUserMessage] = useState({})
    const headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }
    const getPostDate = (date) => {
        return moment(date).format('D MMM YYYY')
    }
    const renderTooltipSee = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Ver Sugerencia
        </Tooltip>
    );
    const getUser = async () => {
        await axios.get(`https://internal-app-dpm.herokuapp.com/usuario/${sugerencia.userId}`, { headers })
            .then(resp => {
                setUserMessage(resp.data.user)
            })
    }

    useEffect(() => {
        getUser()
    }, [])
    const handleClick = () => {
        dispatch({
            type: 'SET_SUGERENCIA',
            sugerenciaSelected: sugerencia,
            userMessage
        })
    }
    return (
        <li className="PostsAdmin-posts-list-control">
            <span>{sugerencia.title}</span>
            <span>{userMessage.nombre} {userMessage.apellido}</span>
            <span>{getPostDate(sugerencia.date)}</span>
            <span className="posts-lists-control-actions">
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 100, hide: 100 }}
                    overlay={renderTooltipSee}
                >
                    <i
                        onClick={handleClick}
                        className='button-watch-post far fa-eye'
                    ></i>
                </OverlayTrigger>
            </span>
        </li>
    )
}

export default SugerenciaItem
