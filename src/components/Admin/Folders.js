import React, { useState } from 'react';
import sectores from '../../data/sectores';
import './Folders.css'

export const Folders = ({ openFolder }) => {
    
    const sect = [ { "label": "General" }, ...sectores ]
    const [ sectorActivo, setSectorActivo ] = useState("General");

    const setActivo = ( sector ) => {
        setSectorActivo( sector );
        openFolder( sector );
    }

    return (
        <div className="folders">
            {
                sect.map( s => (
                    <div
                        onClick={ () => setActivo( s.label ) }
                        className= { sectorActivo === s.label ? "dir activo" : "dir" } 
                    >
                        {
                            sectorActivo === s.label ?
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