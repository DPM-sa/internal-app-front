import React from 'react'

export const CancelarBtn = ({ loading = false, handleBtn, title='Cancelar', ...props }) => {
    return (
        <button 
            disabled={loading} 
            onClick={handleBtn} 
            type="button"
            {...props}
        >
            <i classname="fas fa-chevron-left"></i>
            {title}
        </button>
    )
}
