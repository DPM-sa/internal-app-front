import React, { useState } from 'react'
import { useHistory } from 'react-router'
import Swal from 'sweetalert2'
// import { useStateValue } from '../../StateProvider'
import './NewUser.css'
import { newComedorPOST } from '../../services/api'
import CreatableSelect from 'react-select/creatable';
import { DAYS } from '../../utils/days';

const NewComedor = () => {
    // const [{ editOrNewUser }, dispatch] = useStateValue()
    const [form, setForm] = useState({
        nombre: '',
        cantidadturnos: '',
        horamaximareserva: '12:00',
        diassemana: []
    })
    const { nombre, cantidadturnos, diassemana, horamaximareserva } = form
    const [loading, setLoading] = useState(false)

    const [nombreError, setNombreError] = useState('')
    const [cantidadTurnosError, setCantidadTurnosError] = useState('');
    const [horamaximareservaError, setHoramaximareservaError] = useState('');

    const history = useHistory()

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        if (nombre === '' || cantidadturnos === '') {
            setNombreError(nombre === "" ? 'El nombre es requerido' : '')
            setCantidadTurnosError(cantidadturnos === "" ? 'Cantidad de turnos requerido' : '')
            return
        }

        newComedorPOST(form)
            .then(() => {
                setLoading(false)
                Swal.fire('Éxito', 'El comedor se ha creado con éxito', 'success')
                    .then(resp => {
                        if (resp) { history.push('/comedoresadmin') }
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
        setForm({ ...form, diassemana: valuesToArray })
    }

    const handleReturn = () => {
        history.push('/comedoresadmin')
    }
    return (
        <div className="PostComments">
            <div className="PostComments__container">
                <h1>Crear un nuevo comedor</h1>
                <div className="NewUser__content">

                    <form onSubmit={handleSubmit} className="NewUser__data">
                        <div className="NewUser__data-row">
                            <label>Nombre del comedor</label>
                            <div>
                                <input disabled={loading} onChange={handleInputChange} type="text" name="nombre" value={nombre} />
                                {nombreError && !nombre && <span className="submitError">{nombreError}</span>}
                            </div>
                        </div>
                        <div className="NewUser__data-row">
                            <label>Cantidad de turnos</label>
                            <div>
                                <input disabled={loading} onChange={handleInputChange} type="number" name="cantidadturnos" value={cantidadturnos} />
                                {
                                    cantidadTurnosError && !cantidadturnos
                                    && <span className="submitError">{cantidadTurnosError}</span>
                                }
                            </div>
                        </div>

                        <div className="NewUser__data-row">
                            <label>Hora máxima de reserva</label>
                            <div>
                                <input disabled={loading} onChange={handleInputChange} type="time" name="horamaximareserva" value={horamaximareserva} />
                                {horamaximareservaError
                                    && !horamaximareserva
                                    && <span className="submitError">{horamaximareservaError}</span>}
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
                                value={DAYS.filter(val => diassemana?.includes(val.value))}
                            />

                        </div>

                        <div className="NewUser__data-buttons">
                            <button disabled={loading} type="submit">
                                <i classname="far fa-save"></i>
                                Guardar
                            </button>
                            <button disabled={loading} onClick={handleReturn} type="button">
                                <i classname="fas fa-chevron-left"></i>
                                Cancelar
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default NewComedor
