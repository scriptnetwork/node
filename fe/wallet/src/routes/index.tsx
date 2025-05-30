import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { RouteController } from 'routes/RouteController';
import routesList from './routes';

export const RoutesWrapper: React.FC = () => {
    return (
        <Routes>
            {routesList.map(
                ({ element: Element, path, isPrivate, hasLayout }) => (
                    <Route
                        key={path}
                        path={path}
                        element={
                            <RouteController
                                isPrivate={isPrivate}
                                path={path}
                                hasLayout={hasLayout}
                            >
                                <Suspense fallback={<div>Loading...</div>}>
                                    <Element />
                                </Suspense>
                            </RouteController>
                        }
                    />
                ),
            )}
        </Routes>
    );
};
