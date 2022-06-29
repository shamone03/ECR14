import {Image} from "react-bootstrap";
import React, {useEffect, useRef} from "react";
import placeholder from "../assets/images/placeholder.webp";

const CropPicture = ({imgFile, imgB64, setImgB64, defaultImg}) => {

    const canvasRef = useRef(null)
    const imgRef = useRef(null)

    useEffect(() => {
        if (imgFile.name) {

            const canvas = canvasRef.current
            const img = imgRef.current
            img.src = URL.createObjectURL(imgFile)

            img.onload = () => {
                const inputWidth = img.naturalWidth
                const inputHeight = img.naturalHeight
                const inputImageAspectRatio = inputWidth / inputHeight
                let outputWidth = inputWidth
                let outputHeight = inputHeight

                if (inputImageAspectRatio > 1) {
                    outputWidth = inputHeight
                } else if (inputImageAspectRatio < 1) {
                    outputHeight = inputWidth
                }
                const outputX = (outputWidth - inputWidth) * 0.5
                const outputY = (outputHeight - inputHeight) * 0.5
                canvas.width = outputWidth
                canvas.height = outputHeight

                const context = canvas.getContext('2d')
                context.drawImage(img, outputX, outputY)
                setImgB64(canvas.toDataURL('image/png'))
            }
        }
    }, [imgFile])


    return (
        <>
            {imgFile.name ?
                <>
                    <canvas ref={canvasRef} className={'d-none'}/>
                    <Image src={URL.createObjectURL(imgFile)} ref={imgRef} alt={'prof pic hidden'} className={'d-none'}/>
                </> : ''}
            <div className={'d-flex flex-row justify-content-center w-100'}>
                {
                    imgB64 !== '' ? (
                        <Image src={imgB64} width={150} height={150} roundedCircle alt={'prof pic'} className={'my-1'}/>
                    ) :
                    defaultImg !== '' ? (
                        <Image src={defaultImg} width={150} height={150} roundedCircle alt={'prof pic'} className={'my-1'}/>
                    ) : (
                        <Image src={placeholder} width={150} height={150} roundedCircle alt={'prof pic'} className={'my-1'}/>
                    )
                }
            </div>
        </>
    )
}

export default CropPicture