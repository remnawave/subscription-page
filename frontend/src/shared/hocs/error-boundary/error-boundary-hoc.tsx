import { ErrorBoundary, ErrorBoundaryProps } from 'react-error-boundary'
import { Outlet } from 'react-router'
import { FC } from 'react'

export const ErrorBoundaryHoc: FC<ErrorBoundaryProps> = (props) => {
    return (
        <ErrorBoundary {...props}>
            <Outlet />
        </ErrorBoundary>
    )
}
