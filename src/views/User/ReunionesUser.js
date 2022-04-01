import React, { useState, useEffect } from 'react'
import NavbarProfile from '../../components/User/NavbarProfile'
import Footer from '../../components/User/Footer'
import WhatsappBtn from '../../components/User/WhatsappBtn'
import Banner from '../../components/User/Banner'
import './Sugerencias.css'
import './ComedorUser.css'
import './ReunionesUser.css'
import { GuardarBtn } from '../../components/Buttons/GuardarBtn'
import { useGetAllSalas } from '../../hooks/useGetAllSalas'
import { cancelarReservaSala, newReservaSala } from '../../services/api'
import Swal from 'sweetalert2'
import { useHistory } from 'react-router-dom'
import { useGetReunionesReservasUsuario } from '../../hooks/useGetReunionesReservasUsuario'
import { DAYS } from '../../utils/days'
import CreatableSelect from 'react-select/creatable';
import moment from 'moment'


const MisReservas = ({ reservas, salas, refreshReservas }) => {
    const handleCancelarReserva = (reserva) => {
        Swal.fire({
            title: '¿Estás seguro que deseas cancelar?',
            text: "No podrás deshacer los cambios",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, deseo cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                cancelarReservaSala(reserva)
                    .then(resp => {
                        Swal.fire(
                            'Cancelado!',
                            'Tu reserva ha sido cancelada',
                            'success'
                        ).then(() => refreshReservas())
                    }
                    )
                    .catch(e =>
                        Swal.fire(
                            'Ha ocurrido un error!',
                            'Tu reserva no pudo ser cancelada',
                            'error'
                        )
                    )

            }
        })
    }

    return (
        <>
            <h3>Mis reservas</h3>
            <div style={{ marginBottom: 80 }}>
                {reservas.length === 0 && <p>No tienes reservas</p>}
                <table className='tabla-mis-reservas'>
                    <tr>
                        <th>Sala</th>
                        <th>Nombre de la reunión</th>
                        <th style={{width:100}}>Fecha</th>
                        <th>Hora inicio</th>
                        <th>Hora fin</th>
                        <th></th>
                    </tr>
                    {reservas.map(reserva => (
                        <tr key={reserva._id} style={{ textDecoration: reserva.habilitado ? '' : 'line-through' }}>
                            <td>{salas && salas.find(c => c._id === reserva.salaId)?.nombre}</td>
                            <td>{reserva.nombrereunion}</td>
                            <td>{reserva.date.substring(0, 10)}</td>
                            <td>{reserva.horainicio}</td>
                            <td>{reserva.horafin}</td>
                            <td style={{ width: '40%', textAlign: 'right' }}>
                                {reserva.habilitado ?
                                    <>
                                        Cancelar reserva
                                        <span style={{ width: 30, marginLeft: 5 }}>
                                            <i
                                                onClick={() => handleCancelarReserva(reserva)}
                                                className="fas fa-trash-alt" ></i>
                                        </span>
                                    </> : 'Cancelado'}
                            </td>

                        </tr>
                    ))}
                </table>

            </div>
        </>
    )
}

