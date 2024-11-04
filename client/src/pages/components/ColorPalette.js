import { memo, useEffect, useState } from 'react'
import '../../css/ColorPalette.css'
import axiosInstance from '../../axiosInstance'

const ColorPalette = () => {
    const [palette, setPalette] = useState()
    let currentSelectedColor = null

    // Set default color
    localStorage.setItem('selectedColor', "#000")

    function handleColorClick(e, color) {
      if(currentSelectedColor)
        currentSelectedColor.style.border = ''

      currentSelectedColor = e.target
      currentSelectedColor.style.border = '3px, solid, black'
      
      localStorage.setItem('selectedColor', color)
    }

    useEffect(() => {
      axiosInstance.get('/properties/palette')
      .then(response => {
          setPalette(response.data);
      })
      .catch(error => {
          console.error("Error:", error);
    })}, [])


  return (
    <div className="palette-container bot">
      {Array.isArray(palette) ? (
        palette.map(color => {
          return <div 
          className="color-choice" 
          key={color} style={{backgroundColor: color, backgroundImage: 'none'}} 
          onClick={(e) => handleColorClick(e, color)}
          />
      })
    ) : (
      <h1>Loading...</h1>
    )}
      </div>
  )
}

export default memo(ColorPalette)