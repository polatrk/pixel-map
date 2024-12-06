import React, { useEffect, useRef, useState } from 'react'
import DrawingBoard from './DrawingBoard'
import ColorPalette from './components/ColorPalette'
import { ControlZoom, ControlMove, getCursorPosInCanvas } from '../utils/TransformUtils'
import '../css/MainBoard.css'
import Header from './components/Header'
import Login from './components/modal/Login'
import Signup from './components/modal/Signup'
import Profile from './components/modal/Profile'
import CellInfos from './components/CellInfos'
import { CELL_SIZE } from '../config/constants'
import CustomCursor from './components/CustomCursor'

const MainBoard = () => {
    // modal related
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isSignupModalOpen, setSignupModalOpen] = useState(false);
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    const [cursorPos, setCursorPos] = useState({});

    const toggleLoginModal = () => {
        setSignupModalOpen(false)
        setProfileModalOpen(false)
        setLoginModalOpen(!isLoginModalOpen)
    }
    const toggleSignupModal = () => {
        setLoginModalOpen(false)
        setProfileModalOpen(false)
        setSignupModalOpen(!isSignupModalOpen)
    }
    const toggleProfileModal = () => {
        setLoginModalOpen(false)
        setSignupModalOpen(false)
        setProfileModalOpen(!isProfileModalOpen)
    }

    useEffect(() => {
        const zoomDiv = document.querySelector("#zoom-controller")
        const moveDiv = document.querySelector("#move-controller")
        const canvas = moveDiv.querySelector("#drawing-board")

        let bIsMouseDown = false
        let clickPosInCanvas = {pos_x: 0, pos_y: 0}
        let lastHoveredCellPos = {pos_x: 0, pos_y: 0}

        const handleZoom = (e) => ControlZoom(e, zoomDiv)
        const handleMouseMove = (e) => {
            if(bIsMouseDown)
                ControlMove(e, moveDiv, clickPosInCanvas)

            // for cell infos
            const cursorPos = getCursorPosInCanvas({pos_x: e.clientX, pos_y: e.clientY}, canvas)
            const cellPos = {
                pos_x: Math.floor(cursorPos.pos_x / CELL_SIZE),
                pos_y: Math.floor(cursorPos.pos_y / CELL_SIZE),
              }
            if(cellPos.pos_x !== lastHoveredCellPos.pos_x || cellPos.pos_y !== lastHoveredCellPos.pos_y) {
                setCursorPos(getCursorPosInCanvas({pos_x: e.clientX, pos_y: e.clientY}, canvas))
                lastHoveredCellPos = cellPos
            }
        }

        if (zoomDiv)
            zoomDiv.addEventListener('wheel', handleZoom);
        if (moveDiv) {
            moveDiv.addEventListener("mousemove", handleMouseMove)
            moveDiv.addEventListener("mouseup", () => {bIsMouseDown = false})
            moveDiv.addEventListener("mousedown", (e) => {
                bIsMouseDown = true
                clickPosInCanvas = getCursorPosInCanvas({pos_x: e.clientX, pos_y: e.clientY})
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
        <Login isModalOpen={isLoginModalOpen} toggleLoginModal={toggleLoginModal} toggleSignupModal={toggleSignupModal} />
        <Signup isModalOpen={isSignupModalOpen} toggleSignupModal={toggleSignupModal} toggleLoginModal={toggleLoginModal}/>
        <Profile isModalOpen={isProfileModalOpen} toggleProfileModal={toggleProfileModal}/>

        <Header className='header' toggleLoginModal={toggleLoginModal} toggleSignupModal={toggleSignupModal} toggleProfileModal={toggleProfileModal} />
        <div id='zoom-controller'>
            <div id='move-controller'>
                <DrawingBoard toggleLoginModal={toggleLoginModal}/>
            </div>
        </div>

        <ColorPalette className="color-palette" />
        <CellInfos cursorPos={cursorPos} className="cell-infos"/>
        <CustomCursor />
    </div>
  )
}

export default MainBoard