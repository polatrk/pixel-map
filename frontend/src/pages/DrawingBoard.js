import { useEffect, useState } from 'react'
import {  DrawMultipleCells } from '../Utils/DrawingUtils'
import { OnClickInCanvas } from '../Utils/DrawingBoardControls'
import axios from 'axios'
import '../css/DrawingBoard.css'

const DrawingBoard = () => {
  const [isLoaded, setLoaded] = useState(false)

  useEffect(() => {
    const canvas = document.querySelector("#drawing-board")
    const ctx = canvas.getContext('2d')
    let downClickPos = {pos_x: 0, pos_y: 0}

    // define handler funcs
    const handleClickOnCanvas = (e) => {
      if(Math.abs(e.clientX - downClickPos.pos_x) < 5 && Math.abs(e.clientY === downClickPos.pos_y) < 5)
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

      // Once canvas init...
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
        <canvas width={0} height={0}  id='drawing-board' />
    </>
  )
}

export default DrawingBoard