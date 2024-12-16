import { useEffect, useState } from "react"
import axiosInstance from "../../axiosInstance"
import "../../css/CellInfos.css"
import { CELL_SIZE } from "../../config/constants"
import { isMobile } from 'react-device-detect';
import { t } from "i18next";

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
  }, [cursorPos])
  

  return (
    <div className="cellinfos-container top left">
        {isMobile ? (
          <>
            <p>X: {cellPos ? cellPos.pos_x : t('Loading...')} Y: {cellPos ? cellPos.pos_y : t('Loading...')}</p>
            <p>{t('Modified by')}: {isFetching ? t('Loading...') : (cellInfos ? cellInfos.User.username : t('Unknown'))}</p>
          </>
        ) : (
          <>
            <h4>Coords</h4>
            <p>X: {cellPos ? cellPos.pos_x : t('Loading...')}</p>
            <p>Y: {cellPos ? cellPos.pos_y : t('Loading...')}</p>
            <h4>{t('Modified by')}:</h4>
            <p>{isFetching ? t('Loading...') : (cellInfos ? cellInfos.User.username : t('Unknown'))}</p>
          </>
        )}
    </div>
  )
}

export default CellInfos