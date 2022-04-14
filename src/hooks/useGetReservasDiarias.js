import { useState, useEffect } from 'react'
import { getReservasDiarias } from '../services/api'
import { formatFecha } from '../utils/helpers';

export const useGetReservasDiarias = (id) => {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading ] =useState(false)
    const [error, setError ] =useState('')

    useEffect(() => {
        setLoading(true)
        getReservasDiarias(id)
            .then(resp => {
                if (resp.data) {

                    const filterUniqueData = [...new Map(resp.data.reservas.map(item =>
                        [item['date'], item])).values()];

                   setReservas(filterUniqueData.map(reserva => {return {
                       ...reserva,
                       formatteddate: formatFecha(reserva.date)
                   }}))
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
