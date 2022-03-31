import { useState, useEffect, useCallback } from 'react'
import * as api from '../services/api'
import { reverseUsers, sortGreatest, orderUsers } from '../utils/helpers'

export const useGetAllSalas = (editOrNewUser='', typeOrder='alfabetico') => {
    const [salas, setSalas] = useState([])
    const [loadingSalas, setLoadingSalas] = useState(false)

    const getSalas = useCallback(() => {
        setLoadingSalas(true)
        api.getSalas()
            .then(resp => {
                if (typeOrder === 'alfabetico') {
                    setSalas(sortGreatest(resp.data.messages))
                } else if ((typeOrder === 'antiguos')) {
                    setSalas(orderUsers(resp.data.messages))
                } else if (typeOrder === 'recientes') {
                    setSalas(reverseUsers(resp.data.messages))
                }
                setLoadingSalas(false)
            })
            .catch(error => {
                console.log(error) 
                setLoadingSalas(false)
            })
    })

    useEffect(() => {
        getSalas()
    }, [editOrNewUser, typeOrder])


    return {
        salas,
        loadingSalas,
        getSalas
    }
}
