import { useEffect, useState } from 'react'
import '../../css/ColorPalette.css'
import axios from 'axios'

const ColorPalette = () => {
    const [palette, setPalette] = useState()
    
    // Set default color
    localStorage.setItem('selectedColor', "#000")

    function handleColorClick(color) {
      localStorage.setItem('selectedColor', color)
    }

    useEffect(() => {
      axios.get('http://localhost:3001/properties/palette')
      .then(response => {
          setPalette(response.data);
      })
      .catch(error => {
          console.error("Error:", error);
    })}, [])


  return (
    <div className="palette-container bot-left">
      {Array.isArray(palette) ? (
        palette.map(color => {
          return <div 
          id="color-choice" 
          key={color} style={{backgroundColor: color}} 
          onClick={() => handleColorClick(color)}
          />
      })
    ) : (
      <h1>Loading...</h1>
    )}
      </div>
  )
}

export default ColorPalette