const ReunionesUser = () => {
    const history = useHistory()
    const { salas } = useGetAllSalas();
    const [form, setForm] = useState({ cantidad: 1 })
    const { nombrereunion, salaId, invitados, date, solicitarproyector, horafin, horainicio } = form;
    const [loading, setLoading] = useState(false)
    const { reservas, refreshReservas } = useGetReunionesReservasUsuario()
    const [day, setDay] = useState('')
    const [errorHoraInicio, setErrorHoraInicio] = useState('')
    const [errorHoraFin, setErrorHoraFin] = useState('')

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleEmails = (e) => {
        setForm({ ...form, invitados: e })
    }

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

    const handleHoraInicio = (e) => {
        let _sala = salas.filter(sala => sala._id === salaId);
        if (_sala[0].horarioapertura) {
            let horaApertura = moment(`${_sala[0].horarioapertura}am`, 'HH:mma');
            let inicioUser = moment(`${e.target.value}am`, 'HH:mma');
            if (inicioUser.isAfter(horaApertura)) {
                setForm({ ...form, horainicio: e.target.value })
                setErrorHoraInicio('')
            } else {
                setForm({ ...form, horainicio: '' })
                setErrorHoraInicio(`Abre a partir de las ${_sala[0].horarioapertura}`)
            }

        }
    }

    const handleHoraFin = (e) => {
        let _sala = salas.filter(sala => sala._id === salaId);
        if (_sala[0].horariocierre) {
            let horariocierre = moment(`${_sala[0].horariocierre}am`, 'HH:mma');
            let horaFinUser = moment(`${e.target.value}am`, 'HH:mma');
            if (horaFinUser.isBefore(horariocierre)) {
                setForm({ ...form, horafin: e.target.value })
                setErrorHoraFin('')
            } else {
                setForm({ ...form, horafin: '' })
                setErrorHoraFin(`La sala cierra a las  ${_sala[0].horariocierre}`)
            }
        }
    }


    useEffect(() => {
        if (salaId) {

        }
    }, [salaId])


    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        // console.log({ ...form, invitados: form.invitados.map(e => e.value) })
        newReservaSala({ ...form, invitados: form.invitados.map(e => e.value) })
            .then(() => {
                setLoading(false)
                Swal.fire('Éxito', 'Su reserva se ha realizado con éxito', 'success')
                    .then(resp => {
                        if (resp) {
                            history.push('/home')
                        }
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
        <>
            <NavbarProfile />
            <Banner
                image={"./assets/header-reserva-sala-reuniones.jpg"}
                title={'Organizá una reunión'}
                content={'Aquí puedes reservar la sala de reuniones'}
                linkto={'reuniones'}
            />

            <div className="Sugerencias" id="reuniones" style={{ paddingTop: 50 }}>

                <div style={{ paddingBottom: 50, borderBottom: '2px solid #004580' }} align='center' >
                    <h3>
                        Completá el formulario y reservá la sala de reuniones
                    </h3>
                    <form className='comedor-user-form' onSubmit={handleSubmit}>
                        <div>
                            <label>Sala</label>
                            <select required name='salaId' value={salaId} onChange={handleInputChange}>
                                <option>Seleccionar...</option>
                                {salas && salas.map(c => <option value={c._id} key={c._id}>{c.nombre}</option>)}
                            </select>
                        </div>
                        <div>
                            <label>Fecha</label>
                            <input
                                required
                                type='date'
                                name='date'
                                value={date}
                                onChange={handleInputDate}
                            />
                            <span style={{ fontSize: 10, marginLeft: 5, color: 'red' }}>{day}</span>
                        </div>
                        <div>
                            <label>Hora de inicio</label>
                            <input required type='time' name='horainicio' value={horainicio} onChange={handleHoraInicio} />
                            <span style={{ fontSize: 10, marginLeft: 5, color: 'red' }}>{errorHoraInicio}</span>
                        </div>
                        <div>
                            <label>Hora de finalización</label>
                            <input required type='time' name='horafin' value={horafin} onChange={handleHoraFin} />
                            <span style={{ fontSize: 10, marginLeft: 5, color: 'red' }}>{errorHoraFin}</span>
                        </div>
                        <div>
                            <label>Nombre de la reunión</label>
                            <input required type='text' name='nombrereunion' value={nombrereunion} onChange={handleInputChange} />
                        </div>
                        <br />
                        <div>
                            <label>Invitados</label>
                            <CreatableSelect
                                isMulti
                                onChange={handleEmails}
                                // options={DAYS}
                                placeholder="Emails de invitados..."
                                classNamePrefix="react-select"
                                value={invitados}
                            />
                        </div>
                        <br />
                        <div>
                            <label>Solicitar proyector</label>
                            <select required name='solicitarproyector' value={solicitarproyector} onChange={handleInputChange}>
                                <option value={true}>No</option>
                                <option value={false}>Si</option>
                            </select>
                        </div>
                        {!loading && <div >
                            <GuardarBtn title='Reservar' variation='blue' logo={false} />
                        </div>}

                    </form>

                </div>

                <MisReservas
                    reservas={reservas}
                    salas={salas}
                    refreshReservas={refreshReservas}
                />

            </div>

            <WhatsappBtn />
            <Footer />
        </>

    )
}

export default ReunionesUser
