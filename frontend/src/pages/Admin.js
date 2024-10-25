import React, { useEffect, useState } from 'react'
import axios from 'axios';

const Admin = () => {
    const [size, setSize] = useState()
    const [palette, setPalette] = useState()

    useEffect(() => {
        axios.get('http://localhost:3001/properties/size')
        .then(response => {
            setSize(response.data);
        })
        .catch(error => {
            console.error("Error:", error);
        });
  
        axios.get('http://localhost:3001/properties/palette')
        .then(response => {
            setPalette(response.data);
        })
        .catch(error => {
            console.error("Error:", error);
        });
    }, [])

    const saveSize = () => {
        axios.post('http://localhost:3001/properties/size', {
            value: size
        })
        .then(response => {
            alert("Size saved successfully !")
        })
        .catch(error => {
            console.error("Error:", error);
        });
    }

  return (
    <>
    {(!size || !palette) ? (
        <h1>Loading...</h1>
    ) : (
        <>
            <h1>Size</h1>
            <p>X:</p>
            <input value={size.x} onChange={e => setSize({ ...size, x: parseInt(e.target.value) })} />
            <p>Y:</p>
            <input value={size.y} onChange={e => setSize({ ...size, y: parseInt(e.target.value) })} />
            <button onClick={saveSize}>Save</button>
        </>
    )}
    </>
  )
}

export default Admin