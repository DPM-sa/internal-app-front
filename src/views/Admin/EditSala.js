import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router'
import Swal from 'sweetalert2'
import './EditComedor.css'
import './BibliotecaAdmin.css'
import { editSala } from '../../services/api'
import CreatableSelect from 'react-select/creatable';
import { DAYS } from '../../utils/days';
import { useGetSala } from '../../hooks/useGetSala'
import { useGetReservasReuniones } from '../../hooks/useGetReservasReuniones'
import { GuardarBtn } from '../../components/Buttons/GuardarBtn'
import { CancelarBtn } from '../../components/Buttons/CancelarBtn'
import { CardReunion } from '../../components/Cards/CardReunion'


const EditSala = () => {
    const { id } = useParams()
    const history = useHistory()
    const [form, setForm] = useState({
        nombre: '',
        direccion: '',
        diasdisponible: [],
        duracion_minima: '',
        duracion_maxima: '',
        horarioapertura: '',
        horariocierre: '',
        usoproyector: false
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
    const info = useGetSala(id)
    const { reservas, loadingReservas, getReservasReuniones } = useGetReservasReuniones(id)

    useEffect(() => {
        if (!info.error && info.infoForm) {
            setForm(info.infoForm)
        }
    }, [info]);

    const handleInputChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        setForm({ ...form, [e.target.name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        editSala(form, id)
            .then(() => {
                setLoading(false)
                Swal.fire('Éxito', 'La sala se ha actualizado con éxito', 'success')
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

    return (
        <div className="PostComments">
            <div className="PostComments__container">
                <h1>Editar Sala "{nombre}"</h1>
                <div className="NewComedor__content">

                    <form onSubmit={handleSubmit} className="NewComedor__data">
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


                        <div className="NewComedor__data-buttons">
                            <GuardarBtn loading={loading} variation='dark' />
                            <CancelarBtn loading={loading} variation='dark' handleBtn={() => history.push('/reunionesadmin')} />
                        </div>
                    </form>

                </div>

                <div className="BibliotecaAdmin-files cards">
                    {loadingReservas && <p>Cargando...</p>}
                    {!loadingReservas &&
                        reservas.map(item => <CardReunion item={item} key={item._id} handleRefresh={getReservasReuniones} />)}
                </div>
            </div>
        </div>
    )
}

export default EditSala
