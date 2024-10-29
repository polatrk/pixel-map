import React, { useEffect, useState } from 'react'
import DrawingBoard from './DrawingBoard'
import ColorPalette from './components/ColorPalette'
import { ControlZoom, ControlMove, getCursorPosInCanvas } from '../utils/TransformUtils'
import '../css/MainBoard.css'
import Header from './components/Header'
import Login from './components/modal/Login'
import Signup from './components/modal/Signup'

const MainBoard = () => {
    // modal related
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isSignupModalOpen, setSignupModalOpen] = useState(false);

    const toggleLoginModal = () => {
        setSignupModalOpen(false)
        setLoginModalOpen(!isLoginModalOpen)
    }
    const toggleSignupModal = () => {
        setLoginModalOpen(false)
        setSignupModalOpen(!isSignupModalOpen)
    }

    useEffect(() => {
        const zoomDiv = document.querySelector("#zoom-controller")
        const moveDiv = document.querySelector("#move-controller")

        let bIsMouseDown = false
        let clickPosInCanvas = {pos_x: 0, pos_y: 0}

        const handleZoom = (e) => ControlZoom(e, zoomDiv)
        const handleMouseMove = (e) => {if(bIsMouseDown) {ControlMove(e, moveDiv, clickPosInCanvas)}}

        if (zoomDiv)
            zoomDiv.addEventListener('wheel', handleZoom);
        if (moveDiv) {
            moveDiv.addEventListener("mousemove", handleMouseMove)
            moveDiv.addEventListener("mouseup", () => {bIsMouseDown = false})
            moveDiv.addEventListener("mousedown", (e) => {
                bIsMouseDown = true
                clickPosInCanvas = getCursorPosInCanvas({pos_x: e.clientX, pos_y: e.clientY}, moveDiv.querySelector("#drawing-board"))
            })
        }

        // Cleanup the event listener on unmount
        return () => {
            if (zoomDiv) {
                zoomDiv.removeEventListener('wheel', handleZoom);
            }
            if (moveDiv) {
                moveDiv.removeEventListener("mousemove", handleMouseMove)
            }
        }
    }, [])

  return (
    <div className='main-board'>
        {/* modals */}
        <Login isModalOpen={isLoginModalOpen} toggleLoginModal={toggleLoginModal} />
        <Signup isModalOpen={isSignupModalOpen} toggleSignupModal={toggleSignupModal} toggleLoginModal={toggleLoginModal}/>

        <Header className='header' toggleLoginModal={toggleLoginModal} toggleSignupModal={toggleSignupModal} />
        <div id='zoom-controller'>
            <div id='move-controller'>
                <DrawingBoard toggleLoginModal={toggleLoginModal}/>
            </div>
        </div>

        <ColorPalette className="color-palette"/>
    </div>
  )
}

export default MainBoard