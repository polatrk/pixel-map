import { memo, useContext, useEffect, useState } from 'react'
import '../../css/ColorPalette.css'
import axiosInstance from '../../axiosInstance'
import { ColorContext } from '../../utils/context/ColorContext'

const ColorPalette = () => {
    const [palette, setPalette] = useState()
    const { setSelectedColor } = useContext(ColorContext);
    let currentSelectedColor = null

    function handleColorClick(e, color) {
      if(currentSelectedColor)
        currentSelectedColor.style.border = ''

      currentSelectedColor = e.target
      currentSelectedColor.style.border = '3px, solid, black'
      
      setSelectedColor(color)
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