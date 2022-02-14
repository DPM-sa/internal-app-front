import { useState, useEffect } from 'react'
import { getReservasDiarias } from '../services/api'

export const useGetReservasDiarias = (id) => {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading ] =useState(false)
    const [error, setError ] =useState('')

    useEffect(() => {
        setLoading(true)
        getReservasDiarias(id)
            .then(resp => {
                console.log(resp)
                if (resp.data) {
                   // setReservas(resp.data.data)
                }
                setLoading(false)
                setError('')
            })
            .catch(error => {
                setLoading(false);
                setError(error.message)
            })
    }, [])

    return { reservas, loading, error }
}
