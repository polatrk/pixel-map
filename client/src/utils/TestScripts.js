import axiosInstance from "../axiosInstance"

export const drawRainbox = async () => {
    // create ws connection
    const wssUrl = process.env.REACT_APP_SERVER_URL
    const isLocalHost = wssUrl.includes('localhost')
    const socketProtocol = isLocalHost ? 'ws' : 'wss'
    const socket = new WebSocket(`${socketProtocol}://${process.env.REACT_APP_SERVER_URL.replace(/^.*\/\//, "")}`)
    
    let x = 0
    let y = 0
    let maxX = 99
    let maxY = 99
    let minX = 0
    let minY = 0
    let colorIndex = 0
    let direction = 1
    const rainbowColors = [
        "#FF0000", "#FF1A00", "#FF3300", "#FF4D00", "#FF6600", "#FF8000", "#FF9900", "#FFB200", "#FFCC00", "#FFFF00", 
        "#CCFF00", "#99FF00", "#66FF00", "#33FF00", "#00FF00", "#00FF33", "#00FF66", "#00FF99", "#00FFCC", "#00FFFF",
        "#00CCFF", "#0099FF", "#0066FF", "#0033FF", "#0000FF", "#3300FF", "#6600FF", "#9900FF", "#CC00FF", "#FF00FF",
        "#FF00CC", "#FF0099", "#FF0066", "#FF0033", "#FF0000", "#FF1A33", "#FF3366", "#FF4D99", "#FF66CC", "#FF80FF",
        "#FF99FF", "#FFB3FF", "#FFCCFF", "#FFDDFF", "#FFE6FF", "#FFFFFF", "#E6E6FF", "#CCCCFF", "#B3B3FF", "#9999FF",
        "#8080FF", "#6666FF", "#4D4DFF", "#3333FF", "#1A1AFF", "#0000E6", "#0000CC", "#0000B3", "#000099", "#000080",
        "#0033FF", "#0066FF", "#0099FF", "#00CCFF", "#00FFFF", "#33FFFF", "#66FFFF", "#99FFFF", "#CCFFFF", "#FFFFFF",
        "#FFE6E6", "#FFCCCC", "#FF9999", "#FF6666", "#FF3333", "#FF0000", "#CC0000", "#990000", "#660000", "#330000",
        "#0033CC", "#0066CC", "#0099CC", "#00CCCC", "#00FFCC", "#33FFCC", "#66FFCC", "#99FFCC", "#CCFFCC", "#FFFFFF",
        "#E6E6E6", "#CCCCCC", "#B3B3B3", "#999999", "#808080", "#666666", "#4D4D4D", "#333333", "#1A1A1A", "#000000"
      ];
      
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    for (let index = 0; index < 10000; index++) {
        const cellData = {
            pos_x: x,
            pos_y: y,
            color: rainbowColors[colorIndex],
            modified_by: 1
        };

        axiosInstance.post('/cells', cellData, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            socket.send(JSON.stringify(response.data));
        })
        .catch(error => {
            console.error("Error:", error);
        });

        switch (direction) {
            case 1:
                x++;
                if (x >= maxX) {
                    direction = 2;
                    minY++;
                }
                break
            case 2:
                y++;
                if (y >= maxY) {
                    direction = 3;
                    maxX--;
                }
                break
            case 3:
                x--;
                if (x <= minX) {
                    direction = 0;
                    maxY--;
                }
                break
            case 0:
                y--;
                if (y <= minY) {
                    direction = 1;
                    minX++;
                }
                break;

            default:
                break
        }

        colorIndex = (colorIndex+1)%rainbowColors.length
        await delay(10)
    }
}