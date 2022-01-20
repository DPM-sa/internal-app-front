import { useState, useEffect } from 'react'
import { getCumples } from '../services/api'
import { toStringCumplesArr } from '../utils/birthdayParser'

// const formattedData = ['Yanina Arce', 'Milea Tosoni', 'Betiana Re', 'Fabian Figueredo', 'Leandro Bulacio']

const newMockCumples = [
    {
        nombre: 'Yanina',
        apellido: 'Arce',
        user: '',
        date: '',
        correo: '',
        role: '',
        sector: '',
        position: '',
        image: '',
        birth: '',
        phone: '',
        estado: '',
        fileId: ''
    },
    {
        nombre: 'Milea',
        apellido: 'Tosoni',
        user: '',
        date: '',
        correo: '',
        role: '',
        sector: '',
        position: '',
        image: '',
        birth: '',
        phone: '',
        estado: '',
        fileId: ''
    },
    {
        nombre: 'Betiana',
        apellido: 'Re',
        user: '',
        date: '',
        correo: '',
        role: '',
        sector: '',
        position: '',
        image: '',
        birth: '',
        phone: '',
        estado: '',
        fileId: ''
    },
    {
        nombre: 'Fabian',
        apellido: 'Figueredo',
        user: '',
        date: '',
        correo: '',
        role: '',
        sector: '',
        position: '',
        image: '',
        birth: '',
        phone: '',
        estado: '',
        fileId: ''
    },
    {
        nombre: 'Leandro',
        apellido: 'Bulacio',
        user: '',
        date: '',
        correo: '',
        role: '',
        sector: '',
        position: '',
        image: '',
        birth: '',
        phone: '',
        estado: '',
        fileId: ''
    }]

export const useGetBirthdays = () => {
    const [cumples, setCumples] = useState([])
    const [hayCumples, setHayCumples] = useState(false)

    useEffect(() => {
        getCumples()
            .then(resp => {
                // resp.usuarios = newMockCumples;
                if (resp?.usuarios?.length > 0) {
                    let formattedData = toStringCumplesArr(resp.usuarios)
                    setCumples(formattedData.join(' - '))
                    setHayCumples(formattedData.length > 0)
                }
            })
    }, [])

    return {
        cumples,
        hayCumples
    }
}
