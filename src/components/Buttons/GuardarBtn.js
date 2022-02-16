import React from 'react'

const _blue = {
    backgroundColor: '#004580',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '40px',
    border: 'none',
    alignSelf: 'flex-end'
}

const getStyle = (variation) => {
    switch(variation){
        case 'none':
            return {};
        case 'blue':
            return _blue;
    }
}

export const GuardarBtn = ({ loading = false, title = 'Guardar', variation = 'none', ...props }) => {
    return (
        <button 
            disabled={loading} 
            type="submit" 
            style={getStyle(variation)}
            {...props} 
        >
            <i className="far fa-save"></i>
            {title}
        </button>
    )
}
