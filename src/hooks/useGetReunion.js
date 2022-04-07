import { useState, useEffect } from 'react'
import { getReunion } from '../services/api'

export const useGetReunion = (id) => {
    const [info, setInfo] = useState({
        infoForm: '',
        error: ''
    });

    useEffect(() => {
        getReunion(id)
            .then(resp => {
                if (resp.data) {
                    setInfo({
                        infoForm: {...resp.data.data },
                    })
                }
            })
            .catch(error => setInfo({error}))
    }, [])

    return info
}
