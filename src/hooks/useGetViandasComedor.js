import { useState, useEffect } from 'react'
import { getViandasbyComedorId } from '../services/api'

export const useGetViandasComedor = (id) => {
    const [viandas, setViandas] = useState([]);
    const [loadingViandas, setLoadingViandas] = useState(false)

    useEffect(() => {
        setLoadingViandas(true)
        getViandasbyComedorId(id)
            .then(resp => {
                if (resp.data.viandas) {
                    setViandas(resp.data.viandas)
                }
                setLoadingViandas(false)
            })
            .catch(error => {
                console.log(error)
                setLoadingViandas(false)
            })
    }, [])

    return { viandas, loadingViandas }
}
