import React, { useEffect, useState } from 'react'
import DrawingBoard from './DrawingBoard'
import ColorPalette from './components/ColorPalette'
import { ControlZoom, ControlMove, getCursorPosInCanvas } from '../Utils/TransformUtils'
import '../css/MainBoard.css'

const MainBoard = () => {
    useEffect(() => {
        const zoomDiv = document.querySelector("#zoom-controller")
        const moveDiv = document.querySelector("#move-controller")

        let bIsMouseDown = false
        let clickPosInCanvas = {pos_x: 0, pos_y: 0}

        const handleZoom = (e) => ControlZoom(e, zoomDiv)
        const handleMouseMove = (e) => {if(bIsMouseDown) {ControlMove(e, moveDiv, clickPosInCanvas)}}

        if (zoomDiv)
            document.addEventListener('wheel', handleZoom);
        if (moveDiv) {
            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", () => {bIsMouseDown = false})
            document.addEventListener("mousedown", (e) => {
                bIsMouseDown = true
                clickPosInCanvas = getCursorPosInCanvas({pos_x: e.clientX, pos_y: e.clientY}, moveDiv.querySelector("#drawing-board"))
            })
        }

        // Cleanup the event listener on unmount
        return () => {
            if (zoomDiv) {
                document.removeEventListener('wheel', handleZoom);
            }
            if (moveDiv) {
                document.removeEventListener("mousemove", handleMouseMove)
            }
        }
    })

  return (
    <div id='main-board'>
        <div id='zoom-controller'>
            <div id='move-controller'>
                <DrawingBoard />
            </div>
        </div>

        <ColorPalette id="color-palette"/>
    </div>
  )
}

export default MainBoard