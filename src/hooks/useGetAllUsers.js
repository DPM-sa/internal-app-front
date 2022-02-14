import { useState, useEffect } from 'react'
import * as api from '../services/api'
import { reverseUsers, sortGreatest, orderUsers } from '../utils/helpers'

export const useGetAllUsers = (editOrNewUser, typeOrder) => {
    const [users, setUsers] = useState([])
    const [loadingUsers, setLoadingUsers] = useState(false)
    const [usersQuantity, setUsersQuantity] = useState(0)
    const [usersActive, setUsersActive] = useState(0)
    const [usersInactive, setUsersInactive] = useState(0)

   

    const getUsers = async () => {
        setLoadingUsers(true)
        api.getAllUsers()
            .then(resp => {
                let usersActiveArr = resp.data.usuarios.filter(user => user.estado)
                let usersInactiveArr = resp.data.usuarios.filter(user => !user.estado)
                setUsersQuantity(resp.data.cuantos)
                setUsersActive(usersActiveArr.length)
                setUsersInactive(usersInactiveArr.length)
                if (typeOrder === 'alfabetico') {
                    setUsers(sortGreatest(resp.data.usuarios))
                } else if ((typeOrder === 'antiguos')) {
                    setUsers(orderUsers(resp.data.usuarios))
                } else if (typeOrder === 'recientes') {
                    setUsers(reverseUsers(resp.data.usuarios))
                }
                setLoadingUsers(false)
            })
    }

    useEffect(() => {
        getUsers()
    }, [editOrNewUser, typeOrder])


    return {
        users,
        loadingUsers,
        usersQuantity,
        usersActive,
        usersInactive,
        setUsers,
        getUsers
    }
}
