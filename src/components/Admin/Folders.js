import React from 'react';
import sectores from '../../data/sectores';
import './Folders.css'

export const Folders = ({
    openFolder,
    actualFolder,
    editor = false,
    sectoresEditor = []
}) => {

    console.log(sectoresEditor)

    const _sectoresEditor = sectoresEditor.map(s => { return { "label": s } })
    const sect = editor ?
        [{ "label": "General" }, ..._sectoresEditor]
        : [{ "label": "General" }, ...sectores]

    const setActivo = (sector) => openFolder(sector);

    return (
        <div className="folders">
            {
                sect.map(s => (
                    <div
                        onClick={() => setActivo(s.label)}
                        className={actualFolder === s.label ? "dir activo" : "dir"}
                    >
                        {
                            actualFolder === s.label ?
                                <i className="far fa-folder-open"></i>
                                :
                                <i className="far fa-folder"></i>
                        }


                        <span>{s.label}</span>
                    </div>
                ))
            }
        </div>
    )
}