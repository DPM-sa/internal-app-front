import React, { useState } from 'react';
import './TabComponent.css';

export const TabComponent = ({ sector, openFolder }) => {

    const [ activo, setActivo ] = useState("General");

    const tabItems = [
        { label: "General" },
        { label: sector }
    ];

    const triggerActivo = ( sector ) => {
        setActivo( sector );
        openFolder( sector );
    }

    return (
        <div className="tab-component">
            { tabItems.map( f => (
                <div className=
                {
                    activo === f.label ?
                    "item activo"
                    :                
                    "item"
                }
                onClick={ () => triggerActivo( f.label ) }
                >
                {
                    activo === f.label ?
                    <i className="far fa-folder-open"></i>
                    :
                    <i className="far fa-folder"></i>
                }
                <span>{ f.label }</span>
                </div>
            ))
            
            }
        </div>
    )
}
