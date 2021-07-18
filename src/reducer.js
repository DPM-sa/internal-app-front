export const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    posts: [],
    commentsPost: [],
    searching: '',
    users: [],
    cargando: true
}

const reducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            localStorage.setItem('token', action.token)
            localStorage.setItem('user', JSON.stringify(action.user))
            return {
                ...state,
                user: action.user,
                token: action.token
            }
        case "SET_POSTS": {
            return {
                ...state,
                posts: action.posts
            }
        }
        case "SET_COMMENTS_POST": {
            return {
                ...state,
                commentsPost: action.commentsPost
            }
        }
        case 'SEARCHING_POST': {
            return {
                ...state,
                searching: action.searching
            }
        }
        case "LOGOUT":
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            return {
                ...state,
                user: null,
                token: null
            }
        default:
            return state
    }
}

export default reducer