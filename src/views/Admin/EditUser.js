import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const EditUser = () => {
    const { id } = useParams()
    useEffect(() => {
        console.log(id)
    }, [])
    return (
        <div>

        </div>
    )
}

export default EditUser
