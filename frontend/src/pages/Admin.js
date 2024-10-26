import React, { useEffect, useState } from 'react'
import axios from 'axios';
import '../css/AdminPanel.css'

const Admin = () => {
    const [size, setSize] = useState()
    const [palette, setPalette] = useState()
    const [newColor, setNewColor] = useState()

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

    const handleNewColorInput = (e) => {
        setNewColor(e.target.value)
        const newColorInput = document.getElementById('newColor')
        const colorPreview = document.getElementById('color-preview')
        console.log(`#${newColor}`)
        colorPreview.style.backgroundColor = `#${colorPreview}`
    }

    const addNewColor = (e) => {

    }

  return (
    <>
    {(!size || !palette) ? (
        <h1>Loading...</h1>
    ) : (
        <>
        <div className='size-panel'>
            <h1>Size</h1>
            <p>X:</p>
            <input value={size.x} onChange={e => setSize({ ...size, x: parseInt(e.target.value) })} />
            <p>Y:</p>
            <input value={size.y} onChange={e => setSize({ ...size, y: parseInt(e.target.value) })} />
            <button onClick={saveSize}>Save</button>            
        </div>
        <div id='palette-panel'>
            <h1>Palette</h1>
            <div className='palette-editor'>
                <div className="palette-container">
                    {palette.map(color => {
                    return <div 
                    id="color-choice" 
                    key={color} style={{backgroundColor: color}} 
                    onClick={() => (null)}//handleColorClick(color)}
                    />
                })}
                </div>
                <div className='color-editor'>
                    <div id='color-preview' className='color-preview' />
                    <input id='newColor' value={"000"} onChange={handleNewColorInput} />
                </div>         
            </div>
            <button onClick={addNewColor}>Save</button>            
        </div>

        </>
    )}
    </>
  )
}

export default Admin