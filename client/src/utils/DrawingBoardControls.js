import { getCursorPosInCanvas } from "./TransformUtils"
import { CELL_SIZE } from "../config/constants"
import { DrawSingleCell, PushCell } from "./DrawingUtils"

export function OnClickInCanvas(event, socket, selectedColor) {
    let cursorPos = getCursorPosInCanvas({pos_x: event.clientX, pos_y: event.clientY})

    // round to the cell size
    cursorPos.pos_x = Math.floor(cursorPos.pos_x/CELL_SIZE)
    cursorPos.pos_y = Math.floor(cursorPos.pos_y/CELL_SIZE)

    const cellData = {
        pos_x: cursorPos.pos_x,
        pos_y: cursorPos.pos_y,
        color: selectedColor,
    };

    DrawSingleCell(cellData)

    PushCell(cellData, socket)
}