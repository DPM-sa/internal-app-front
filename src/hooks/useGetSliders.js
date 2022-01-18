import { useState, useEffect } from 'react'
import { getSliders } from '../services/api'

export const useGetSliders = () => {
    const [slider, setSlider] = useState([])

    useEffect(() => {
        getSliders()
            .then(resp => {
                setSlider(resp.data.slidersDB)
            })
    }, [])

    return { slider }
}
