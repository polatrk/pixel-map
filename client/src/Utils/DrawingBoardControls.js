import { getCursorPosInCanvas } from "./TransformUtils"
import axiosInstance from "../axiosInstance"
import { DrawSingleCell } from "./DrawingUtils"

export function OnClickInCanvas(_canvas, event, socket) {
    const ctx = _canvas.getContext('2d')
    let {pos_x, pos_y} = getCursorPosInCanvas({pos_x: event.clientX, pos_y: event.clientY}, _canvas)
    const color = localStorage.getItem('selectedColor')

    // round to the 10th
    pos_x = Math.floor(pos_x/10)
    pos_y = Math.floor(pos_y/10)

    const cellData = {
        _pos_x: pos_x,
        _pos_y: pos_y,
        _color: color,
    };
    
    // Send the POST request with axios
    axiosInstance.post('/cells', cellData, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        // Assuming socket is already defined and connected
        socket.send(JSON.stringify(response.data));
        DrawSingleCell(ctx, response.data)
    })
    .catch(error => {
        console.error("Error:", error);
    });
}