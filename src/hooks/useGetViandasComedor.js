import { useState, useEffect } from 'react'
import { getViandasbyComedorId } from '../services/api'

export const useGetViandasComedor = (id) => {
    const [viandas, setViandas] = useState([]);
    const [loadingViandas, setLoadingViandas] = useState(false)

    const getViandas = () => {
        if (id) {
            console.log('get viandas...')
            setLoadingViandas(true)
            getViandasbyComedorId(id)
                .then(resp => {
                    if (resp.data.viandas) {
                        setViandas(resp.data.viandas)
                    }
                    setLoadingViandas(false)
                })
                .catch(error => {
                    setLoadingViandas(false)
                })
        }
    }

    useEffect(() => {
        getViandas()
    }, [id])

    return { viandas, loadingViandas, getViandas }
}
