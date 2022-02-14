import { useState, useEffect } from 'react'
import * as api from '../services/api'
import { reverseUsers, sortGreatest, orderUsers } from '../utils/helpers'

export const useGetAllComedores = (editOrNewUser, typeOrder) => {
    const [comedores, setComedores] = useState([])
    const [loadingComedores, setLoadingComedores] = useState(false)

    const getComedores = async () => {
        setLoadingComedores(true)
        api.getComedores()
            .then(resp => {
                if (typeOrder === 'alfabetico') {
                    setComedores(sortGreatest(resp.data.messages))
                } else if ((typeOrder === 'antiguos')) {
                    setComedores(orderUsers(resp.data.messages))
                } else if (typeOrder === 'recientes') {
                    setComedores(reverseUsers(resp.data.messages))
                }
                setLoadingComedores(false)
            })
            .catch(error => console.log(error))
    }

    useEffect(() => {
        getComedores()
    }, [editOrNewUser, typeOrder])


    return {
        comedores,
        loadingComedores,
        getComedores
    }
}
