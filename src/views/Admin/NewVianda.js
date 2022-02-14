import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router'
import Swal from 'sweetalert2'
// import { useStateValue } from '../../StateProvider'
import './NewUser.css'
import { newViandaPOST } from '../../services/api'
import CreatableSelect from 'react-select/creatable';
import { DAYS } from '../../utils/days';

const NewVianda = () => {
    const { id } = useParams();
    const history = useHistory();
    const [form, setForm] = useState({
        nombre: '',
        descripcion: '',
        cantidad: 0,
        diassemana: [],
        precio: 0,
        habilitado: true
    });
    const { nombre, descripcion, cantidad, diassemana, precio } = form;
    const [loading, setLoading] = useState(false);
    const [nombreError, setNombreError] = useState('');

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        if (nombre === '') {
            setNombreError(nombre === "" ? 'El nombre es requerido' : '')
            return
        }

        newViandaPOST({ ...form, comedorId: id })
            .then(() => {
                setLoading(false)
                Swal
                    .fire('Éxito', 'La vianda se ha creado con éxito', 'success')
                    .then(resp => {
                        if (resp) { handleReturn() }
                    })
            })
            .catch(() => {
                Swal
                    .fire('Error', 'Ha ocurrido un error, comuníquese con el administrador', 'error')
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
        history.push(`/comedoresadmin/edit/${id}`)
    }

    return (
        <div className="PostComments">
            <div className="PostComments__container">
                <h1>Crear nueva vianda</h1>
                <div className="NewUser__content">

                    <form onSubmit={handleSubmit} className="NewUser__data">
                        <div className="NewUser__data-row">
                            <label>Nombre de la vianda</label>
                            <div>
                                <input
                                    disabled={loading}
                                    onChange={handleInputChange}
                                    type="text"
                                    name="nombre"
                                    value={nombre}
                                />
                                {/* {nombreError && !nombre && <span className="submitError">{nombreError}</span>} */}
                            </div>
                        </div>
                        <div className="NewUser__data-row">
                            <label>Descripción corta</label>
                            <div>
                                <input
                                    disabled={loading}
                                    onChange={handleInputChange}
                                    type="text"
                                    name="descripcion"
                                    value={descripcion}
                                />
                                {/* {
                                    cantidadTurnosError && !cantidadturnos
                                    && <span className="submitError">{cantidadTurnosError}</span>
                                } */}
                            </div>
                        </div>

                        <div className="NewUser__data-row">
                            <label>Cantidad disponible</label>
                            <div>
                                <input
                                    disabled={loading}
                                    onChange={handleInputChange}
                                    type="number"
                                    name="cantidad"
                                    value={cantidad}
                                />
                                {/* {horamaximareservaError
                                    && !horamaximareserva
                                    && <span className="submitError">{horamaximareservaError}</span>} */}
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

                        <div className="NewUser__data-row">
                            <label>precio</label>
                            <div>
                                <input
                                    disabled={loading}
                                    onChange={handleInputChange}
                                    type="number"
                                    name="precio"
                                    value={precio}
                                />
                                {/* {horamaximareservaError
                                    && !horamaximareserva
                                    && <span className="submitError">{horamaximareservaError}</span>} */}
                            </div>
                        </div>

                        <div className="NewUser__data-buttons">
                            <button
                                disabled={loading}
                                type="submit"
                            >
                                <i classname="far fa-save"></i>
                                Guardar
                            </button>
                            <button
                                disabled={loading}
                                onClick={handleReturn}
                                type="button"
                            >
                                <i classname="fas fa-chevron-left"></i>
                                Volver
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default NewVianda
