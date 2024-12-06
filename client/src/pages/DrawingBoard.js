import React, { useEffect, useState } from 'react'
import {  DrawMultipleCells, DrawSingleCell } from '../utils/DrawingUtils'
import axiosInstance from '../axiosInstance'
import { getCursorPosInCanvas } from '../utils/TransformUtils'
import canvasCursorImg from '../images/canvasCursor.png'
import { CELL_SIZE, CELL_PER_CANVAS } from "../config/constants"
import '../css/DrawingBoard.css'
import { GetUserInfos } from '../utils/UserInfos'
import { OnClickInCanvas } from '../utils/DrawingBoardControls'

const DrawingBoard = ({toggleLoginModal}) => {
  const [isLoaded, setLoaded] = useState(false)
  const [canvasMatrix, setCanvasMatrix] = useState()
  const [canvasSize, setCanvasSize] = useState({x: 0, y: 0})

  useEffect(() => {
    // create ws connection
    const wssUrl = process.env.REACT_APP_SERVER_URL
    const isLocalHost = wssUrl.includes('localhost')
    const socketProtocol = isLocalHost ? 'ws' : 'wss'
    const socket = new WebSocket(`${socketProtocol}://${process.env.REACT_APP_SERVER_URL.replace(/^.*\/\//, "")}`)

    // init variables
    const drawingBoard = document.querySelector("#drawing-board")
    const canvasCursor = document.querySelector('#canvas-cursor')
    let downClickPos = {pos_x: 0, pos_y: 0}

    // define handler funcs
    const handleClickOnCanvas = (e) => {
      // make srue that the canvas isn't moving and we are in bounds
      if(Math.abs(e.clientX - downClickPos.pos_x) < 5 && Math.abs(e.clientY - downClickPos.pos_y) < 5)
            if(GetUserInfos().isLogged)
              OnClickInCanvas(e, socket, {x: e.target.id[0], y: e.target.id[1]})
            else
              toggleLoginModal();
    };

    // handle ws callback
    socket.onmessage = (e) => {
      DrawSingleCell(JSON.parse(e.data))
    }

    const handleMouseMove = (e) => {
      let {pos_x, pos_y} = getCursorPosInCanvas({pos_x: e.clientX, pos_y: e.clientY})

      // round to the cell size 
      pos_x = (Math.floor(pos_x/CELL_SIZE)*CELL_SIZE)
      pos_y = (Math.floor(pos_y/CELL_SIZE)*CELL_SIZE)

      canvasCursor.style.left = `${pos_x}px`
      canvasCursor.style.top = `${pos_y}px`
    }

    // add listeners
    drawingBoard.addEventListener('mouseup', handleClickOnCanvas)
    drawingBoard.addEventListener('mousedown', (e) => downClickPos = {pos_x: e.clientX, pos_y: e.clientY})
    drawingBoard.addEventListener('mousemove', handleMouseMove)
    drawingBoard.addEventListener('mouseenter', () => {
      canvasCursor.style.visibility = 'visible'
    })
    drawingBoard.addEventListener('mouseleave', () => {
      canvasCursor.style.visibility = 'hidden'
    })


    // fetch data
    axiosInstance.get('/properties/size') // Fetch size
    .then(response => {
      setCanvasSize({x: response.data.x, y: response.data.y})

      let newCanvasMatrix = []
      for (let indexY = 0; indexY < response.data.y; indexY++) {
        let row = [];
        for (let indexX = 0; indexX < response.data.x; indexX++) {
          row.push(
            <canvas 
            width={CELL_PER_CANVAS*CELL_SIZE} height={CELL_PER_CANVAS*CELL_SIZE} 
            style={{
              flex: `1 1 ${100 / response.data.x}%`, // 100/rowSize
            }} 
            className='single-canvas' 
            id={`${indexX}${indexY}`} />
          )
        }
        newCanvasMatrix.push(row);
      }
      setCanvasMatrix(newCanvasMatrix)

      setLoaded(true)

      // once canvas init
      axiosInstance.get('/cells') // fetch all cells
      .then(response => {
        DrawMultipleCells(response.data, canvasMatrix);
      })
      .catch(error => {
        console.error("Error:", error);
      });

    })
    .catch(error => {
      console.error("Error:", error);
    });

    // claenup
    return () => {
      socket.close()
      drawingBoard.removeEventListener('mouseup', handleClickOnCanvas);
      drawingBoard.removeEventListener('mousedown', (e) => downClickPos = {pos_x: e.clientX, pos_y: e.clientY});
      drawingBoard.removeEventListener('mousemove', handleMouseMove);
    };
    }, []);  // empty dependency array to run this effect only once on component mount

  return (
    <div style={{width: `${CELL_PER_CANVAS*CELL_SIZE*canvasSize.x}px`}} id='drawing-board'>
        {!isLoaded ? (
          <h1>Loading...</h1>
        ) : (
          <>
            {canvasMatrix.map((row, rowIndex) => (
              <>
              {row.map((colCanvas, colIndex) => (
                <React.Fragment>
                  {colCanvas}
                </React.Fragment>
              ))}
              </>
            ))}
          </>
        )} 
        <img 
            src={canvasCursorImg} 
            alt="Canvas Cursor" 
            id="canvas-cursor" 
            style={{visibility: 'hidden'}}
            width={CELL_SIZE} height={CELL_SIZE} 
            />
    </div>
  )
}

export default DrawingBoard