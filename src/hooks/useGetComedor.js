import { useState, useEffect } from 'react'
import { getComedor } from '../services/api'

export const useGetComedor = (id) => {
    const [comedorInfo, setComedorInfo] = useState({
        comedorForm: '',
        error: ''
    });

    useEffect(() => {
        getComedor(id)
            .then(resp => {
                if (resp.data) {
                    setComedorInfo({
                        comedorForm: {
                            cantidadturnos: resp.data.data.cantidadturnos,
                            date: resp.data.data.date,
                            diassemana: resp.data.data.diassemana,
                            habilitado: resp.data.data.habilitado,
                            horamaximareserva: resp.data.data.horamaximareserva,
                            nombre:  resp.data.data.nombre,
                            turnos:  resp.data.data.turnos
                        },
                    })
                }
            })
            .catch(error => setComedorInfo({error}))
    }, [])

    return comedorInfo
}
