import { CELL_SIZE, CELL_PER_CANVAS } from "../config/constants";

export function DrawMultipleCells(cells) {
    cells.forEach(cell_data => {
      DrawSingleCell(cell_data)
    });
  }

export function DrawSingleCell(cellData) {
    const canvasX = Math.floor(cellData.pos_x/CELL_PER_CANVAS)
    const canvasY = Math.floor(cellData.pos_y/CELL_PER_CANVAS)
    const canvas = document.getElementById(`${canvasX}${canvasY}`)
    const ctx = canvas.getContext('2d')
    let drawPosX = cellData.pos_x < CELL_PER_CANVAS ? cellData.pos_x : cellData.pos_x-(canvasX*CELL_PER_CANVAS <= 0 ? 1 : canvasX*CELL_PER_CANVAS)
    let drawPosY = cellData.pos_y < CELL_PER_CANVAS ? cellData.pos_y : cellData.pos_y-(canvasY*CELL_PER_CANVAS <= 0 ? 1 : canvasY*CELL_PER_CANVAS)

    ctx.fillStyle = cellData.color
    ctx.fillRect(
      drawPosX*CELL_SIZE, // pos x
      drawPosY*CELL_SIZE, // pos y
      CELL_SIZE, // width
      CELL_SIZE  // height
    )
  }