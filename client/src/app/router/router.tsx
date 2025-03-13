import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider
} from 'react-router-dom'

import { ErrorPageComponent } from '@pages/errors/5xx-error/server-error.component'
import { MainPageConnector } from '@pages/main/ui/connectors/main.page.connector'
import { ErrorBoundaryHoc } from '@shared/hocs/error-boundary'

import { RootLayout } from '../layouts/root/root.layout'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<ErrorBoundaryHoc fallback={<ErrorPageComponent />} />}>
            <Route element={<RootLayout />} path="*">
                <Route element={<MainPageConnector />} path="*" />
            </Route>
        </Route>
    )
)

export function Router() {
    return <RouterProvider router={router} />
}
