import React, { useEffect, useRef, useState } from 'react'
import DrawingBoard from './DrawingBoard'
import ColorPalette from './components/ColorPalette'
import { ControlZoom, getCursorPosInCanvas, ControlMoveTwoFinger, ControlMoveWithMouse } from '../utils/TransformUtils'
import '../css/MainBoard.css'
import Header from './components/Header'
import Login from './components/modal/Login'
import Signup from './components/modal/Signup'
import Profile from './components/modal/Profile'
import CellInfos from './components/CellInfos'
import { CELL_SIZE } from '../config/constants'
import CustomCursor from './components/CustomCursor'
import { usePinch, useWheel } from '@use-gesture/react';

const MainBoard = () => {
    // dom elements
    const zoomDivRef = useRef(null)
    const moveDivRef = useRef(null)

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

    // Use the usePinch hook
    usePinch(
        ({ offset: [d] }) => {
        ControlZoom(d, zoomDivRef.current, true)
        },
        {
        target: zoomDivRef,
        eventOptions: { passive: false },
        preventDefault: true,
        }
    );

    useWheel(
        ({ delta: [dx, dy], event }) => {
            if(Math.abs(dy) === 100)                            // case where user is using the mouse wheel
                ControlZoom(((dy/100)*0.075) * -1, zoomDivRef.current, false)
            else {                                              // case where user is using the trackpad
                event.preventDefault();
                ControlMoveTwoFinger(moveDivRef.current, {x: dx, y: dy})
            }
        },
        {
            target: moveDivRef,
            eventOptions: { passive: false },
            preventDefault: true,
        }
    );

    useEffect(() => {
        const canvas = moveDivRef.current.querySelector("#drawing-board")

        let bIsMouseDown = false
        let clickPosInCanvas = {pos_x: 0, pos_y: 0}
        let lastHoveredCellPos = {pos_x: 0, pos_y: 0}

        const handleMouseMove = (e) => {
            if(bIsMouseDown)
                ControlMoveWithMouse(e, moveDivRef.current, clickPosInCanvas)

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


        if (moveDivRef.current) {
            moveDivRef.current.addEventListener("mousemove", handleMouseMove)
            moveDivRef.current.addEventListener("mouseup", () => {bIsMouseDown = false})
            moveDivRef.current.addEventListener("mousedown", (e) => {
                bIsMouseDown = true
                clickPosInCanvas = getCursorPosInCanvas({pos_x: e.clientX, pos_y: e.clientY})
            })
        }

        // Cleanup the event listener on unmount
        return () => {
            if (moveDivRef.current) {
                moveDivRef.current.removeEventListener("mousemove", handleMouseMove)
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
        <div id='zoom-controller' ref={zoomDivRef}>
            <div id='move-controller' ref={moveDivRef}>
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