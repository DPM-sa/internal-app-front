import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router'
import Swal from 'sweetalert2'
import './EditComedor.css'
import './BibliotecaAdmin.css'
import { editComedor } from '../../services/api'
import CreatableSelect from 'react-select/creatable';
import { DAYS } from '../../utils/days';
import { useGetComedor } from '../../hooks/useGetComedor'
import { useGetViandasComedor } from '../../hooks/useGetViandasComedor'
import { DescargasBtn } from '../../components/Buttons/DescargasBtn'
import { GuardarBtn } from '../../components/Buttons/GuardarBtn'
import { CancelarBtn } from '../../components/Buttons/CancelarBtn'
import { CardVianda } from '../../components/Cards/CardVianda'


const EditComedor = () => {
    const { id } = useParams()
    const history = useHistory()
    const [form, setForm] = useState({
        nombre: '',
        cantidadturnos: '',
        horamaximareserva: '',
        diassemana: []
    })
    const { nombre, cantidadturnos, diassemana, horamaximareserva } = form
    const [loading, setLoading] = useState(false)

    const [nombreError, setNombreError] = useState('')
    const [cantidadTurnosError, setCantidadTurnosError] = useState('');
    const [horamaximareservaError, setHoramaximareservaError] = useState('');

    const comedorInfo = useGetComedor(id)
    const { viandas, loadingViandas } = useGetViandasComedor(id)

    console.log(viandas)

    useEffect(() => {
        if (!comedorInfo.error && comedorInfo.comedorForm) {
            setForm(comedorInfo.comedorForm)
        }
    }, [comedorInfo]);

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

        editComedor(form, id)
            .then(() => {
                setLoading(false)
                Swal.fire('Éxito', 'El comedor se ha actualizado con éxito', 'success')
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

    return (
        <div className="PostComments">
            <div className="PostComments__container">
                <h1>Editar comedor "{nombre}"</h1>
                <div className="NewComedor__content">

                    <form onSubmit={handleSubmit} className="NewComedor__data">
                        <div className="NewComedor__data-row">
                            <label>Nombre del comedor</label>
                            <div>
                                <input disabled={loading} onChange={handleInputChange} type="text" name="nombre" value={nombre} />
                                {nombreError && !nombre && <span className="submitError">{nombreError}</span>}
                            </div>
                        </div>
                        <div className="NewComedor__data-row">
                            <label>Cantidad de turnos</label>
                            <div>
                                <input disabled={loading} onChange={handleInputChange} type="number" name="cantidadturnos" value={cantidadturnos} />
                                {
                                    cantidadTurnosError && !cantidadturnos
                                    && <span className="submitError">{cantidadTurnosError}</span>
                                }
                            </div>
                        </div>

                        <div className="NewComedor__data-row">
                            <label>Hora máxima de reserva</label>
                            <div>
                                <input disabled={loading} onChange={handleInputChange} type="time" name="horamaximareserva" value={horamaximareserva} />
                                {horamaximareservaError
                                    && !horamaximareserva
                                    && <span className="submitError">{horamaximareservaError}</span>}
                            </div>
                        </div>

                        <div className="NewComedor__data-row">
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

                        <div className="NewComedor__data-buttons">
                            <GuardarBtn loading={loading} />
                            <CancelarBtn loading={loading} handleBtn={() => history.push('/comedoresadmin')} />
                        </div>
                    </form>

                    <div className="NewComedor__pic">
                        <button
                            onClick={() => history.push(`/comedoresadmin/newvianda/${id}`)}
                            className="Upload-pic"
                        >
                            <p>+</p>
                            <p>Añadir vianda</p>
                        </button>
                    </div>

                    <div className="NewComedor__pic">
                        <DescargasBtn
                            onClick={() => history.push(`/comedoresadmin/reservasdiarias/${id}`)}
                            title='Descargas reservas diarias'
                        />
                        <DescargasBtn
                            onClick={() => history.push(`/comedoresadmin/informesmensuales/${id}`)}
                            title='Descargas informes mensuales'
                        />
                    </div>

                </div>

                <div className="BibliotecaAdmin-files cards">
                    {loadingViandas && <p>Cargando...</p>}
                    {!loadingViandas &&
                        viandas.map(item => <CardVianda item={item} key={item._id} />)}
                </div>
            </div>
        </div>
    )
}

export default EditComedor
