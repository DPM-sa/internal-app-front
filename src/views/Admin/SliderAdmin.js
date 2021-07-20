import axios from 'axios'
import React, { useState, useEffect } from 'react'
import SidebarAdmin from '../../components/SidebarAdmin'
import { storage } from '../../config/firebase'
import { useStateValue } from '../../StateProvider'
import './SliderAdmin.css'

const SliderAdmin = () => {
    const [{ token }] = useStateValue()
    const headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }
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
            ...form1,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit1 = async (e) => {
        e.preventDefault()
        if (title1 === "", content1 === "", url1 === "") return
        await axios.put(`https://internal-app-dpm.herokuapp.com/slider/${id1}`,
            {
                "title": `${title1}`,
                "content": `${content1}`,
                "url": `${url1}`
            }, { headers })
            .then(() => {
                getSlider()
            })
    }
    const handleSubmit2 = async (e) => {
        e.preventDefault()
        if (title2 === "", content2 === "", url2 === "") return
        await axios.put(`https://internal-app-dpm.herokuapp.com/slider/${id2}`,
            {
                "title": `${title2}`,
                "content": `${content2}`,
                "url": `${url2}`
            }, { headers })
            .then(() => {
                getSlider()
            })
    }
    const handleSubmit3 = async (e) => {
        e.preventDefault()
        if (title3 === "", content3 === "", url3 === "") return
        await axios.put(`https://internal-app-dpm.herokuapp.com/slider/${id3}`,
            {
                "title": `${title3}`,
                "content": `${content3}`,
                "url": `${url3}`
            }, { headers })
            .then(() => {
                getSlider()
            })
    }

    const getSlider = async () => {
        await axios.get('https://internal-app-dpm.herokuapp.com/sliders', { headers })
            .then(resp => {
                console.log(resp.data.slidersDB)
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
                setForm3({
                    title3: resp.data.slidersDB[2].title,
                    content3: resp.data.slidersDB[2].content,
                    url3: resp.data.slidersDB[2].url
                })
                setImg3(resp.data.slidersDB[2].image)
            })
    }

    useEffect(() => {
        getSlider()
    }, [])

    const handlePictureClick1 = () => {
        document.querySelector("#fileSelector1").click()
    }

    const handleFileChange1 = async (e) => {
        const file = e.target.files[0]
        const storageRef = storage.ref().child('profileImages').child(`${id1}`)
        const res = await storageRef.put(file)
        const url = await storageRef.getDownloadURL()
        await axios.put(`https://internal-app-dpm.herokuapp.com/slider/${id1}`,
            {
                "image": `${url}`
            },
            { headers })
            .then(() => {
                getSlider()
            })
    }
    const handleDeleteImage1 = () => {
        const storageRef = storage.ref().child('profileImages').child(`${id1}`)
        storageRef.delete().then(async () => {
            await axios.put(`https://internal-app-dpm.herokuapp.com/slider/${id1}`,
                {
                    "image": ""
                },
                { headers })
                .then(() => {
                    getSlider()
                })
        })
    }
    const handlePictureClick2 = () => {
        document.querySelector("#fileSelector2").click()
    }

    const handleFileChange2 = async (e) => {
        const file = e.target.files[0]
        const storageRef = storage.ref().child('profileImages').child(`${id2}`)
        const res = await storageRef.put(file)
        const url = await storageRef.getDownloadURL()
        await axios.put(`https://internal-app-dpm.herokuapp.com/slider/${id2}`,
            {
                "image": `${url}`
            },
            { headers })
            .then(() => {
                getSlider()
            })
    }
    const handleDeleteImage2 = () => {
        const storageRef = storage.ref().child('profileImages').child(`${id2}`)
        storageRef.delete().then(async () => {
            await axios.put(`https://internal-app-dpm.herokuapp.com/slider/${id2}`,
                {
                    "image": ""
                },
                { headers })
                .then(() => {
                    getSlider()
                })
        })
    }
    const handlePictureClick3 = () => {
        document.querySelector("#fileSelector3").click()
    }

    const handleFileChange3 = async (e) => {
        const file = e.target.files[0]
        const storageRef = storage.ref().child('profileImages').child(`${id3}`)
        const res = await storageRef.put(file)
        const url = await storageRef.getDownloadURL()
        await axios.put(`https://internal-app-dpm.herokuapp.com/slider/${id3}`,
            {
                "image": `${url}`
            },
            { headers })
            .then(() => {
                getSlider()
            })
    }
    const handleDeleteImage3 = () => {
        const storageRef = storage.ref().child('profileImages').child(`${id3}`)
        storageRef.delete().then(async () => {
            await axios.put(`https://internal-app-dpm.herokuapp.com/slider/${id3}`,
                {
                    "image": ""
                },
                { headers })
                .then(() => {
                    getSlider()
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
                                img1 === ""
                                    ?
                                    <div className="SliderAdmin-no-img" onClick={handlePictureClick1}>
                                        <i class="fas fa-plus"></i>
                                        <p>Cargar imagen para slider 1</p>
                                    </div>
                                    :
                                    <div className="SliderAdmin-img">
                                        <img src={img1} />
                                        <div className="SliderAdmin-img-content">
                                            <p className="editImage" onClick={handlePictureClick1}>
                                                <i class="fas fa-plus"></i>
                                                Reemplazar imagen
                                            </p>
                                            <p className="editImage" onClick={handleDeleteImage1}>
                                                <i class="fas fa-trash-alt"></i>
                                                Eliminar imagen
                                            </p>
                                        </div>
                                    </div>
                            }
                            <form onSubmit={handleSubmit1}>
                                <input value={title1} name="title1" onChange={handleInputChange1} type="text" className="SliderAdmin__input" />
                                <input value={content1} name="content1" onChange={handleInputChange1} type="text" className="SliderAdmin__input" />
                                <input value={url1} name="url1" onChange={handleInputChange1} type="text" className="SliderAdmin__input" />
                                <button type="submit">
                                    Guardar
                                </button>
                            </form>
                        </div>
                        <div className="SliderAdmin">
                            <input
                                id="fileSelector1"
                                type="file"
                                name="file"
                                style={{ display: "none" }}
                                onChange={handleFileChange2}
                            />
                            {
                                img2 === ""
                                    ?
                                    <div className="SliderAdmin-no-img" onClick={handlePictureClick2}>
                                        <i class="fas fa-plus"></i>
                                        <p>Cargar imagen para slider 1</p>
                                    </div>
                                    :
                                    <div className="SliderAdmin-img">
                                        <img src={img2} />
                                        <div className="SliderAdmin-img-content">
                                            <p className="editImage" onClick={handlePictureClick2}>
                                                <i class="fas fa-plus"></i>
                                                Reemplazar imagen
                                            </p>
                                            <p className="editImage" onClick={handleDeleteImage2}>
                                                <i class="fas fa-trash-alt"></i>
                                                Eliminar imagen
                                            </p>
                                        </div>
                                    </div>
                            }
                            <form onSubmit={handleSubmit2}>
                                <input value={title2} name="title2" onChange={handleInputChange2} type="text" className="SliderAdmin__input" />
                                <input value={content2} name="content2" onChange={handleInputChange2} type="text" className="SliderAdmin__input" />
                                <input value={url2} name="url2" onChange={handleInputChange2} type="text" className="SliderAdmin__input" />
                                <button type="submit">
                                    Guardar
                                </button>
                            </form>
                        </div>
                        <div className="SliderAdmin">
                            <input
                                id="fileSelector1"
                                type="file"
                                name="file"
                                style={{ display: "none" }}
                                onChange={handleFileChange3}
                            />
                            {
                                img3 === ""
                                    ?
                                    <div className="SliderAdmin-no-img" onClick={handlePictureClick3}>
                                        <i class="fas fa-plus"></i>
                                        <p>Cargar imagen para slider 1</p>
                                    </div>
                                    :
                                    <div className="SliderAdmin-img">
                                        <img src={img3} />
                                        <div className="SliderAdmin-img-content">
                                            <p className="editImage" onClick={handlePictureClick3}>
                                                <i class="fas fa-plus"></i>
                                                Reemplazar imagen
                                            </p>
                                            <p className="editImage" onClick={handleDeleteImage3}>
                                                <i class="fas fa-trash-alt"></i>
                                                Eliminar imagen
                                            </p>
                                        </div>
                                    </div>
                            }
                            <form onSubmit={handleSubmit3}>
                                <input value={title3} name="title3" onChange={handleInputChange3} type="text" className="SliderAdmin__input" />
                                <input value={content3} name="content3" onChange={handleInputChange3} type="text" className="SliderAdmin__input" />
                                <input value={url3} name="url3" onChange={handleInputChange3} type="text" className="SliderAdmin__input" />
                                <button type="submit">
                                    Guardar
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
