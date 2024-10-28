import { jwtDecode } from "jwt-decode"

export function GetUserInfos() {
    const token = localStorage.getItem('accessToken')

    let isLogged = false
    let username
    let email
    let role

    if(!token)
        return { isLogged }

    const decoded = jwtDecode(token)

    username = decoded.username
    email = decoded.email
    role = decoded.role
    isLogged = true

    return { username, email, role, isLogged }
}