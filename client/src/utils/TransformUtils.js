import { MAX_ZOOM, MIN_ZOOM } from "../config/constants"

export function getCursorPosInCanvas(clickPos) {
    const zoomDiv = document.getElementById("zoom-controller")
    const moveDiv = document.getElementById("move-controller")
    const moveDivBounds = moveDiv.getBoundingClientRect()

    // get float value from scale(x.xxx)
    const regex = /scale\(([^)]+)\)/i
    const transform = zoomDiv.style.transform
    const borderSize = getComputedStyle(moveDiv).getPropertyValue("border-top-width").replace('px','') // to exclude the borders
    let currentScale = 1
    if(transform !== '')
        currentScale = parseFloat(regex.exec(transform)[1])
    const rel_x = (clickPos.pos_x - moveDivBounds.left)/currentScale
    const rel_y = (clickPos.pos_y - moveDivBounds.top)/currentScale

    return {pos_x: Math.floor(rel_x-borderSize), pos_y: Math.floor(rel_y-borderSize)}
}

export function ControlZoom(pinchScale, zoomDiv) {
    const clampedScale = Math.max(Math.min(MAX_ZOOM, pinchScale*1.5), MIN_ZOOM)

    zoomDiv.style.transform = `scale(${clampedScale})`;
}

export function ControlMove(event, moveDiv, lastMousePosInCanvas) {
    const zoomDiv = moveDiv.closest("#zoom-controller")
    const zooDivBounds = zoomDiv.getBoundingClientRect()

    // Get float value from scale(9.9999)
    const regex = /scale\(([^)]+)\)/i
    const transform = zoomDiv.style.transform
    const borderSize = getComputedStyle(moveDiv).getPropertyValue("border-top-width").replace('px','') // to exclude the borders
    let currentScale = 1
    if(transform !== '')
        currentScale = parseFloat(regex.exec(transform)[1])

    const rel_x = (event.clientX - zooDivBounds.left)/currentScale
    const rel_y = (event.clientY - zooDivBounds.top)/currentScale

    moveDiv.style.left = `${(rel_x - borderSize)-lastMousePosInCanvas.pos_x}px`
    moveDiv.style.top = `${(rel_y - borderSize)-lastMousePosInCanvas.pos_y}px`
}
