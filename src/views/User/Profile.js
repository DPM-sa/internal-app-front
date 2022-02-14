import axios from 'axios'
import React, { useState, useEffect } from 'react'
import NavbarProfile from '../../components/User/NavbarProfile'
import { useStateValue } from '../../StateProvider'
import { storage } from '../../config/firebase'
import './Profile.css'
import Footer from '../../components/User/Footer'
import EditProfileInfo from '../../components/User/EditProfileInfo'
import UserProfileInfo from '../../components/User/UserProfileInfo'
import { v4 as uuidv4 } from 'uuid';

const Profile = () => {
    const [{ user, token, editProfile }, dispatch] = useStateValue()

    let headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const [imageProfile, setImageProfile] = useState(user.image ? user.image : '')

    const [loadingImg, setLoadingImg] = useState(false)

    const handlePictureClick = () => {
        document.querySelector("#fileSelector").click()
    }
    const handleFileChange = async (e) => {
        setLoadingImg(true)
        const file = e.target.files[0]
        /*si no tiene fileId, se le asigna uno, para evitar la sobrecarga en storage de firebase */
        if (!user.fileId || user.fileId === "") {
            let fileId = uuidv4()
            const storageRef = storage.ref().child('profileImages').child(`${fileId}`)
            const res = await storageRef.put(file)
            const url = await storageRef.getDownloadURL()
            await axios.put(`https://internal-app-dpm.herokuapp.com/usuario/${user._id}`,
                {
                    "image": `${url}`,
                    "fileId": `${fileId}`
                },
                { headers })
                .then((resp) => {
                    dispatch({
                        type: 'LOGIN',
                        user: resp.data.usuario,
                        token: token
                    })
                    setImageProfile(url)
                    setLoadingImg(false)
                })
        } else {
            const storageRef = storage.ref().child('profileImages').child(`${user.fileId}`)
            const res = await storageRef.put(file)
            const url = await storageRef.getDownloadURL()
            await axios.put(`https://internal-app-dpm.herokuapp.com/usuario/${user._id}`,
                {
                    "image": `${url}`
                },
                { headers })
                .then((resp) => {
                    dispatch({
                        type: 'LOGIN',
                        user: resp.data.usuario,
                        token: token
                    })
                    setImageProfile(url)
                    setLoadingImg(false)
                })
        }
    }

    const handleDeleteImage = () => {
        setLoadingImg(true)
        const storageRef = storage.ref().child('profileImages').child(`${user.fileId}`)
        storageRef.delete().then(async () => {
            await axios.put(`https://internal-app-dpm.herokuapp.com/usuario/${user._id}`,
                {
                    "image": ""
                },
                { headers })
                .then((resp) => {
                    dispatch({
                        type: 'LOGIN',
                        user: resp.data.usuario,
                        token: token
                    })
                    setImageProfile('')
                    setLoadingImg(false)
                })
        })
    }

    return (
        <div className="Profile__component">
            <NavbarProfile />
            <div className="Profile">
                <div className="card-body">
                    <div className="d-flex flex-column align-items-center text-center">
                        {imageProfile ? <img src={imageProfile} className="profile-image-medium rounded-circle mb-2" width="150" /> : <i classname="far fa-user no-image-profile-medium mb-2"></i>}
                        {editProfile && !loadingImg
                            &&
                            <>
                                <p className="editImage" onClick={handlePictureClick}>
                                    <i classname="fas fa-plus"></i>
                                    Cambiar foto de perfil
                                </p>
                                <p className="editImage" onClick={handleDeleteImage}>
                                    <i classname="fas fa-trash-alt"></i>
                                    Eliminar foto de perfil
                                </p>
                            </>
                        }
                        {
                            editProfile && loadingImg
                            &&
                            <p className="text-secondary">Cargando...</p>
                        }
                        <div className="mt-3">
                            <h4 className="Profile__name">¡Hola {user.nombre} {user.apellido}!</h4>
                            <p className="Profile__info">{user.position}</p>
                            <p className="Profile__info">{user.sector}</p>
                            <input
                                id="fileSelector"
                                type="file"
                                name="file"
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                </div>

                {
                    editProfile
                        ?
                        <EditProfileInfo imageProfile={imageProfile} />

                        :
                        <UserProfileInfo />
                }
            </div>
            <Footer />
        </div>
    )
}

export default Profile