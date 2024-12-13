import { MAX_ZOOM, MIN_ZOOM } from "../config/constants"

export function getCursorPosInCanvas(clickPos) {
    const zoomDiv = document.getElementById("zoom-controller")
    const moveDiv = document.getElementById("move-controller")
    const moveDivBounds = moveDiv.getBoundingClientRect()
    const currentZoom = zoomDiv.style.zoom ? zoomDiv.style.zoom : 1
    const borderSize = getComputedStyle(moveDiv).getPropertyValue("border-top-width").replace('px','') // to exclude the borders
    const rel_x = (clickPos.pos_x - moveDivBounds.left)/currentZoom
    const rel_y = (clickPos.pos_y - moveDivBounds.top)/currentZoom
    
    return {pos_x: Math.floor(rel_x-borderSize), pos_y: Math.floor(rel_y-borderSize)}
}

export function ControlZoom(zoomValue, zoomDiv) {
    zoomDiv.style.zoom = zoomValue;
}

export function ControlMoveWithMouse(event, moveDiv, lastMousePosInCanvas) {
    const zoomDiv = moveDiv.closest("#zoom-controller")
    const zooDivBounds = zoomDiv.getBoundingClientRect()
    console.log(lastMousePosInCanvas)
    const currentZoom = parseFloat(zoomDiv.style.zoom || 1);

    const borderSize = parseFloat(
        getComputedStyle(moveDiv).getPropertyValue("border-top-width").replace("px", "") // to exclude the border
    );
    const rel_x = (event.clientX - zooDivBounds.left)/currentZoom
    const rel_y = (event.clientY - zooDivBounds.top)/currentZoom

    moveDiv.style.left = `${(rel_x - borderSize) - lastMousePosInCanvas.pos_x}px`
    moveDiv.style.top = `${(rel_y - borderSize) - lastMousePosInCanvas.pos_y}px`
}

export function ControlMoveWithTouch(moveDiv, moveOffset) {
    // const zoomDiv = moveDiv.closest("#zoom-controller")
    // let currentZoom = zoomDiv.style.zoom ? zoomDiv.style.zoom : 1

    // moveDiv.style.left = `${(parseFloat(moveDiv.style.left) ? parseFloat(moveDiv.style.left) : 0) - (moveOffset.x / currentZoom)}px`
    // moveDiv.style.top = `${(parseFloat(moveDiv.style.top) ? parseFloat(moveDiv.style.top) : 0) - (moveOffset.y / currentZoom)}px`
}