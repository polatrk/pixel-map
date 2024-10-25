import React, { useEffect } from 'react'
import {  DrawMultipleCells } from '../Utils/DrawingUtils'
import { OnClickInCanvas } from '../Utils/DrawingBoardControls'
import '../css/DrawingBoard.css'

const DrawingBoard = () => {
  useEffect(() => {
    const canvas = document.querySelector("#drawing-board")
    const ctx = canvas.getContext('2d')

    const handleClickOnCanvas = (event) => OnClickInCanvas(canvas, event);
    canvas.addEventListener('click', handleClickOnCanvas)


    fetch('http://localhost:3001/cells')
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json(); // Make sure to parse the JSON if response is OK
      })
      .then(data => {
        DrawMultipleCells(data, ctx)
      })
      .catch(error => {
        console.error("Error:", error); // Handle errors
      });

      // Cleanup function to remove event listener else it trigger two times
      return () => {
        canvas.removeEventListener('click', handleClickOnCanvas);
      };

  }, []);  // Empty dependency array to run this effect only once on component mount

  return (
    <>
    <canvas width='500' height='500'  id='drawing-board' />
    </>
  )
}

export default DrawingBoard