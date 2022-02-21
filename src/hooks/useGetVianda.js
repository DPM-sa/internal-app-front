import { useState, useEffect } from 'react'
import { getViandabyId } from '../services/api'

export const useGetVianda = (id) => {
    const [vianda, setVianda] = useState();

    useEffect(() => {
        if (id) {
            getViandabyId(id)
                .then(resp => {
                    // console.log(resp)
                    if (resp?.data?.user) {
                        setVianda(resp.data.user)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }, [id])

    return vianda 
}
