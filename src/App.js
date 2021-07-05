import React from 'react'
import AppRouter from './routers/AppRouter'
import { StateProvider } from './StateProvider';
import reducer, { initialState } from './reducer';
import 'bootstrap/dist/css/bootstrap.min.css';
const App = () => {
    return (
        <StateProvider initialState={initialState} reducer={reducer}>
            <AppRouter />
        </StateProvider>
    )
}

export default App
