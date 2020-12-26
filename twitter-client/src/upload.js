import React , { useState } from 'react'
import axios from 'axios'
import { saveNewProfilePicture } from './Helpers/helpers'

export default function Upload() {
    const [selected,setSelected] = useState(null);
    
    const handleUpload = () => {
        console.log(selected);
        const data = new FormData() 
        data.set('file', selected, `${Date.now()}-${selected.name}`);
        data.append('userId', JSON.parse(localStorage.getItem('user'))._id);
        axios({
            url:'http://localhost:3001/upload',
            method:'post',
            data:data,
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(response => {
            saveNewProfilePicture(response.data.fileName)
        })
        .catch(err => console.error(err));
    }

    return (
        <>
            <input type="file" name="file" onChange={(e) => setSelected(e.target.files[0])} />
            <button onClick={handleUpload}>Upload</button>
        </>
    )
}