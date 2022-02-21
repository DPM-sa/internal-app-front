import { useState, useEffect } from 'react'
import { getInformesMensuales } from '../services/api'

export const useGetInformesMensuales = (id) => {
    const [informes, setInformes] = useState([]);
    const [loading, setLoading ] =useState(false)
    const [error, setError ] =useState('')

    useEffect(() => {
        setLoading(true)
        getInformesMensuales(id)
            .then(resp => {
                if (resp.data) {
                   setInformes(resp.data.viandas)
                }
                setLoading(false)
                setError('')
            })
            .catch(error => {
                setLoading(false);
                setError(error.message)
            })
    }, [])

    return { informes, loading, error, reservasTotales: informes?.length }
}
