import { MAX_ZOOM, MIN_ZOOM } from "../config/constants"

// export function getCursorPosInCanvas(clickPos) {
//     const zoomDiv = document.getElementById("zoom-controller")
//     const moveDiv = document.getElementById("move-controller")
//     const moveDivBounds = moveDiv.getBoundingClientRect()
//     const currentZoom = zoomDiv.style.zoom ? zoomDiv.style.zoom : 1
//     const borderSize = getComputedStyle(moveDiv).getPropertyValue("border-top-width").replace('px','') // to exclude the borders
//     const rel_x = (clickPos.pos_x - moveDivBounds.left)/currentZoom
//     const rel_y = (clickPos.pos_y - moveDivBounds.top)/currentZoom
    
//     console.log(borderSize)
//     return {pos_x: Math.floor(rel_x-borderSize), pos_y: Math.floor(rel_y-borderSize)}
// }

export function getCursorPosInCanvas(clickPos) {
    const zoomDiv = document.getElementById("zoom-controller");
    const moveDiv = document.getElementById("move-controller");

    // Get the bounding box of the moveDiv
    const moveDivBounds = moveDiv.getBoundingClientRect();

    // Get the current zoom factor (default to 1 if not set)
    const currentZoom = parseFloat(zoomDiv.style.zoom) || 1;

    // Calculate the zoom origin for proper scaling
    const zoomOrigin = {
        x: moveDivBounds.left + moveDivBounds.width / 2,
        y: moveDivBounds.top + moveDivBounds.height / 2,
    };

    // Adjust the cursor position for zoom and transform
    const adjustedX =
        (clickPos.pos_x - moveDivBounds.left) / currentZoom +
        (zoomOrigin.x - moveDivBounds.left) * (1 - 1 / currentZoom);

    const adjustedY =
        (clickPos.pos_y - moveDivBounds.top) / currentZoom +
        (zoomOrigin.y - moveDivBounds.top) * (1 - 1 / currentZoom);

    // Account for border size
    const borderSize = parseFloat(
        getComputedStyle(moveDiv).getPropertyValue("border-top-width").replace("px", "")
    );

    return {
        pos_x: Math.floor(adjustedX - borderSize),
        pos_y: Math.floor(adjustedY - borderSize),
    };
}


export function ControlZoom(zoomValue, zoomDiv) {
    zoomDiv.style.zoom = zoomValue;
}

export function ControlMoveWithMouse(event, moveDiv, lastMousePosInCanvas) {
    const zoomDiv = moveDiv.closest("#zoom-controller")
    const zooDivBounds = zoomDiv.getBoundingClientRect()

    const borderSize = getComputedStyle(moveDiv).getPropertyValue("border-top-width").replace('px','') // to exclude the borders
    let currentZoom = zoomDiv.style.zoom ? zoomDiv.style.zoom : 1
    const rel_x = (event.clientX - zooDivBounds.left)/currentZoom
    const rel_y = (event.clientY - zooDivBounds.top)/currentZoom

    moveDiv.style.left = `${(rel_x - borderSize) - lastMousePosInCanvas.pos_x}px`
    moveDiv.style.top = `${(rel_y - borderSize) - lastMousePosInCanvas.pos_y}px`
}

export function ControlMoveWithTouch(moveDiv, moveOffset) {
    const zoomDiv = moveDiv.closest("#zoom-controller")
    let currentZoom = zoomDiv.style.zoom ? zoomDiv.style.zoom : 1

    moveDiv.style.left = `${(parseFloat(moveDiv.style.left) ? parseFloat(moveDiv.style.left) : 0) - (moveOffset.x / currentZoom)}px`
    moveDiv.style.top = `${(parseFloat(moveDiv.style.top) ? parseFloat(moveDiv.style.top) : 0) - (moveOffset.y / currentZoom)}px`
}