import React from 'react'

const base = {
    borderRadius: '40px',
    alignSelf: 'flex-end',
    margin: 15,
    padding: '10px 20px',
}

const _blue = {
    backgroundColor: '#004580',
    color: 'white',
    
    border: 'none',
    alignSelf: 'flex-end'
}

const _white = {
    backgroundColor: '#ffffff',
    color: 'white',
    border: 'none',
    alignSelf: 'flex-end',
}

const _dark = {
    backgroundColor: '#ffffff',
    color: '#000000',
    border: '1px solid #000000',
}

const getStyle = (variation) => {
    switch (variation) {
        case 'none':
            return base;
        case 'blue':
            return { ...base, ..._blue };
        case 'dark':
            return { ...base, ..._dark };
        case 'white':
            return { ...base, ..._white };
    }
}

export const GuardarBtn = ({ loading = false, title = 'Guardar', variation = 'none', logo = true, ...props }) => {
    return (
        <button
            disabled={loading}
            type="submit"
            style={getStyle(variation)}
            {...props}
        >
            {logo && <i className="far fa-save"></i>}
            {title}
        </button>
    )
}
