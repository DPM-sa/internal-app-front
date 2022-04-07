import { useState, useEffect } from 'react'
import { getReservasbySalaId } from '../services/api'

export const useGetReservasReuniones = (id) => {
    const [reservas, setReservas] = useState([]);
    const [loadingReservas, setLoadingReservas] = useState(false)

    const getReservasReuniones = () => {
        if (id) {
            console.log('get reservas...')
            setLoadingReservas(true)
            getReservasbySalaId(id)
                .then(resp => {
                    if (resp.data) {
                        console.log(resp.data.data)
                        setReservas(resp.data.data)
                    }
                    setLoadingReservas(false)
                })
                .catch(error => {
                    setLoadingReservas(false)
                })
        }
    }

    useEffect(() => {
        getReservasReuniones()
    }, [id])

    return { reservas, loadingReservas, getReservasReuniones }
}
