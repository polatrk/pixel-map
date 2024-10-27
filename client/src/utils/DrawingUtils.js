import { CELL_SIZE } from "../config/constants";

export function DrawMultipleCells(_cells, _ctx) {
    _cells.forEach(cell_data => {
      DrawSingleCell(_ctx, cell_data)
    });
  }

export function DrawSingleCell(_ctx, cellData) {
    _ctx.fillStyle = cellData.color
    _ctx.fillRect(
      cellData.pos_x*CELL_SIZE, // pos x
      cellData.pos_y*CELL_SIZE, // pos y
      20, // width
      20  // height
    )
  }