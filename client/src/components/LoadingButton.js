import {Button, Spinner} from "react-bootstrap";
import React from "react";

const LoadingButton = ({loading, text, onClick, className, variant}) => {
    if (loading) {
        return (
            <Button className={className} variant={variant} disabled>
                <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/>
                Loading...
            </Button>
        )
    }
    if (!loading) {
        return (
            <Button onClick={onClick} className={`${className}`} variant={variant}>{text}</Button>
        )
    }
}

export default LoadingButton