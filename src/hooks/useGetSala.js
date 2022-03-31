import { useState, useEffect } from 'react'
import { getSala } from '../services/api'

export const useGetSala = (id) => {
    const [info, setInfo] = useState({
        infoForm: '',
        error: ''
    });

    useEffect(() => {
        getSala(id)
            .then(resp => {
                if (resp.data) {
                    console.log(resp.data)
                    setInfo({
                        infoForm: {...resp.data.data },
                    })
                }
            })
            .catch(error => setInfo({error}))
    }, [])

    return info
}
