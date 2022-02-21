import { useState, useEffect } from 'react'
import { getReservasUsuario } from '../services/api'

export const useGetReservasUsuario = (id) => {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const refreshReservas = (id) => {
        setLoading(true);
        getReservasUsuario(id)
        .then(resp => {
            if (resp.data) {
                setReservas(resp.data.data)
            }
            setLoading(false)
            setError('')
        })
        .catch(error => {
            setLoading(false);
            setError(error.message)
        })
    }

    useEffect(() => {
        refreshReservas()
    }, [])

    return { reservas, loading, error, refreshReservas }
}
