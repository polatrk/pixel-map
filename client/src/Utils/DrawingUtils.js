export function DrawMultipleCells(_cells, _ctx) {
    _cells.forEach(cell_data => {
      DrawSingleCell(_ctx, cell_data)
    });
  }

export function DrawSingleCell(_ctx, cellData) {
    _ctx.fillStyle = cellData.color
    _ctx.fillRect(
      cellData.pos_x*10, // pos x
      cellData.pos_y*10, // pos y
      10, // width
      10  // height
    )
  }