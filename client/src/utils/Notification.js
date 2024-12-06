import { ToastContainer, toast } from 'react-toastify';


const notify = (notifType, message) => {
    switch(notifType) {
        case "info":
            toast.info(message, {
                position: 'bottom-right'
            })
            break
        case "warn":
            toast.warn(message, {
                position: 'bottom-right'
            })
            break
        case "success":
            toast.success(message, {
                position: 'bottom-right'
            })
            break
        case "error":
            toast.error(message, {
                position: 'bottom-right'
            })
            break
        default:
            break
    }
}

export default notify