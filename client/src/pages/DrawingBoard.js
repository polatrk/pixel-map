import { useEffect, useState } from 'react'
import {  DrawMultipleCells, DrawSingleCell } from '../Utils/DrawingUtils'
import { OnClickInCanvas } from '../Utils/DrawingBoardControls'
import axiosInstance from '../axiosInstance'
import { getCursorPosInCanvas } from '../Utils/TransformUtils'
import '../css/DrawingBoard.css'

const DrawingBoard = () => {
  const [isLoaded, setLoaded] = useState(false)

  useEffect(() => {
    // connect to the wss
    const socket = new WebSocket(`wss://${process.env.REACT_APP_SERVER_URL}`)

    // init variables
    const canvas = document.querySelector("#drawing-board")
    const ctx = canvas.getContext('2d')
    let downClickPos = {pos_x: 0, pos_y: 0}

    // handle ws callback
    socket.onmessage = (e) => {
      DrawSingleCell(ctx, JSON.parse(e.data))
    }

    // define handler funcs
    const handleClickOnCanvas = (e) => {
      const clickPosInCanvas = getCursorPosInCanvas({pos_x: e.clientX, pos_y: e.clientY}, canvas)

      // make srue that the canvas isn't moving and we are in bounds
      if(Math.abs(e.clientX - downClickPos.pos_x) < 5 && Math.abs(e.clientY === downClickPos.pos_y) < 5)
        if(clickPosInCanvas.pos_x >= 0 && clickPosInCanvas.pos_x <= canvas.width)
          if(clickPosInCanvas.pos_y >= 0 && clickPosInCanvas.pos_y <= canvas.height)
            OnClickInCanvas(canvas, e, socket)
    };

    // add listeners
    canvas.addEventListener('mouseup', handleClickOnCanvas)
    canvas.addEventListener('mousedown', (e) => downClickPos = {pos_x: e.clientX, pos_y: e.clientY})

    // fetch data
    axiosInstance.get('/properties/size') // Fetch size
    .then(response => {
      setLoaded(true)

      canvas.width = response.data.x
      canvas.height = response.data.y
      canvas.style.visibility = 'visible'

      // once canvas init
      axiosInstance.get('/cells') // fetch all cells
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

    // cleanup
    return () => {
      canvas.removeEventListener('mouseup', handleClickOnCanvas); // else it trigger two times
      socket.close()
    };
        

    }, []);  // empty dependency array to run this effect only once on component mount

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