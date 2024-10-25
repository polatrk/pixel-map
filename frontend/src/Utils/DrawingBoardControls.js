import { DrawSingleCell } from "./DrawingUtils"
import { getCursorPosInCanvas } from "./TransformUtils"

export function OnClickInCanvas(_canvas, event) {
    const ctx = _canvas.getContext('2d')
    let {pos_x, pos_y} = getCursorPosInCanvas({pos_x: event.clientX, pos_y: event.clientY}, _canvas)
    const color = localStorage.getItem('selectedColor')

    // round to the 10th
    pos_x = Math.floor(pos_x/10)
    pos_y = Math.floor(pos_y/10)

    DrawSingleCell(ctx, pos_x, pos_y)

    fetch('http://localhost:3001/cells', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            _pos_x: pos_x,
            _pos_y: pos_y,
            _color: color
        })
    })
    .then(response => {
        if (!response.ok) {
          throw new Error("Failed to save cell");
        }
        return response.json();
      })
    .then(data => DrawSingleCell(ctx, data))
    .catch(error => {
    console.error("Error:", error);
    });
}