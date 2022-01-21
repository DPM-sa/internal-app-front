import React, { useEffect, useState } from 'react';
import './TabComponent.css';

export const TabComponent = ({ sector, openFolder, sectores = [] }) => {
    const [activo, setActivo] = useState("General");
    const [tabItems, setTabItems] = useState([])

    const triggerActivo = (_sector) => {
        setActivo(_sector);
        openFolder(_sector);
    }

    useEffect(() => {
        let _tabs = [
            { label: "General" },
            { label: sector }
        ]
        let otherSectores = sectores.map(sec => { return { label: sec } })
        setTabItems(_tabs.concat(otherSectores))
    }, [sectores]);
    
    // console.log(tabItems)

    return (
        <div className="tab-component">
            {tabItems.map(f => (
                <div
                    className={activo === f.label ? "item activo" : "item"}
                    onClick={() => triggerActivo(f.label)}
                >
                    {activo === f.label ?
                        <i className="far fa-folder-open"></i>
                        :
                        <i className="far fa-folder"></i>
                    }
                    <span>{f.label}</span>
                </div>
            ))}
        </div>
    )
}
