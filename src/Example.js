import { useState } from 'react';
import './App.css';
import axios from 'axios'
import { firebase, storage } from './config/firebase'
function App() {

  const [form, setform] = useState({
    user: "",
    password: ""
  })
  const { user, password } = form

  const handleInputChange = (e) => {
    setform({
      ...form,
      [e.target.name]: e.target.value
    })
  }
  const headers = {
    'Content-Type': 'application/json',
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjp7InJvbGUiOiJBRE1JTl9ST0xFIiwiZ3JvdXBzIjpbXSwiX2lkIjoiNjBkMzdmZDg5ZWJhZGIwN2VjNjAxZTk5Iiwibm9tYnJlIjoiRmFjdSIsImFwZWxsaWRvIjoiRGUgTHVjaWEiLCJ1c2VyIjoiZmFjdWRlbHVjaWEiLCJlbWFpbCI6ImZhY3VuZG9kZWx1Y2lhanVkb0BnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCQ1YndIZjdCcVNSbkhmd2xMZ2hraC9lbkJXcENHOFN3SmlwWGhyUHNwb3AzUnEzSlhBakk3MiIsIl9fdiI6MH0sImlhdCI6MTYyNDg5NDExMSwiZXhwIjoxNjI0OTAxMzExfQ.aURa8Q7y4JMZxAOrQalzzUAzjLLnOI4jbAK57CsYZng"
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    await axios.post('https://internal-app-dpm.herokuapp.com/post',
      {
        "title": `${user}`,
        "content": `${password}`
      },
      { headers }
    ).then(resp => {
      console.log(resp)
    })
  }
  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    /*  const reader = new FileReader()
     reader.readAsDataURL(file)
     let urlTemp = ""
     reader.onload = (e) => {
       urlTemp = e.target.result
     } */
    const storageRef = storage.ref().child('profileImages').child('123456')
    const res = await storageRef.put(file)
    const url = await storageRef.getDownloadURL()
    console.log(url)
  }
  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input type="text" value={user} name="user" onChange={handleInputChange} />
        <input type="text" value={password} name="password" onChange={handleInputChange} />
        <input type="file" name="file" onChange={handleFileChange} />
        <input type="submit" value="login" />
      </form>
    </div>
  );
}

export default App;
