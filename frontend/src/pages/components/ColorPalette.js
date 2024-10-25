import '../../css/ColorPalette.css'

const ColorPalette = () => {
    const colors = [
        "#670119", "#bc0036", "#fd4300", "#fea701", "#fdd635", "#fef6b9",
         "#00ca76", "#7eea57", "#00746e", "#009ca9" , "#00ccbf", "#214fa1",
          "#93b2fc", "#e5aafd", "#fd3780", "#fe97a8", "#6c472d", "#9a6825",
           "#fdb26d", "#000", "#505254", "#fefefe"
    ]
    
    // Set default color
    localStorage.setItem('selectedColor', "#000")

    function handleColorClick(color) {
      localStorage.setItem('selectedColor', color)
    }

  return (
    <div id="palette-container">
        {colors.map(color => {
            return <div 
            id="color-choice" 
            key={color} style={{backgroundColor: color}} 
            onClick={() => handleColorClick(color)}
            />
        })}
    </div>
  )
}

export default ColorPalette