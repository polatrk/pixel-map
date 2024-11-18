import { CELL_SIZE, CELL_PER_CANVAS } from "../config/constants";

export function DrawMultipleCells(_cells) {
    _cells.forEach(cell_data => {
      console.log("draw:", cell_data.pos_x)
      DrawSingleCell(cell_data)
    });
  }

export function DrawSingleCell(cellData) {
    const canvasX = Math.floor(cellData.pos_x/CELL_PER_CANVAS)
    const canvasY = Math.floor(cellData.pos_y/CELL_PER_CANVAS)
    const canvas = document.getElementById(`${canvasX}${canvasY}`)

    const ctx = canvas.getContext('2d')
    let drawPosX = cellData.pos_x < 100 ? cellData.pos_x : cellData.pos_x-(canvasX*100 <= 0 ? 1 : canvasX*100)
    let drawPosY = cellData.pos_y < 100 ? cellData.pos_y : cellData.pos_y-(canvasY*100 <= 0 ? 1 : canvasY*100)

    ctx.fillStyle = cellData.color
    ctx.fillRect(
      drawPosX*CELL_SIZE, // pos x
      drawPosY*CELL_SIZE, // pos y
      CELL_SIZE, // width
      CELL_SIZE  // height
    )
  }