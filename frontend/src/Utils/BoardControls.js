import { DrawSingleCell } from "./DrawingUtils"

export function getCursorPosInCanvas(_canvas, event) {
    const canvasBounds = _canvas.getBoundingClientRect()
    const rel_x = event.clientX - canvasBounds.left
    const rel_y = event.clientY - canvasBounds.top

    return {pos_x: rel_x, pos_y: rel_y}
}

export function OnClickInCanvas(_canvas, event, color) {
    const ctx = _canvas.getContext('2d')
    let {pos_x, pos_y} = getCursorPosInCanvas(_canvas, event)
    
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