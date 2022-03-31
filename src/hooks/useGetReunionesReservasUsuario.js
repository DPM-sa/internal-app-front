import { useState, useEffect } from 'react'
import { getReunionesReservasUsuario } from '../services/api'

export const useGetReunionesReservasUsuario = (id) => {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const refreshReservas = (id) => {
        setLoading(true);
        getReunionesReservasUsuario(id)
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
