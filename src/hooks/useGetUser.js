import { useState, useEffect } from 'react'
import { getUser } from '../services/api'

export const useGetUser = (id) => {
    const [userInfo, setUserInfo] = useState({
        userForm:'',
        role:'',
        fileId:'',
        image: '',
        error: ''
    });

    useEffect(() => {
        getUser(id)
            .then(resp => {
                console.log(resp.data)
                if (resp.data) {
                    setUserInfo({
                        userForm:{
                            user: resp.data.user.user,
                            nombre: resp.data.user.nombre,
                            apellido: resp.data.user.apellido,
                            email: resp.data.user.correo ? resp.data.user.correo : '',
                            phone: resp.data.user.phone ? resp.data.user.phone : '',
                            birth: resp.data.user.birth ? resp.data.user.birth : '',
                            position: resp.data.user.position,
                            sector: resp.data.user.sector,
                            sectores: resp.data.user.sectores?.filter(sec => sec != resp.data.user.sector),
                            password: null
                        },
                        role: resp.data.user.role,
                        fileId: resp.data.user.fileId,
                        image: resp.data.user.image ? resp.data.user.image : ''
                    })
                }
            })
    }, [])

    return userInfo
}
