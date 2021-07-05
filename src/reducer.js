export const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    posts: [],
    postSelected: null,
    comments: null
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
        case "SELECT_POST": {
            return {
                ...state,
                postSelected: action.postSelected,
                comments: action.comments
            }
        }
        case "SET_POSTS":{
            return {
                ...state,
                posts: action.posts
            }
        }
        default:
            return state
    }
}

export default reducer