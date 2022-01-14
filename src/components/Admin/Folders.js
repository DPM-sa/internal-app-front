import React from 'react';
import sectores from '../../data/sectores';
import './Folders.css'

export const Folders = ({ openFolder, actualFolder }) => {
    
    const sect = [ { "label": "General" }, ...sectores ]

    const setActivo = ( sector ) => {
        openFolder( sector );
    }

    return (
        <div className="folders">
            {
                sect.map( s => (
                    <div
                        onClick={ () => setActivo( s.label ) }
                        className= { actualFolder === s.label ? "dir activo" : "dir" } 
                    >
                        {
                            actualFolder === s.label ?
                            <i className="far fa-folder-open"></i>
                            :
                            <i className="far fa-folder"></i>
                        }
                        
                        
                        <span>{ s.label }</span>
                    </div>
                ) )
            }
        </div>
    )
}