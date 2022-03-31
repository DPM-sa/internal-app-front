import React, { useState } from 'react'
import { useHistory } from 'react-router'
import Swal from 'sweetalert2'
// import { useStateValue } from '../../StateProvider'
import './NewUser.css'
import { newSalaPOST } from '../../services/api'
import CreatableSelect from 'react-select/creatable';
import { DAYS } from '../../utils/days';

const NewSala = () => {
    const [form, setForm] = useState({
        nombre: '',
        direccion: '',
        diasdisponible: [],
        duracion_minima:'',
        duracion_maxima:'',
        horarioapertura:'',
        horariocierre:'',
        usoproyector:false
    })
    const { 
        nombre, 
        direccion,
        diasdisponible, 
        duracion_minima,
        duracion_maxima,
        horarioapertura,
        horariocierre,
        usoproyector
    } = form
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    const handleInputChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        setForm({ ...form, [e.target.name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        newSalaPOST(form)
            .then(() => {
                setLoading(false)
                Swal.fire('Éxito', 'La sala de reuniones se ha creado con éxito', 'success')
                    .then(resp => {
                        if (resp) { history.push('/reunionesadmin') }
                    })
            })
            .catch(() => {
                Swal.fire('Error', 'Ha ocurrido un error, comuníquese con el administrador', 'error')
                    .then((resp) => {
                        if (resp) { setLoading(false) }
                    })
            })
    }

    const handleDiasSemana = (values) => {
        const valuesToArray = values.map(item => item.value)
        setForm({ ...form, diasdisponible: valuesToArray })
    }

    const handleReturn = () => {
        history.push('/reunionesadmin')
    }

    return (
        <div className="PostComments">
            <div className="PostComments__container">
                <h1>Crear una nueva sala de reuniones</h1>
                <div className="NewUser__content">

                    <form onSubmit={handleSubmit} className="NewUser__data">
                        <div className="NewUser__data-row">
                            <label>Nombre de la sala</label>
                            <div>
                                <input 
                                    disabled={loading} 
                                    onChange={handleInputChange} 
                                    type="text" 
                                    name="nombre" 
                                    value={nombre} 
                                />
                            </div>
                        </div>

                        <div className="NewUser__data-row">
                            <label>Dirección de la sala</label>
                            <div>
                                <input 
                                    disabled={loading} 
                                    onChange={handleInputChange} 
                                    type="text" 
                                    name="direccion" 
                                    value={direccion} 
                                />
                            </div>
                        </div>

                        <div className="NewUser__data-row">
                            <label>Duración mínima de reunión</label>
                            <div>
                                <input 
                                    disabled={loading} 
                                    onChange={handleInputChange} 
                                    type="number" 
                                    name="duracion_minima" 
                                    value={duracion_minima} 
                                    placeholder='ingresar cantidad de minutos...'
                                />
                            </div>
                        </div>

                        <div className="NewUser__data-row">
                            <label>Duración máxima de reunión</label>
                            <div>
                                <input 
                                    disabled={loading} 
                                    onChange={handleInputChange} 
                                    type="number" 
                                    name="duracion_maxima" 
                                    value={duracion_maxima} 
                                    placeholder='ingresar cantidad de minutos...'
                                />
                            </div>
                        </div>

                        <div className="NewUser__data-row">
                            <label>Hora apertura de sala</label>
                            <div>
                                <input 
                                    disabled={loading} 
                                    onChange={handleInputChange}
                                    type="time" 
                                    name="horarioapertura" 
                                    value={horarioapertura} 
                                />
                            </div> 
                        </div>

                        <div className="NewUser__data-row">
                            <label>Hora de cierre de sala</label>
                            <div>
                                <input 
                                    disabled={loading} 
                                    onChange={handleInputChange} 
                                    type="time" 
                                    name="horariocierre" 
                                    value={horariocierre} 
                                />
                            </div> 
                        </div>

                        <div className="NewUser__data-row">
                            <label>Días disponibles</label>
                            <CreatableSelect
                                isMulti
                                onChange={handleDiasSemana}
                                options={DAYS}
                                placeholder="Elegir dias"
                                classNamePrefix="react-select"
                                value={DAYS.filter(val => diasdisponible?.includes(val.value))}
                            />
                        </div>

                        <div className="NewUser__data-row">
                            <label>Permitir uso del proyector</label>
                            <div>
                                <input 
                                    disabled={loading} 
                                    onChange={handleInputChange} 
                                    type="checkbox" 
                                    name="usoproyector" 
                                    checked={usoproyector} 
                                />
                            </div> 
                            <div></div>
                        </div>

                        <div className="NewUser__data-buttons">
                            <button disabled={loading} type="submit">
                                <i className="far fa-save"></i>
                                Guardar
                            </button>
                            <button disabled={loading} onClick={handleReturn} type="button">
                                <i className="fas fa-chevron-left"></i>
                                Cancelar
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default NewSala
