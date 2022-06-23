const API = 'http://localhost:3000/logout'

export const signin = async () => {
    const res = await fetch(API)
    return await res.json()
}