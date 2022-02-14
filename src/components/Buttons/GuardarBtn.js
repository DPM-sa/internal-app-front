import React from 'react'

export const GuardarBtn = ({ loading=false }) => {
    return (
        <button disabled={loading} type="submit">
            <i classname="far fa-save"></i>
            Guardar cambios
        </button>
    )
}
