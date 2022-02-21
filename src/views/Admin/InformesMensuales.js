import React from 'react'
import { useHistory, useParams } from 'react-router'
import { CancelarBtn } from '../../components/Buttons/CancelarBtn'
import { DarkTable } from '../../components/Tables/DarkTable'
import { useGetComedor } from '../../hooks/useGetComedor'
import { useGetInformesMensuales } from '../../hooks/useGetInformesMensuales'
import './EditComedor.css'

const InformesMensuales = () => {
    const { id } = useParams()
    const history = useHistory()
    const { reservas } = useGetInformesMensuales(id);
    const { comedorForm } = useGetComedor(id)

    return (
        <div className="PostComments">
            <div className="PostComments__container">
                <h1>Informes mensuales de "{comedorForm.nombre}"</h1>
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

export default InformesMensuales

