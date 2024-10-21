import '../../css/ColorPalette.css'

const ColorPalette = () => {
    const colors = [
        "#670119", "#bc0036", "#fd4300", "#fea701", "#fdd635", "#fef6b9", 
        "#fef6b9", "#00ca76", "#7eea57", "#00746e", "#009ca9" , "#00ccbf", 
        "#214fa1" , "#214fa1", "#214fa1" , "#214fa1", "#214fa1" , "#93b2fc", 
        "#93b2fc" , "#93b2fc", "#e5aafd" , "#e5aafd", "#fd3780", "#fe97a8", 
        "#6c472d", "#6c472d", "#9a6825", "#fdb26d", "#fdb26d", "#505254", 
        "#505254", "#fefefe"
    ]

  return (
    <div id="palette-container">
        {colors.map(color => {
            <div id="color-choice" key={color} style={{backgroundColor: color}} />
        })}
    </div>
  )
}

export default ColorPalette