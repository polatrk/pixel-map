import { useEffect, useState } from 'react'
import {  DrawMultipleCells } from '../Utils/DrawingUtils'
import { OnClickInCanvas } from '../Utils/DrawingBoardControls'
import axios from 'axios'
import '../css/DrawingBoard.css'
import { getCursorPosInCanvas } from '../Utils/TransformUtils'

const DrawingBoard = () => {
  const [isLoaded, setLoaded] = useState(false)

  useEffect(() => {
    const canvas = document.querySelector("#drawing-board")
    const ctx = canvas.getContext('2d')
    let downClickPos = {pos_x: 0, pos_y: 0}

    // define handler funcs
    const handleClickOnCanvas = (e) => {
      const clickPosInCanvas = getCursorPosInCanvas({pos_x: e.clientX, pos_y: e.clientY}, canvas)

      // Make srue that the canvas isn't moving and we are in bounds
      if(Math.abs(e.clientX - downClickPos.pos_x) < 5 && Math.abs(e.clientY === downClickPos.pos_y) < 5)
        if(clickPosInCanvas.pos_x >= 0 && clickPosInCanvas.pos_x <= canvas.width)
          if(clickPosInCanvas.pos_y >= 0 && clickPosInCanvas.pos_y <= canvas.height)
            OnClickInCanvas(canvas, e)
    };

    // Add listeners
    canvas.addEventListener('mouseup', handleClickOnCanvas)
    canvas.addEventListener('mousedown', (e) => downClickPos = {pos_x: e.clientX, pos_y: e.clientY})

    // Fectch data
    axios.get('http://localhost:3001/properties/size') // Fetch size
    .then(response => {
      setLoaded(true)

      canvas.width = response.data.x
      canvas.height = response.data.y
      canvas.style.visibility = 'visible'

      // Once canvas init
      axios.get('http://localhost:3001/cells') // Fetch all cells
      .then(response => {
        DrawMultipleCells(response.data, ctx);
      })
      .catch(error => {
        console.error("Error:", error);
      });

    })
    .catch(error => {
      console.error("Error:", error);
    });

    // Cleanup function to remove event listener else it trigger two times
    return () => {
      canvas.removeEventListener('mouseup', handleClickOnCanvas);
    };
        

    }, []);  // Empty dependency array to run this effect only once on component mount

  return (
    <>
        {!isLoaded && (
          <h1>Loading...</h1>
        )}
        <canvas width={0} height={0} style={{visibility: 'hidden'}} id='drawing-board' />
    </>
  )
}

export default DrawingBoard