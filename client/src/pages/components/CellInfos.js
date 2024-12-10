import { useEffect, useState } from "react"
import axiosInstance from "../../axiosInstance"
import "../../css/CellInfos.css"
import { CELL_SIZE } from "../../config/constants"
import { isMobile } from 'react-device-detect';

const CellInfos = ({ cursorPos }) => {
  const [cellInfos, setCellInfos] = useState(null)
  const [isFetching, setIsFetching] = useState(true)
  const cellPos = {
    pos_x: Math.floor(cursorPos.pos_x / CELL_SIZE),
    pos_y: Math.floor(cursorPos.pos_y / CELL_SIZE),
  }
  
  const encodedPos = encodeURIComponent(JSON.stringify(cellPos))

  useEffect(() => {
    const interval = setInterval(() => {
      axiosInstance.get(`/cells/${encodedPos}`)
        .then(response => {
          setCellInfos(response.data);
          setIsFetching(false)
          clearInterval(interval);
        })
        .catch(error => {
          console.error("Error fetching cell info:", error);
          clearInterval(interval);
        });
    }, 200);

    return () => {
      clearInterval(interval)
      setIsFetching(true)
    }
  }, [cursorPos, encodedPos])
  

  return (
    <div className="cellinfos-container top left">
        {true ? (
          <>
            <p>X: {cellPos ? cellPos.pos_x : "loading..."} Y: {cellPos ? cellPos.pos_y : "loading..."}</p>
            <p>Modified by: {isFetching ? "loading..." : (cellInfos ? cellInfos.User.username : "Unknown")}</p>
            <p>{isMobile ? 'true' : 'false'}</p>
          </>
        ) : (
          <>
            <h4>Coords</h4>
            <p>X: {cellPos ? cellPos.pos_x : "loading..."}</p>
            <p>Y: {cellPos ? cellPos.pos_y : "loading..."}</p>
            <h4>Modified by:</h4>
            <p>{isFetching ? "loading..." : (cellInfos ? cellInfos.User.username : "Unknown")}</p>
          </>
        )}
    </div>
  )
}

export default CellInfos