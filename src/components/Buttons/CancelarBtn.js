import React from 'react'

const base = {
    borderRadius: '40px',
    padding: '10px 20px',
    alignSelf: 'flex-end',
    margin: 15
}

const _white = {
    backgroundColor: '#ffffff',
    color: 'white',
    border: 'none',
}

const _dark = {
    backgroundColor: '#ffffff',
    color: '#000000',
    border: '1px solid #000000',
}

const getStyle = (variation) => {
    switch(variation){
        case 'none':
            return base;
        case 'white':
            return {...base, ..._white};
        case 'dark':
            return {...base, ..._dark};
    }
}

export const CancelarBtn = ({ loading = false, handleBtn, title='Cancelar', variation='none', ...props }) => {
    return (
        <button 
            disabled={loading} 
            onClick={handleBtn} 
            type="button"
            style={getStyle(variation)}
            {...props}
        >
            <i className="fas fa-chevron-left"></i>
            {title}
        </button>
    )
}
