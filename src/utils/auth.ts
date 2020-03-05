const TokenKey = 'access-token'

export function getToken() {
    return window.localStorage.getItem(TokenKey)
}

export function setToken(token: string) {
    return window.localStorage.setItem(TokenKey, token)
}

export function removeToken() {
    return window.localStorage.removeItem(TokenKey)
}

export function CheckUsecase(value: string) {
    let session = window.localStorage.getItem('UsecaseList')
    if (session != null) {
        let sessionlist = session.split(',')
        if (sessionlist.find(item => { return item === value })) {
            return true
        }
    }
    return false
}
