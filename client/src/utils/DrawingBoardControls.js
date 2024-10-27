import { getCursorPosInCanvas } from "./TransformUtils"
import axiosInstance from "../axiosInstance"
import { CELL_SIZE } from "../config/constants"

export function OnClickInCanvas(_canvas, event, socket) {
    let {pos_x, pos_y} = getCursorPosInCanvas({pos_x: event.clientX, pos_y: event.clientY}, _canvas)
    const color = localStorage.getItem('selectedColor')

    // round to the cell size
    pos_x = Math.floor(pos_x/CELL_SIZE)
    pos_y = Math.floor(pos_y/CELL_SIZE)

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
    })
    .catch(error => {
        console.error("Error:", error);
    });
}