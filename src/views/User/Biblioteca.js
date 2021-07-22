import axios from 'axios'
import React, { useEffect, useState } from 'react'
import NavbarProfile from '../../components/User/NavbarProfile'
import { useStateValue } from '../../StateProvider'
import './Biblioteca.css'
import Footer from '../../components/User/Footer'
import SpinnerComponent from '../../components/User/SpinnerComponent'
import WhatsappBtn from '../../components/User/WhatsappBtn'
import Banner from '../../components/User/Banner'

const Biblioteca = () => {
    const [{ token }] = useStateValue()
    const [files, setFiles] = useState([])
    const [loading, setLoading] = useState(false)
    const [typeOrder, setTypeOrder] = useState('alfabetico')
    const headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    function sortGreatest(arr) {
        for (let i = 0; i < arr.length; i++) {
            for (let j = i; j < arr.length; j++) {
                if (arr[i].title.toLowerCase() > arr[j].title.toLowerCase()) {
                    let temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                };
            };
        };
        return arr;
    };

    const reverseFiles = (arr) => {
        return arr.sort((a, b) => {
            return new Date(b.date).getTime()
                - new Date(a.date).getTime()
        })
    }

    const orderFiles = (arr) => {
        return arr.sort((a, b) => {
            return new Date(a.date).getTime()
                - new Date(b.date).getTime()
        })
    }

    const getFiles = async () => {
        setLoading(true)
        await axios.get(`https://internal-app-dpm.herokuapp.com/files`, { headers })
            .then(resp => {
                console.log(resp.data.filesDB)
                if (typeOrder === 'alfabetico') {
                    setFiles(sortGreatest(resp.data.filesDB))
                } else if (typeOrder === 'antiguos') {
                    setFiles(orderFiles(resp.data.filesDB))
                } else if (typeOrder === 'recientes') {
                    setFiles(reverseFiles(resp.data.filesDB))
                }
                setLoading(false)
            })
    }
    const [form, setForm] = useState({
        search: ''
    })
    const { search } = form
    const handleSubmit = async (e) => {
        e.preventDefault()
        await axios.get(`https://internal-app-dpm.herokuapp.com/files`, { headers })
            .then(resp => {
                setFiles(resp.data.filesDB.filter(file => file.title.toLowerCase().includes(search.toLowerCase())))
            })
    }
    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }
    useEffect(() => {
        getFiles()
    }, [typeOrder])

    return (
        <>
            <NavbarProfile />
            <Banner image={'./assets/banner-biblioteca.jpg'} title={'Biblioteca'} content={'Encontrá aquí materiales a disposición para todos los colaboradores de DPM'} linkto={'biblioteca'} />
            <div className="Biblioteca__search">
                <form onSubmit={handleSubmit} id="biblioteca">
                    <input name="search" value={search} onChange={handleInputChange} type="text" className="Biblioteca__search-input" placeholder="Buscar un archivo por nombre" />
                    <i className="fas fa-search Biblioteca__search-icon"></i>
                </form>
                <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        {typeOrder === 'alfabetico' && 'Ordenar alfabeticamente'}
                        {typeOrder === 'recientes' && 'Más recientes'}
                        {typeOrder === 'antiguos' && 'Más antiguos'}
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li onClick={() => setTypeOrder('alfabetico')} className="dropdown-item">Ordenar alfabeticamente</li>
                        <li onClick={() => setTypeOrder('recientes')} className="dropdown-item">Más recientes</li>
                        <li onClick={() => setTypeOrder('antiguos')} className="dropdown-item">Más antiguos</li>
                    </ul>
                </div>
            </div>
            <div className="Biblioteca__files-section">
                {
                    loading && <SpinnerComponent />
                }
                {
                    (!loading && files.length === 0)
                    &&
                    <p>
                        No existen archivos con ese nombre
                    </p>
                }
                {
                    !loading && files.map(file => (
                        <div key={file._id} className="Biblioteca__file" >
                            <i class="far fa-file-alt Biblioteca__file-icon"></i>
                            <h5 className="card-title text-center">{file.title}</h5>
                            <a href={file.url} download target="_blank" className="Biblioteca__file-download"><i class="fas fa-download"></i>Descargar</a>
                        </div>
                    ))
                }
            </div>
            <WhatsappBtn />
            <Footer />
        </>
    )
}

export default Biblioteca
