import React from 'react'
import { useHistory, useParams } from 'react-router'
import { CancelarBtn } from '../../components/Buttons/CancelarBtn'
import { DarkTable } from '../../components/Tables/DarkTable'
import { useGetComedor } from '../../hooks/useGetComedor'
import { useGetReservasDiarias } from '../../hooks/useGetReservasDiarias'
import { descargarInformeDiario } from '../../services/api'
import './EditComedor.css'

function downloadFile(absoluteUrl, nombre) {
    var link = document.createElement('a');
    link.href = absoluteUrl;
    link.download = nombre+'.CSV';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


export const InformeTable = ({ data, headers, handleDownload }) => {
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
                {data && data.map((row, index) => {
                    return <tr key={index}>
                        <td style={{ width: 300 }}>{`reservas-diarias-${row.formatteddate}`}</td>
                        <td style={{ width: 200 }}>{row.formatteddate}</td>
                        <td style={{ width: 200 }}>
                            <button onClick={() => handleDownload(row.date)}>
                                Descargar
                            </button></td>
                    </tr>
                })}
            </tbody>
        </table >
    )
}



const ReservasDiarias = () => {
    const { id } = useParams()
    const history = useHistory()
    const { reservas } = useGetReservasDiarias(id);
    const { comedorForm } = useGetComedor(id)

    const handleDownload = (fecha) => {
        descargarInformeDiario(id, fecha.substring(0, 10)).then(
            (response) => downloadFile("data:application/octet-stream," + response.data, 'reservas-diarias-'+fecha.substring(0, 10)))
    }


    return (
        <div className="PostComments">
            <div className="PostComments__container">
                <h1>Reservas diarias de "{comedorForm.nombre}"</h1>
                <div className="NewComedor__content">
                    <InformeTable data={reservas} headers={['Reservas diarias', 'Fecha', 'Acciones']} handleDownload={handleDownload} />
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

