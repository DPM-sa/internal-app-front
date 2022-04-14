import React from 'react'
import { useHistory, useParams } from 'react-router'
import { CancelarBtn } from '../../components/Buttons/CancelarBtn'
import { useGetComedor } from '../../hooks/useGetComedor'
import './EditComedor.css'
import { descargarInformeMensual } from '../../services/api'

const MESES = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre'
]

// TODO: codigo repetido
function downloadFile(absoluteUrl, nombre) {
    var link = document.createElement('a');
    link.href = absoluteUrl;
    link.download = nombre + '.CSV';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// TODO: codigo repetido
export const InformeTable = ({ meses, headers, handleDownload }) => {
    return (
        <table
            style={{
                border: '1px solid white',
                borderRadius: '15px',
                textAlign: 'center'
            }}
        >
            <thead style={{ borderBottom: '1px solid white', margin: '0 30px' }}>
                {headers.map(header => <th key={header} style={{ width: 200, padding: 10 }}>{header}</th>)}
            </thead>
            <tbody>
                {meses.map((mes, index) => {
                    return <tr key={index}   >
                        <td style={{ width: 300, padding: '0 30px' }}>{`informe-mensual-${index + 1 + '/' + '2022'}`}</td>
                        <td style={{ width: 200 }}>{mes}</td>
                        <td style={{ width: 200 }}>
                            <button onClick={() => handleDownload(index + 1)}>
                                Descargar
                            </button></td>
                    </tr>
                })}
            </tbody>
        </table >
    )
}




const InformesMensuales = () => {
    const { id } = useParams()
    const history = useHistory()
    const { comedorForm } = useGetComedor(id)

    const handleDownload = (mes) => {
        descargarInformeMensual(id, mes).then(
            (response) =>
                // console.log(response)
            downloadFile("data:application/octet-stream," + response.data, 'reservas-mensuales-' + mes)
        )
    }

    return (
        <div className="PostComments">
            <div className="PostComments__container">
                <h1>Informes mensuales de "{comedorForm.nombre}"</h1>
                <div className="NewComedor__content">
                    <InformeTable
                        meses={MESES} headers={['Reservas', 'Mes', 'Acciones']}
                        handleDownload={handleDownload}
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

