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

    const savePalette = () => {
        axios.post('http://localhost:3001/properties/palette', {
            value: palette
        })
        .then(response => {
            alert("Palette saved successfully !")
        })
        .catch(error => {
            console.error("Error:", error);
        });
    }

    const handleNewColorInput = (e) => {
        let input = e.target.value.toUpperCase();
        input = input.replace(/[^0-9A-F]/g, ''); // Remove invalid characters
    
        // Because hex color is 6 max
        if (input.length > 6) {
          input = input.slice(0, 6);
        }

        setNewColor(`#${input}`);

        const colorPreview = document.getElementById('color-preview')
        colorPreview.style.backgroundColor = `#${input}`
    }

    const addNewColor = (e) => {
        const newColorIndex = document.getElementById('newColorIndex').value
        if(newColorIndex === '')
            setPalette(prevPalette => [...prevPalette, newColor])
        else
            setPalette(prevPalette => [
                ...prevPalette.slice(0, newColorIndex),
                newColor,
                ...prevPalette.slice(newColorIndex)
            ])
        console.log(palette)
    }

    const removeColor = (colorToRemove) => {
        if(window.confirm(`Do you really want to remove the color ${colorToRemove} ?`))
            setPalette(prevPalette => prevPalette.filter(color => color !== colorToRemove))
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
                    {palette.map((color, index) => {
                    return <div 
                    id="color-choice" 
                    key={color} 
                    style={{backgroundColor: color}} 
                    onClick={() => removeColor(color)}
                    >{index}</div>
                })}
                </div>
                <div className='color-editor'>
                    <div id='color-preview' className='color-preview' />
                    <input id='newColor' value={newColor} placeholder='000000' onInput={handleNewColorInput} />
                    <input id='newColorIndex' type='number' placeholder='end' />
                    <button onClick={addNewColor}>Save new color</button>
                </div>         
            </div>
            <button onClick={savePalette}>Save</button>            
        </div>

        </>
    )}
    </>
  )
}

export default Admin