import { useContext, useEffect } from "react";
import styles from "../../css/CustomCursor.module.css";
import customCursorOutlineImg from "../../images/customcursor_outline.png";
import { ColorContext } from "../../utils/context/ColorContext";
import { isMobile } from 'react-device-detect';

const CustomCursor = () => {
  const { selectedColor } = useContext(ColorContext);

  useEffect(() => {
    const customCursor = document.querySelector("#custom-cursor");

    const handleMouseMove = (e) => {
      customCursor.style.left = `${e.clientX}px`
      customCursor.style.top = `${e.clientY}px`
      console.log(isMobile)
    }

    // add listeners
    document.addEventListener("mousemove", handleMouseMove)

    // cleanup the event listener on unmount
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div id='custom-cursor' className={styles["custom-cursor_container"]}>
      {!isMobile && (
        <>
          <div className={styles["custom-cursor_color"]} style={{backgroundColor: selectedColor}} />
          <img src={customCursorOutlineImg} alt="customcursor_outline.png" className={styles["custom-cursor_outline"]} />
        </>
      )}
    </div>      
  );
};

export default CustomCursor;
