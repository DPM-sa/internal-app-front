import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import SidebarAdmin from '../../components/Admin/SidebarAdmin'
import { storage } from '../../config/firebase'
import { useStateValue } from '../../StateProvider'
import './SliderAdmin.css'

const SliderAdmin = () => {
    const [{ token }] = useStateValue()
    const headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }

    const [loadingForm1, setLoadingForm1] = useState(false)
    const [loadingForm2, setLoadingForm2] = useState(false)
    const [loadingForm3, setLoadingForm3] = useState(false)
    const [loadingImg1, setLoadingImg1] = useState(false)
    const [loadingImg2, setLoadingImg2] = useState(false)
    const [loadingImg3, setLoadingImg3] = useState(false)

    const [title1error, setTitle1error] = useState('')
    const [content1error, setContent1error] = useState('')
    const [url1error, setUrl1error] = useState('')

    const [title2error, setTitle2error] = useState('')
    const [content2error, setContent2error] = useState('')
    const [url2error, setUrl2error] = useState('')

    const [title3error, setTitle3error] = useState('')
    const [content3error, setContent3error] = useState('')
    const [url3error, setUrl3error] = useState('')

    const [form1, setForm1] = useState({
        title1: '',
        content1: '',
        url1: ''
    })
    const { title1, content1, url1 } = form1
    const [img1, setImg1] = useState('')
    const [id1, setId1] = useState('')

    const [form2, setForm2] = useState({
        title2: '',
        content2: '',
        url2: ''
    })
    const { title2, content2, url2 } = form2
    const [img2, setImg2] = useState('')
    const [id2, setId2] = useState('')

    const [form3, setForm3] = useState({
        title3: '',
        content3: '',
        url3: ''
    })
    const { title3, content3, url3 } = form3
    const [img3, setImg3] = useState('')
    const [id3, setId3] = useState('')

    const handleInputChange1 = (e) => {
        setForm1({
            ...form1,
            [e.target.name]: e.target.value
        })
    }
    const handleInputChange2 = (e) => {
        setForm2({
            ...form2,
            [e.target.name]: e.target.value
        })
    }
    const handleInputChange3 = (e) => {
        setForm3({
            ...form3,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit1 = async (e) => {
        e.preventDefault()
        if (title1 === "" || content1 === "" || url1 === "") {
            if (title1 === "") {
                setTitle1error('El titulo es requerido')
            } else {
                setTitle1error('')
            }
            if (content1 === "") {
                setContent1error('La descripcion es requerida')
            } else {
                setContent1error('')
            }
            if (url1 === "") {
                setUrl1error('La url es requerida')
            } else {
                setUrl1error('')
            }
            return
        }
        setLoadingForm1(true)
        await axios.put(`https://internal-app-dpm.herokuapp.com/slider/${id1}`,
            {
                "title": `${title1}`,
                "content": `${content1}`,
                "url": `${url1}`
            }, { headers })
            .then(() => {
                getSlider()
                setLoadingForm1(false)
            }).catch(() => {
                Swal.fire(
                    'Error',
                    'Ha ocurrido un error, comuníquese con el administrador',
                    'error'
                ).then((resp) => {
                    if (resp) {
                        setLoadingForm1(false)
                    }

                })
            })
    }

    const handleSubmit2 = async (e) => {
        e.preventDefault()
        if (title2 === "" || content2 === "" || url2 === "") {
            if (title2 === "") {
                setTitle2error('El titulo es requerido')
            } else {
                setTitle2error('')
            }
            if (content2 === "") {
                setContent2error('La descripcion es requerida')
            } else {
                setContent2error('')
            }
            if (url2 === "") {
                setUrl2error('La url es requerida')
            } else {
                setUrl2error('')
            }
            return
        }
        setLoadingForm2(true)
        await axios.put(`https://internal-app-dpm.herokuapp.com/slider/${id2}`,
            {
                "title": `${title2}`,
                "content": `${content2}`,
                "url": `${url2}`
            }, { headers })
            .then(() => {
                getSlider()
                setLoadingForm2(false)
            }).catch(() => {
                Swal.fire(
                    'Error',
                    'Ha ocurrido un error, comuníquese con el administrador',
                    'error'
                ).then((resp) => {
                    if (resp) {
                        setLoadingForm2(false)
                    }

                })
            })
    }

    const handleSubmit3 = async (e) => {
        e.preventDefault()
        if (title3 === "" || content3 === "" || url3 === "") {
            if (title3 === "") {
                setTitle3error('El titulo es requerido')
            } else {
                setTitle3error('')
            }
            if (content3 === "") {
                setContent3error('La descripcion es requerida')
            } else {
                setContent3error('')
            }
            if (url3 === "") {
                setUrl3error('La url es requerida')
            } else {
                setUrl3error('')
            }
            return
        }
        setLoadingForm3(true)
        await axios.put(`https://internal-app-dpm.herokuapp.com/slider/${id3}`,
            {
                "title": `${title3}`,
                "content": `${content3}`,
                "url": `${url3}`
            }, { headers })
            .then(() => {
                getSlider()
                setLoadingForm3(false)
            }).catch(() => {
                Swal.fire(
                    'Error',
                    'Ha ocurrido un error, comuníquese con el administrador',
                    'error'
                ).then((resp) => {
                    if (resp) {
                        setLoadingForm3(false)
                    }

                })
            })
    }

    const getSlider = async () => {
        await axios.get('https://internal-app-dpm.herokuapp.com/sliders', { headers })
            .then(resp => {
                setForm1({
                    title1: resp.data.slidersDB[0].title,
                    content1: resp.data.slidersDB[0].content,
                    url1: resp.data.slidersDB[0].url
                })
                setImg1(resp.data.slidersDB[0].image)
                setId1(resp.data.slidersDB[0]._id)

                setForm2({
                    title2: resp.data.slidersDB[1].title,
                    content2: resp.data.slidersDB[1].content,
                    url2: resp.data.slidersDB[1].url
                })
                setImg2(resp.data.slidersDB[1].image)
                setId2(resp.data.slidersDB[1]._id)

                setForm3({
                    title3: resp.data.slidersDB[2].title,
                    content3: resp.data.slidersDB[2].content,
                    url3: resp.data.slidersDB[2].url
                })
                setImg3(resp.data.slidersDB[2].image)
                setId3(resp.data.slidersDB[2]._id)

            })
    }

    useEffect(() => {
        getSlider()
    }, [])

    const handlePictureClick1 = () => {
        document.querySelector("#fileSelector1").click()
    }

    const handleFileChange1 = async (e) => {
        setLoadingImg1(true)
        const file = e.target.files[0]
        const storageRef = storage.ref().child('sliderImages').child(`${id1}`)
        const res = await storageRef.put(file)
        const url = await storageRef.getDownloadURL()
        await axios.put(`https://internal-app-dpm.herokuapp.com/slider/${id1}`,
            {
                "image": `${url}`
            },
            { headers })
            .then(() => {
                getSlider()
                setLoadingImg1(false)
            })
    }
    const handleDeleteImage1 = () => {
        setLoadingImg1(true)
        const storageRef = storage.ref().child('sliderImages').child(`${id1}`)
        storageRef.delete().then(async () => {
            await axios.put(`https://internal-app-dpm.herokuapp.com/slider/${id1}`,
                {
                    "image": ""
                },
                { headers })
                .then(() => {
                    getSlider()
                    setLoadingImg1(false)
                })
        })
    }
    const handlePictureClick2 = () => {
        document.querySelector("#fileSelector2").click()
    }

    const handleFileChange2 = async (e) => {
        setLoadingImg2(true)
        const file = e.target.files[0]
        const storageRef = storage.ref().child('sliderImages').child(`${id2}`)
        const res = await storageRef.put(file)
        const url = await storageRef.getDownloadURL()
        await axios.put(`https://internal-app-dpm.herokuapp.com/slider/${id2}`,
            {
                "image": `${url}`
            },
            { headers })
            .then(() => {
                getSlider()
                setLoadingImg2(false)
            })
    }
    const handleDeleteImage2 = () => {
        setLoadingImg2(true)
        const storageRef = storage.ref().child('sliderImages').child(`${id2}`)
        storageRef.delete().then(async () => {
            await axios.put(`https://internal-app-dpm.herokuapp.com/slider/${id2}`,
                {
                    "image": ""
                },
                { headers })
                .then(() => {
                    getSlider()
                    setLoadingImg2(false)
                })
        })
    }
    const handlePictureClick3 = () => {
        document.querySelector("#fileSelector3").click()
    }

    const handleFileChange3 = async (e) => {
        setLoadingImg3(true)
        const file = e.target.files[0]
        const storageRef = storage.ref().child('sliderImages').child(`${id3}`)
        const res = await storageRef.put(file)
        const url = await storageRef.getDownloadURL()
        await axios.put(`https://internal-app-dpm.herokuapp.com/slider/${id3}`,
            {
                "image": `${url}`
            },
            { headers })
            .then(() => {
                getSlider()
                setLoadingImg3(false)
            })
    }
    const handleDeleteImage3 = () => {
        setLoadingImg3(true)
        const storageRef = storage.ref().child('sliderImages').child(`${id3}`)
        storageRef.delete().then(async () => {
            await axios.put(`https://internal-app-dpm.herokuapp.com/slider/${id3}`,
                {
                    "image": ""
                },
                { headers })
                .then(() => {
                    getSlider()
                    setLoadingImg3(false)
                })
        })
    }
    return (
        <>
            <SidebarAdmin />
            <div className="PostsAdmin">
                <div className="PostsAdmin-container">
                    <h1>Modificar slider principal</h1>
                    <div className="SliderAdmin-container">
                        <div className="SliderAdmin">
                            <input
                                id="fileSelector1"
                                type="file"
                                name="file"
                                style={{ display: "none" }}
                                onChange={handleFileChange1}
                            />
                            {
                                loadingImg1
                                && <div className="SliderAdmin-no-img" onClick={handlePictureClick1}>
                                    <i classname="fas fa-spinner fa-spin"></i>
                                    <p>Cargando...</p>
                                </div>
                            }
                            {
                                (!loadingImg1 && img1 === "")
                                &&
                                <div className="SliderAdmin-no-img" onClick={handlePictureClick1}>
                                    <i classname="fas fa-plus"></i>
                                    <p>Cargar imagen para slider 1</p>
                                </div>
                            }
                            {
                                (!loadingImg1 && img1 !== "")
                                && <div className="SliderAdmin-img">
                                    <img src={img1} />
                                    <div className="SliderAdmin-img-content">
                                        <p className="editImage" onClick={handlePictureClick1}>
                                            <i classname="fas fa-plus"></i>
                                            Reemplazar imagen
                                        </p>
                                        <p className="editImage" onClick={handleDeleteImage1}>
                                            <i classname="fas fa-trash-alt"></i>
                                            Eliminar imagen
                                        </p>
                                    </div>
                                </div>
                            }
                            <form onSubmit={handleSubmit1}>
                                <div>
                                    <input disabled={loadingForm1} value={title1} name="title1" onChange={handleInputChange1} type="text" className="SliderAdmin__input" />
                                    {
                                        title1error && !title1
                                        && <span className="submitError">{title1error}</span>
                                    }
                                </div>
                                <div>
                                    <input disabled={loadingForm1} value={content1} name="content1" onChange={handleInputChange1} type="text" className="SliderAdmin__input" />
                                    {
                                        content1error && !content1
                                        && <span className="submitError">{content1error}</span>
                                    }
                                </div>
                                <div>
                                    <input disabled={loadingForm1} value={url1} name="url1" onChange={handleInputChange1} type="text" className="SliderAdmin__input" />
                                    {
                                        url1error && !url1
                                        && <span className="submitError">{url1error}</span>
                                    }
                                </div>
                                <button disabled={loadingForm1} type="submit">
                                    {
                                        loadingForm1
                                            ? 'Espere...'
                                            : 'Guardar'
                                    }
                                </button>
                            </form>
                        </div>
                        <div className="SliderAdmin">
                            <input
                                id="fileSelector2"
                                type="file"
                                name="file"
                                style={{ display: "none" }}
                                onChange={handleFileChange2}
                            />
                            {
                                loadingImg2
                                && <div className="SliderAdmin-no-img" onClick={handlePictureClick2}>
                                    <i classname="fas fa-spinner fa-spin"></i>
                                    <p>Cargando...</p>
                                </div>
                            }
                            {
                                (!loadingImg2 && img2 === "")
                                &&
                                <div className="SliderAdmin-no-img" onClick={handlePictureClick2}>
                                    <i classname="fas fa-plus"></i>
                                    <p>Cargar imagen para slider 2</p>
                                </div>
                            }
                            {
                                (!loadingImg2 && img2 !== "")
                                && <div className="SliderAdmin-img">
                                    <img src={img2} />
                                    <div className="SliderAdmin-img-content">
                                        <p className="editImage" onClick={handlePictureClick2}>
                                            <i classname="fas fa-plus"></i>
                                            Reemplazar imagen
                                        </p>
                                        <p className="editImage" onClick={handleDeleteImage2}>
                                            <i classname="fas fa-trash-alt"></i>
                                            Eliminar imagen
                                        </p>
                                    </div>
                                </div>
                            }
                            <form onSubmit={handleSubmit2}>
                                <div>
                                    <input disabled={loadingForm2} value={title2} name="title2" onChange={handleInputChange2} type="text" className="SliderAdmin__input" />
                                    {
                                        title2error && !title2
                                        && <span className="submitError">{title2error}</span>
                                    }
                                </div>
                                <div>
                                    <input disabled={loadingForm2} value={content2} name="content2" onChange={handleInputChange2} type="text" className="SliderAdmin__input" />
                                    {
                                        content2error && !content2
                                        && <span className="submitError">{content2error}</span>
                                    }
                                </div>
                                <div>
                                    <input disabled={loadingForm2} value={url2} name="url2" onChange={handleInputChange2} type="text" className="SliderAdmin__input" />
                                    {
                                        url2error && !url2
                                        && <span className="submitError">{url2error}</span>
                                    }
                                </div>
                                <button disabled={loadingForm2} type="submit">
                                    {
                                        loadingForm2
                                            ? 'Espere...'
                                            : 'Guardar'
                                    }
                                </button>
                            </form>
                        </div>
                        <div className="SliderAdmin">
                            <input
                                id="fileSelector3"
                                type="file"
                                name="file"
                                style={{ display: "none" }}
                                onChange={handleFileChange3}
                            />
                            {
                                loadingImg3
                                && <div className="SliderAdmin-no-img" onClick={handlePictureClick3}>
                                    <i classname="fas fa-spinner fa-spin"></i>
                                    <p>Cargando...</p>
                                </div>
                            }
                            {
                                (!loadingImg3 && img3 === "")
                                &&
                                <div className="SliderAdmin-no-img" onClick={handlePictureClick3}>
                                    <i classname="fas fa-plus"></i>
                                    <p>Cargar imagen para slider 3</p>
                                </div>
                            }
                            {
                                (!loadingImg3 && img3 !== "")
                                && <div className="SliderAdmin-img">
                                    <img src={img3} />
                                    <div className="SliderAdmin-img-content">
                                        <p className="editImage" onClick={handlePictureClick3}>
                                            <i classname="fas fa-plus"></i>
                                            Reemplazar imagen
                                        </p>
                                        <p className="editImage" onClick={handleDeleteImage3}>
                                            <i classname="fas fa-trash-alt"></i>
                                            Eliminar imagen
                                        </p>
                                    </div>
                                </div>
                            }
                            <form onSubmit={handleSubmit3}>
                                <div>
                                    <input disabled={loadingForm3} value={title3} name="title3" onChange={handleInputChange3} type="text" className="SliderAdmin__input" />
                                    {
                                        title3error && !title3
                                        && <span className="submitError">{title3error}</span>
                                    }
                                </div>
                                <div>
                                    <input disabled={loadingForm3} value={content3} name="content3" onChange={handleInputChange3} type="text" className="SliderAdmin__input" />
                                    {
                                        content3error && !content3
                                        && <span className="submitError">{content3error}</span>
                                    }
                                </div>
                                <div>
                                    <input disabled={loadingForm3} value={url3} name="url3" onChange={handleInputChange3} type="text" className="SliderAdmin__input" />
                                    {
                                        url3error && !url3
                                        && <span className="submitError">{url3error}</span>
                                    }
                                </div>

                                <button disabled={loadingForm3} type="submit">
                                    {
                                        loadingForm3
                                            ? 'Espere...'
                                            : 'Guardar'
                                    }
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SliderAdmin
