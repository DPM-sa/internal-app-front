import React, { useState, useEffect } from 'react'
import NavbarProfile from '../../components/User/NavbarProfile'
import Footer from '../../components/User/Footer'
import WhatsappBtn from '../../components/User/WhatsappBtn'
import Banner from '../../components/User/Banner'
import './Sugerencias.css'
import './ComedorUser.css'
import { CancelarBtn } from '../../components/Buttons/CancelarBtn'
import { GuardarBtn } from '../../components/Buttons/GuardarBtn'
import { useGetAllComedores } from '../../hooks/useGetAllComedores'
import { useGetViandasComedor } from '../../hooks/useGetViandasComedor'
import { cancelarReserva, newReservaVianda } from '../../services/api'
import Swal from 'sweetalert2'
import { useHistory } from 'react-router-dom'
import { useGetReservasUsuario } from '../../hooks/useGetReservasUsuario'
import { useGetVianda } from '../../hooks/useGetVianda'
import { DAYS } from '../../utils/days'
import { validarHoraLimite } from '../../utils/helpers'

const ViandaInfo = ({ id, cantidad }) => {
    const info = useGetVianda(id);
    return <>
        <td>{info?.nombre}</td>
        <td>{cantidad}</td>
        <td>{cantidad * info?.precio}</td>
    </>
}


