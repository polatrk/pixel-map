import { isMobile } from 'react-device-detect';

const MobileModeSwitch = ({ setIsInDrawingMode }) => {

  return (
    <div className='right' style={{display: 'flex', flexDirection: 'column'}}>
    {isMobile && (
        <>
            <button type='button' className='btn btn-dark' onClick={() => setIsInDrawingMode(true)}>Draw</button>
            <button type='button' className='btn btn-dark' onClick={() => setIsInDrawingMode(false)}>Select</button>
        </>
    )}
</div>
  )
}

export default MobileModeSwitch