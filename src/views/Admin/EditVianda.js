import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router'
import Swal from 'sweetalert2'
// import { useStateValue } from '../../StateProvider'
import './NewUser.css'
import { editViandabyId } from '../../services/api'
import CreatableSelect from 'react-select/creatable';
import { DAYS } from '../../utils/days';
import { useGetVianda } from '../../hooks/useGetVianda'

const EditVianda = () => {
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
    const vianda = useGetVianda(id)


    useEffect(() => {
      if(vianda){
          setForm(vianda)
      }
    }, [vianda])
    


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

        editViandabyId(form, id)
            .then(() => {
                setLoading(false)
                Swal
                    .fire('Éxito', 'Los cambios se guardaron correctamente', 'success')
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
        history.push(`/comedoresadmin/edit/${vianda?.comedorId}`)
    }

    return (
        <div className="PostComments">
            <div className="PostComments__container">
                <h1>Editar vianda {vianda?.nombre}</h1>
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
                            <label>Precio</label>
                            <div>
                                <input
                                    disabled={loading}
                                    onChange={handleInputChange}
                                    type="number"
                                    name="precio"
                                    value={precio}
                                />
                            </div>
                        </div>

                        <div className="NewUser__data-buttons">
                            <button
                                disabled={loading}
                                type="submit"
                            >
                                <i className="far fa-save"></i>
                                Guardar
                            </button>
                            <button
                                disabled={loading}
                                onClick={handleReturn}
                                type="button"
                            >
                                <i className="fas fa-chevron-left"></i>
                                Volver
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default EditVianda
