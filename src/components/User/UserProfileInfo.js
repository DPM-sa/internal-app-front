import React from 'react'
import { useStateValue } from '../../StateProvider'

const UserProfileInfo = ({ }) => {

    const [{ user }, dispatch] = useStateValue()

    const formatDateProfile = (date) => {
        let dateSubs = date.substring(0, 10)
        let dateToArray = dateSubs.split('-')
        let dateToArrayReverse = dateToArray.reverse()
        let dateJoined = dateToArrayReverse.join('-')
        return dateJoined
    }

    const handleEdit = () => {
        dispatch({
            type: 'SET_EDIT_PROFILE',
            editProfile: true
        })
    }
    return (
        <div className="Profile__data">
            <div className="Profile__data-row">
                <div><h6>Usuario</h6></div>
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
                    <p>{user.correo && user.correo}</p>
                </div>
            </div>
            <div className="Profile__data-row">
                <div><h6>Telefono</h6></div>
                <div><p>{user.phone && user.phone}</p></div>
            </div>
            <div className="Profile__data-row">
                <div><h6>Fecha de nacimiento</h6></div>
                <div><p>{user.birth && formatDateProfile(user.birth)}</p></div>
            </div>
            <div className="Profile__data-row">
                <div><h6>Cargo</h6></div>
                <div><p>{user.position && user.position}</p></div>
            </div>
            <div className="Profile__data-row">
                <div><h6>Sector</h6></div>
                <div><p>{user.sector && user.sector}</p></div>
            </div>
            <div className="Profile__data-row-button">
                <button onClick={handleEdit} className="Profile__data-button">
                    <i classname="fas fa-pen"></i>
                    Editar
                </button>
            </div>
        </div>
    )
}

export default UserProfileInfo
