import { useEffect, useState } from "react"
import axiosInstance from "../../axiosInstance"
import "../../css/CellInfos.css"
import { CELL_SIZE } from "../../config/constants"

const CellInfos = ({ cursorPos }) => {
  const [cellInfos, setCellInfos] = useState(null)

  const cellPos = {
    pos_x: Math.floor(cursorPos.pos_x / CELL_SIZE),
    pos_y: Math.floor(cursorPos.pos_y / CELL_SIZE),
  }

  const encodedPos = encodeURIComponent(JSON.stringify(cellPos))
  
  useEffect(() => {
  axiosInstance.get(`/cells/${encodedPos}`)
  .then(response => {
      setCellInfos(response.data)
  })
  }, [cellInfos, cursorPos, encodedPos])
  

  return (
    <div className="cellinfos-container top left">
        <h4>coords</h4>
        <p>X: {cellPos ? cellPos.pos_x : "loading..."}</p>
        <p>Y: {cellPos ? cellPos.pos_y : "loading..."}</p>
        <h4>modified by:</h4>
        <p>{cellInfos ? cellInfos.User.username : "Unknown"}</p>
    </div>
  )
}

export default CellInfos