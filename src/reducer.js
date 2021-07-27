export const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    posts: [],
    commentsPost: [],
    searching: '',
    sugerenciaSelected: null,
    userMessage: null,
    openPost: false,
    editProfile: false,
    editOrNewUser: false,
    editOrNewFile: false
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
        case "SET_SUGERENCIA": {
            return {
                ...state,
                sugerenciaSelected: action.sugerenciaSelected,
                userMessage: action.userMessage
            }
        }
        case "SET_OPEN_POST": {
            return {
                ...state,
                openPost: action.openPost
            }
        }
        case "SET_EDIT_PROFILE": {
            return {
                ...state,
                editProfile: action.editProfile
            }
        }
        case "SET_EDIT_NEW_USER": {
            return {
                ...state,
                editOrNewUser: action.editOrNewUser
            }
        }
        case "SET_EDIT_NEW_FILE": {
            return {
                ...state,
                editOrNewFile: action.editOrNewFile
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