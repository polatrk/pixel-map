import { useEffect, useState } from 'react'
import {  DrawMultipleCells, DrawSingleCell } from '../utils/DrawingUtils'
import { OnClickInCanvas } from '../utils/DrawingBoardControls'
import axiosInstance from '../axiosInstance'
import { getCursorPosInCanvas } from '../utils/TransformUtils'
import canvasCursorImg from '../images/canvasCursor.png'
import { CELL_SIZE } from "../config/constants"
import '../css/DrawingBoard.css'

const DrawingBoard = () => {
  const [isLoaded, setLoaded] = useState(false)

  useEffect(() => {
    // create ws connection
    const wssUrl = process.env.REACT_APP_SERVER_URL
    const isLocalHost = wssUrl.includes('localhost')
    const socketProtocol = isLocalHost ? 'ws' : 'wss'
    const socket = new WebSocket(`${socketProtocol}://${process.env.REACT_APP_SERVER_URL.replace(/^.*\/\//, "")}`)

    // init variables
    const canvas = document.querySelector("#drawing-board")
    const ctx = canvas.getContext('2d')
    const canvasCursor = document.getElementById('canvas-cursor')
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

    const handleMouseMove = (e) => {
      let {pos_x, pos_y} = getCursorPosInCanvas({pos_x: e.clientX, pos_y: e.clientY}, canvas)

      // round to the cell size 
      pos_x = Math.floor(pos_x/CELL_SIZE)*CELL_SIZE
      pos_y = Math.floor(pos_y/CELL_SIZE)*CELL_SIZE

      canvasCursor.style.left = `${pos_x}px`;
      canvasCursor.style.top = `${pos_y}px`;
    }

    // add listeners
    canvas.addEventListener('mouseup', handleClickOnCanvas)
    canvas.addEventListener('mousedown', (e) => downClickPos = {pos_x: e.clientX, pos_y: e.clientY})
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseenter', () => {
      canvasCursor.style.visibility = 'visible'
    })
    canvas.addEventListener('mouseleave', () => {
      canvasCursor.style.visibility = 'hidden'
    })

    // fetch data
    axiosInstance.get('/properties/size') // Fetch size
    .then(response => {
      setLoaded(true)

      // *(CELL_SIZE/10) to match the possible number of cells on a row or col 
      canvas.width = response.data.x*(CELL_SIZE/10)
      canvas.height = response.data.y*(CELL_SIZE/10)
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
        <img 
        src={canvasCursorImg} 
        alt="Canvas Cursor" 
        id="canvas-cursor" 
        style={{visibility: 'hidden'}}
        width={CELL_SIZE} height={CELL_SIZE} 
        />
    </>
  )
}

export default DrawingBoard