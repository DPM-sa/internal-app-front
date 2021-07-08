import React from 'react'
import AppRouter from './routers/AppRouter'
import { StateProvider } from './StateProvider';
import { BrowserRouter as Router } from 'react-router-dom'
import reducer, { initialState } from './reducer';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    return (
        <StateProvider initialState={initialState} reducer={reducer}>
            <Router>
                <AppRouter />
            </Router>
        </StateProvider>
    )
}

export default App
