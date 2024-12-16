import React, { useContext, useEffect, useRef, useState } from 'react'
import DrawingBoard from './DrawingBoard'
import ColorPalette from './components/ColorPalette'
import { ControlZoom, getCursorPosInCanvas, ControlMoveWithTouch, ControlMoveWithMouse } from '../utils/TransformUtils'
import '../css/MainBoard.css'
import Header from './components/Header'
import Login from './components/modal/Login'
import Signup from './components/modal/Signup'
import Profile from './components/modal/Profile'
import CellInfos from './components/CellInfos'
import { CELL_SIZE } from '../config/constants'
import CustomCursor from './components/CustomCursor'
import { useGesture } from '@use-gesture/react'
import { isMobile } from 'react-device-detect'
import { GetUserInfos } from '../utils/UserInfos'
import { DrawSingleCell } from '../utils/DrawingUtils'
import { ColorContext } from '../utils/context/ColorContext'
import { useTranslation } from 'react-i18next'

const MainBoard = () => {
    // dom elements
    const zoomDivRef = useRef(null)
    const moveDivRef = useRef(null)
    const sensorDivRef = useRef(null)

    // modal related
    const [isLoginModalOpen, setLoginModalOpen] = useState(false)
    const [isSignupModalOpen, setSignupModalOpen] = useState(false)
    const [isProfileModalOpen, setProfileModalOpen] = useState(false)
    const [cursorPos, setCursorPos] = useState({})

    // other
    const { selectedColor } = useContext(ColorContext)
    const [isZooming, setIsZooming] = useState(false)
    const { t } = useTranslation();

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

    useGesture({
        onPinch: ({ offset: [d], event }) => {
            event.preventDefault()
            setIsZooming(true)

            ControlZoom(d, zoomDivRef.current, true)
        },
        onPinchEnd: () => {
            setIsZooming(false)
        },
        onWheel: ({ delta: [dx, dy], event }) => {
            event.preventDefault()
            if(isZooming === true)
                return

            if(Math.abs(event.deltaY) === 100)                            // case where user is using the mouse wheel
                ControlZoom((parseFloat(zoomDivRef.current.style.zoom) + ((dy/100)*0.025)*-1), zoomDivRef.current)
            else {                                                        // case where user is using the trackpad
                ControlMoveWithTouch(moveDivRef.current, {x: dx, y: dy})
            }
        }},
        {
            target: sensorDivRef.current,
            eventOptions: { passive: false },
        }
    )

    const onDrawButtonClicked = () => {
        const cellPos = {
            pos_x: Math.floor(cursorPos.pos_x / CELL_SIZE),
            pos_y: Math.floor(cursorPos.pos_y / CELL_SIZE),
          }

        const cellData = {
            pos_x: cellPos.pos_x,
            pos_y: cellPos.pos_y,
            color: selectedColor,
            modified_by: GetUserInfos().id
        };
    
        DrawSingleCell(cellData)
    }

    const onRecenterButtonClicked = () => {
        moveDivRef.current.style.left = '0px'
        moveDivRef.current.style.top = '0px'
    }


    useEffect(() => {
        const canvas = moveDivRef.current.querySelector("#drawing-board")

        let bIsMouseDown = false
        let clickPosInCanvas = {pos_x: 0, pos_y: 0}
        let lastHoveredCellPos = {pos_x: 0, pos_y: 0}

        const handleMouseMove = (e) => {
            let eventOrigin = null
            if(e.type.includes('mouse')) 
                eventOrigin = e
            else if(e.type.includes('touch')) {
                eventOrigin = e.touches[0];
            }
            
            if(bIsMouseDown)
                ControlMoveWithMouse(eventOrigin, moveDivRef.current, clickPosInCanvas)

            // for cell infos
            const cursorPos = getCursorPosInCanvas({pos_x: eventOrigin.clientX, pos_y: eventOrigin.clientY}, canvas)

            const cellPos = {
                pos_x: Math.floor(cursorPos.pos_x / CELL_SIZE),
                pos_y: Math.floor(cursorPos.pos_y / CELL_SIZE),
              }
            if(cellPos.pos_x !== lastHoveredCellPos.pos_x || cellPos.pos_y !== lastHoveredCellPos.pos_y) {
                setCursorPos(getCursorPosInCanvas({pos_x: eventOrigin.clientX, pos_y: eventOrigin.clientY}, canvas))
                lastHoveredCellPos = cellPos
            }
        }

        if(sensorDivRef.current) {
            // for computer
            sensorDivRef.current.addEventListener("mousemove", handleMouseMove)
            sensorDivRef.current.addEventListener("mouseup", () => {bIsMouseDown = false})
            sensorDivRef.current.addEventListener("mousedown", (e) => {
                bIsMouseDown = true
                clickPosInCanvas = getCursorPosInCanvas({pos_x: e.clientX, pos_y: e.clientY})
            })

            // for mobile
            sensorDivRef.current.addEventListener("touchmove", handleMouseMove)
            sensorDivRef.current.addEventListener("touchend", () => {bIsMouseDown = false})
            sensorDivRef.current.addEventListener("touchstart", (e) => {
                bIsMouseDown = true
                const touch = e.touches[0];
                clickPosInCanvas = getCursorPosInCanvas({pos_x: touch.clientX, pos_y: touch.clientY})
            })
        }

        // Cleanup the event listener on unmount
        return () => {
            if (sensorDivRef.current) {
                sensorDivRef.current.removeEventListener("mousemove", handleMouseMove)
                sensorDivRef.current.removeEventListener("touchmove", handleMouseMove)
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
        <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}} 
        ref={sensorDivRef}
        className='sensor-div'
        >
            <div id='zoom-controller' ref={zoomDivRef}>
                <div id='move-controller' ref={moveDivRef}>
                    <DrawingBoard toggleLoginModal={toggleLoginModal} />
                </div>
            </div>
        </div>
        <div className='bot bottom-container'>
            <button id='drawButton' 
            type='button' 
            className='btn btn-dark' 
            onClick={onDrawButtonClicked}
            hidden={!isMobile}
            >
            {t('Draw')}
            </button>
            <button id='recenterButton' 
            type='button' 
            className='btn btn-dark' 
            onClick={onRecenterButtonClicked}
            >
            {t('Recenter')}
            </button>
            <ColorPalette />
        </div>
        
        <CellInfos cursorPos={cursorPos} className="cell-infos"/>
        <CustomCursor />
    </div>
  )
}

export default MainBoard