const MisReservas = ({ reservas, comedores, refreshReservas }) => {
    const handleCancelarReserva = (idReserva, fecha) => {
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
                if (validarHoraLimite('12:00am', fecha)) {
                    cancelarReserva(idReserva)
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
                } else {
                    Swal.fire(
                        'Lo sentimos.',
                        'Ya es muy tarde para cancelar la reserva',
                        'error'
                    )
                }
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
                        <th>Vianda</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Fecha</th>
                        <th>Comedor</th>
                        <th>Turno</th>
                        <th style={{ width: '40%', textAlign: 'right' }}></th>
                    </tr>
                    {reservas.map(reserva => (
                        <tr key={reserva._id} style={{ textDecoration: reserva.habilitado ? '' : 'line-through' }}>
                            <ViandaInfo id={reserva?.viandas[0]} cantidad={reserva?.cantidad} />
                            <td>{reserva.date.substring(0, 10)}</td>
                            <td>{comedores && comedores.find(c => c._id === reserva.comedorId)?.nombre}</td>
                            <td>
                                {comedores && comedores.find(c => c._id === reserva.comedorId)?.
                                    turnos.find(t => t._id === reserva?.turno)?.nombre || ''}
                            </td>

                            <td style={{ width: '40%', textAlign: 'right' }}>
                                {reserva.habilitado ?
                                    <>
                                        Cancelar reserva
                                        <span style={{ width: 30, marginLeft: 5 }}>
                                            <i
                                                onClick={() => handleCancelarReserva(reserva._id, reserva.date.substring(0, 10))}
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

const initialState = {
    cantidad: 1,
    date: '',
    turno: '',
    vianda: '',
    total: ''
}

const ComedorUser = () => {
    const history = useHistory()
    const { comedores } = useGetAllComedores();
    const [turnosDisponibles, setTurnosDisponibles] = useState([])
    const [form, setForm] = useState({ ...initialState, comedorId: '' })
    const { comedorId, date, turno, vianda, cantidad, total } = form;
    const { viandas } = useGetViandasComedor(comedorId)
    const [loading, setLoading] = useState(false)
    const { reservas, refreshReservas } = useGetReservasUsuario()
    const [day, setDay] = useState('')
    const [today, setToday] = useState('')

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleInputDate = (e) => {
        let selectedDay = new Date(e.target.value);
        selectedDay = selectedDay.getDay();
        let diaSemanaSeleccionado = DAYS[selectedDay]?.value
        setToday(diaSemanaSeleccionado)
        let _comedor = comedores.filter(comedor => comedor._id === comedorId);
        let esDiaValido = _comedor[0].diassemana.includes(diaSemanaSeleccionado)
        if (!esDiaValido) {
            setForm({ ...form, date: '' })
            setDay(`Solo esta habilitado los dias (${_comedor[0].diassemana.map(d => d)})`)
        } else {
            setForm({ ...form, date: e.target.value })
            setDay('')
        }
    }

    useEffect(() => {
        if (comedorId) {
            const selected = comedores.find(c => c._id === comedorId)
            setTurnosDisponibles(selected.turnos || [])
            setForm({ ...form, ...initialState })
        }
    }, [comedorId])

    useEffect(() => {
        if (vianda && cantidad) {
            const selected = viandas.find(F => F._id === vianda)
            const _total = selected?.precio * cantidad || 0
            setForm({ ...form, total: _total })
        }
    }, [cantidad, vianda])


    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);
        const nombreComedor = await comedores.filter(c => c._id === comedorId)[0].nombre;
        const nombreVianda = await viandas.filter(v => v._id === vianda)[0].nombre;

        if (validarHoraLimite('12:00am', form.date)) {
            newReservaVianda({ 
                ...form, 
                viandas: [vianda],
                nombreComedor,
                nombreVianda
                })
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
        } else {
            Swal.fire('Lo sentimos.', 'No es posible realizar una reserva en la fecha indicada.', 'error')
                .then((resp) => {
                    if (resp) { setLoading(false) }
                })
        }


    }

    return (
        <>
            <NavbarProfile />
            <Banner
                image={"./assets/header-comedor.jpg"}
                title={'Reservá tu vianda'}
                content={'Aquí podés reservar tu lugar para mañana en los comedores de la empresa'}
                linkto={'comedor'}
            />

            <div className="Sugerencias" id="comedor" align='center' style={{ paddingTop: 50 }}>
                <h3>
                    Completa el formulario y reservá tu vianda
                </h3>

                <div style={{ paddingBottom: 50, borderBottom: '2px solid #004580' }}>
                    <form className='comedor-user-form' onSubmit={handleSubmit}>
                        <div >
                            <label>Comedor</label>
                            <select required name='comedorId' value={comedorId} onChange={handleInputChange}>
                                <option value=''>Seleccionar...</option>
                                {comedores && comedores.map(c => c.habilitado && <option value={c._id} key={c._id}>{c.nombre}</option>)}
                            </select>
                        </div>

                        <div>
                            <label>Fecha</label>
                            <input required type='date' name='date' value={date} onChange={handleInputDate} disabled={!comedorId} />
                            {day && <span style={{ fontSize: 10, marginLeft: 5, color: 'red', display: 'block', paddingLeft: 100, marginBottom: 30 }}>{day}</span>}
                        </div>

                        <div>
                            <label>Turno</label>
                            <select required name='turno' value={turno} onChange={handleInputChange} disabled={!comedorId} >
                                <option>Seleccionar...</option>
                                {turnosDisponibles && turnosDisponibles.map(t => <option value={t._id} key={t._id}>{t.nombre}</option>)}
                            </select>
                        </div>
                        <div>
                            <label>Vianda</label>
                            <select required name='vianda' value={vianda} onChange={handleInputChange} >
                                <option>Seleccionar...</option>
                                {viandas && viandas.filter(v => v.habilitado && v.diassemana.includes(today)).map(v => <option value={v._id} key={v._id}>{v.nombre + ' -  $' + v.precio}</option>)}
                            </select>
                        </div>
                        <div>
                            <label>Cantidad</label>
                            <input disabled type='number' value={cantidad} name='cantidad' onChange={handleInputChange} />
                        </div>
                        <div>
                            <label>Total</label>
                            <input required type='number' disabled value={total} />
                        </div>

                        {!loading && <div >
                            <GuardarBtn title='Reservar' variation='blue' logo={false} />
                        </div>}

                    </form>

                </div>

                <MisReservas reservas={reservas} comedores={comedores} refreshReservas={refreshReservas} />

            </div>

            <WhatsappBtn />
            <Footer />
        </>

    )
}

export default ComedorUser
