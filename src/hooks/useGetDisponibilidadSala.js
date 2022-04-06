import { useState, useEffect, useCallback } from 'react'
import { getDisponibilidadSala } from '../services/api'

export const useGetDisponibilidadSala = (salaId, date) => {
    const [reservasDelDia, setReservas] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const refreshDisponibilidad = (_salaId, _date) => {
        setLoading(true);
        getDisponibilidadSala(_salaId, _date)
            .then(resp => {
                console.log(resp)
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
        if (salaId && date) {
            refreshDisponibilidad(salaId, date)
        }
    }, [salaId, date])

    return { reservasDelDia, loading, error, refreshDisponibilidad }
}
