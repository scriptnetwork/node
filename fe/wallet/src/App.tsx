import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { RoutesWrapper } from './routes';
import { Provider } from 'react-redux';
import { store } from 'store';

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <RoutesWrapper />
                <ToastContainer theme='dark'/>
            </BrowserRouter>
        </Provider>
    );
};

export default App;
