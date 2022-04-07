import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router'
import Swal from 'sweetalert2'
import './EditComedor.css'
import './BibliotecaAdmin.css'
import { editReunion } from '../../services/api'
import { DAYS } from '../../utils/days';
import { useGetReunion } from '../../hooks/useGetReunion'
import { GuardarBtn } from '../../components/Buttons/GuardarBtn'
import { CancelarBtn } from '../../components/Buttons/CancelarBtn'
import { useGetDisponibilidadSala } from '../../hooks/useGetDisponibilidadSala'
import { useGetAllSalas } from '../../hooks/useGetAllSalas'
import {
    gethoraMomentFormat,
    validarDisponibilidad,
    validarSihayReservasIntermedias
} from '../../utils/validacionesHorarios';
import CreatableSelect from 'react-select/creatable';

const EditReunion = () => {
    const { id } = useParams()
    const info = useGetReunion(id)
    const history = useHistory()
    const { salas } = useGetAllSalas();
    const [form, setForm] = useState({})
    const { nombrereunion, salaId, invitados, date, solicitarproyector, horafin, horainicio } = form;
    const [loading, setLoading] = useState(false)
    const [day, setDay] = useState('')
    const [errorHoraInicio, setErrorHoraInicio] = useState('')
    const [errorHoraFin, setErrorHoraFin] = useState('')
    const { reservasDelDia } = useGetDisponibilidadSala(salaId, date)

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleEmails = (e) => {
        setForm({ ...form, invitados: e })
    }

    useEffect(() => {
        if (!info.error && info.infoForm) {
            setForm({ 
                ...info.infoForm,
                date: info.infoForm.date?.substring(0, 10),
                invitados: info.infoForm?.invitados?.map(e => { return { value: e, label: e}})
            })
            console.log('info.infoForm', info.infoForm)
        }
    }, [info]);

    const handleInputDate = (e) => {
        let selectedDay = new Date(e.target.value);
        selectedDay = selectedDay.getDay();
        let diaSemanaSeleccionado = DAYS[selectedDay]?.value
        let _sala = salas.filter(sala => sala._id === salaId);
        let esDiaValido = _sala[0].diasdisponible.includes(diaSemanaSeleccionado)
        if (!esDiaValido) {
            setForm({ ...form, date: '' })
            setDay(`Solo esta habilitado los dias (${_sala[0].diasdisponible.map(d => d)})`)
        } else {
            setForm({ ...form, date: e.target.value })
            setDay('')
        }
    }

    const handleHoraInicio = async (e) => {
        const horaElegida = e.target.value;
        let _sala = salas.filter(sala => sala._id === salaId),
            horaApertura = gethoraMomentFormat(_sala[0].horarioapertura),
            inicioUser = gethoraMomentFormat(horaElegida)

        if (inicioUser.isAfter(horaApertura) && reservasDelDia) {
            const estaDisponible = await validarDisponibilidad(inicioUser, reservasDelDia)
            if (estaDisponible) {
                setForm({ ...form, horainicio: horaElegida, horafin: '' })
                setErrorHoraInicio('')
            } else {
                setForm({ ...form, horainicio: '', })
                setErrorHoraInicio(`La sala ya fue reservada en ese horario`)
            }
        } else {
            setForm({ ...form, horainicio: '' })
            setErrorHoraInicio(`Abre a partir de las ${_sala[0].horarioapertura}`)
        }
    }

    const handleHoraFin = async (e) => {
        setForm({ ...form, horafin: '' })
        const horaElegida = e.target.value;
        let _sala = salas.filter(sala => sala._id === salaId),
            horariocierre = gethoraMomentFormat(_sala[0].horariocierre),
            horaFinUser = gethoraMomentFormat(horaElegida)

        if (horaFinUser.isBefore(horariocierre) && reservasDelDia) {
            const estaDisponible = await validarDisponibilidad(horaFinUser, reservasDelDia)
            if (estaDisponible) {
                const nohayreservasIntermedias = await validarSihayReservasIntermedias(horainicio, horaElegida, reservasDelDia)
                if (nohayreservasIntermedias) {
                    setForm({ ...form, horafin: horaElegida })
                    setErrorHoraFin('')
                } else {
                    setErrorHoraFin(`La sala ya fue reservada en ese horario`)
                }
            } else {
                setErrorHoraFin(`La sala ya fue reservada en ese horario`)
            }
        } else {
            setErrorHoraFin(`La sala cierra a las  ${_sala[0].horariocierre}`)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        editReunion({ ...form, invitados: form?.invitados?.map(e => e.value) }, id)
            .then(() => {
                setLoading(false)
                Swal.fire('Éxito', 'La reunión se ha actualizado con éxito', 'success')
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


    return (
        <div className="PostComments">
            <div className="PostComments__container">
                <h1>Editar reunión "{nombrereunion}"</h1>
                <div className="NewComedor__content">

                    <form onSubmit={handleSubmit} className="NewComedor__data">
                        <div className="NewUser__data-row">
                            <label>Nombre de la reunión</label>
                            <div>
                                <input required type='text' name='nombrereunion' value={nombrereunion} onChange={handleInputChange} />
                            </div>
                        </div>

                        <div className="NewUser__data-row">
                            <label>Sala</label>
                            <div>
                                <select required name='salaId' value={salaId} onChange={handleInputChange}>
                                    <option>Seleccionar...</option>
                                    {salas && salas.map(sala => sala.habilitado && <option value={sala._id} key={sala._id}>{sala.nombre}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="NewUser__data-row">
                            <label>Fecha</label>
                            <div>
                                <input
                                    required
                                    type='date'
                                    name='date'
                                    value={date}
                                    onChange={handleInputDate}
                                />
                                <span style={{ fontSize: 10, marginLeft: 5, color: 'red' }}>{day}</span>
                            </div>
                        </div>

                        <div className="NewUser__data-row">
                            <label>Hora de inicio</label>
                            <div>
                                <input required type='time' name='horainicio' value={horainicio} onChange={handleHoraInicio} />
                                <span style={{ fontSize: 10, marginLeft: 5, color: 'red' }}>{errorHoraInicio}</span>
                            </div>
                        </div>

                        <div className="NewUser__data-row">
                            <label>Hora de finalización</label>
                            <div>
                                <input required type='time' name='horafin' value={horafin} onChange={handleHoraFin} />
                                <span style={{ fontSize: 10, marginLeft: 5, color: 'red' }}>{errorHoraFin}</span>
                            </div>
                        </div>

                        <div className="NewUser__data-row">
                            <label>Invitados</label>
                            <div>
                                <CreatableSelect
                                    isMulti
                                    onChange={handleEmails}
                                    // options={DAYS}
                                    placeholder="Emails de invitados..."
                                    classNamePrefix="react-select"
                                    value={invitados}
                                />  </div>
                        </div>

                        <div className="NewUser__data-row">
                            <label>Solicitar proyector</label>
                            <div>
                                <select required name='solicitarproyector' value={solicitarproyector} onChange={handleInputChange}>
                                    <option value={true}>No</option>
                                    <option value={false}>Si</option>
                                </select>
                            </div>
                        </div>


                        <div className="NewComedor__data-buttons">
                            <GuardarBtn loading={loading} variation='dark' />
                            <CancelarBtn loading={loading} variation='dark' handleBtn={() => history.push('/reunionesadmin')} />
                        </div>

                    </form>

                </div>

            </div>
        </div>
    )
}

export default EditReunion
