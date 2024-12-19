import React, { useContext, useEffect, useRef, useState } from 'react'
import {  DrawMultipleCells, DrawSingleCell } from '../utils/DrawingUtils'
import axiosInstance from '../axiosInstance'
import { getCursorPosInCanvas } from '../utils/TransformUtils'
import canvasCursorImg from '../images/canvasCursor.png'
import { CANVAS_SIZE, CELL_SIZE } from "../config/constants"
import '../css/DrawingBoard.css'
import { GetUserInfos } from '../utils/UserInfos'
import { OnClickInCanvas } from '../utils/DrawingBoardControls'
import { ColorContext } from "../utils/context/ColorContext";
import { isMobile } from 'react-device-detect'
import { SocketContext } from '../utils/context/SocketContext'

const DrawingBoard = ({toggleLoginModal}) => {
  const [isLoaded, setLoaded] = useState(false)
  const [canvasMatrix, setCanvasMatrix] = useState()
  const [drawingBoardSize, setDrawingBoardSize] = useState({x: 0, y: 0})
  const { selectedColor } = useContext(ColorContext);
  const { socket } = useContext(SocketContext);

  // avoid rerender when selected color changes
  const selectedColorRef = useRef(selectedColor)
  useEffect(() => {
    selectedColorRef.current = selectedColor;
  }, [selectedColor]);

  useEffect(() => {
    // init variables
    const drawingBoard = document.querySelector("#drawing-board")
    const canvasCursor = document.querySelector('#canvas-cursor')
    let downClickPos = {pos_x: 0, pos_y: 0}

    // define handler funcs
    const handleClickOnCanvas = (e) => {
      // make srue that the canvas isn't moving and we are in bounds
      if(Math.abs(e.clientX - downClickPos.pos_x) < 5 && Math.abs(e.clientY - downClickPos.pos_y) < 5)
            if(GetUserInfos().isLogged) {
              if(!isMobile)
                OnClickInCanvas(e, socket, selectedColorRef.current)             
            }
            else
              toggleLoginModal();
    };

    // handle ws callback
    socket.onmessage = (e) => {
      DrawSingleCell(JSON.parse(e.data))
    }

    const handleMouseMove = (e) => {
      let {pos_x, pos_y} = getCursorPosInCanvas(isMobile ? downClickPos : {pos_x: e.clientX, pos_y: e.clientY})

      // round to the cell size 
      pos_x = (Math.floor(pos_x/CELL_SIZE)*CELL_SIZE)
      pos_y = (Math.floor(pos_y/CELL_SIZE)*CELL_SIZE)
      console.log(pos_x, pos_y)
      canvasCursor.style.left = `${pos_x}px`
      canvasCursor.style.top = `${pos_y}px`
    }

    // add listeners
    drawingBoard.addEventListener('mouseup', handleClickOnCanvas)
    drawingBoard.addEventListener('mousedown', (e) => {
      downClickPos = {pos_x: e.clientX, pos_y: e.clientY}
      if(isMobile)
        handleMouseMove(e)
    })
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
      setDrawingBoardSize({x: response.data.x, y: response.data.y})

      let newCanvasMatrix = []
      for (let indexY = 0; indexY < response.data.y; indexY++) {
        let row = [];
        for (let indexX = 0; indexX < response.data.x; indexX++) {
          row.push(
            <canvas 
            width={CANVAS_SIZE} height={CANVAS_SIZE} 
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
      drawingBoard.removeEventListener('mouseup', handleClickOnCanvas);
      drawingBoard.removeEventListener('mousedown', (e) => downClickPos = {pos_x: e.clientX, pos_y: e.clientY});
      drawingBoard.removeEventListener('mousemove', handleMouseMove);
    };
    }, []);  // empty dependency array to run this effect only once on component mount

  return (
    <div style={{width: `${CANVAS_SIZE*drawingBoardSize.x}px`}} id='drawing-board'>
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