import {Button, Spinner} from "react-bootstrap";
import React from "react";

const LoadingButton = ({loading, text, onClick}) => {
    if (loading) {
        return (
            <Button className={'my-5'} variant="outline-light" disabled>
                <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/>
                Loading...
            </Button>
        )
    }
    if (!loading) {
        return (
            <Button onClick={onClick} className={'my-5'} variant={'outline-light'}>{text}</Button>
        )
    }
}

export default LoadingButton