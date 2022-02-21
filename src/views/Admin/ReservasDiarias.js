import React from 'react'
import { useHistory, useParams } from 'react-router'
import { CancelarBtn } from '../../components/Buttons/CancelarBtn'
import { DarkTable } from '../../components/Tables/DarkTable'
import { useGetComedor } from '../../hooks/useGetComedor'
import { useGetReservasDiarias } from '../../hooks/useGetReservasDiarias'
import './EditComedor.css'

const ReservasDiarias = () => {
    const { id } = useParams()
    const history = useHistory()
    const { reservas } = useGetReservasDiarias(id);
    const { comedorForm } = useGetComedor(id)

    console.log(reservas)
    return (
        <div className="PostComments">
            <div className="PostComments__container">
                <h1>Reservas diarias de "{comedorForm.nombre}"</h1>
                <div className="NewComedor__content">
                    <DarkTable
                        data={reservas}
                        headers={['Reservas diarias', 'Fecha', 'Acciones']}
                        fields={[`_id`]}
                    />
                </div>
                <div style={{ padding: 15 }}>
                    <CancelarBtn
                        title=' Volver'
                        handleBtn={() => history.push(`/comedoresadmin/edit/${id}`)}
                        style={{
                            backgroundColor: 'transparent',
                            color: '#ffffff',
                            border: '#ffffff 1px solid',
                            padding: '5px 10px',
                            borderRadius: '40px'
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default ReservasDiarias

