import React from 'react'
import { useState } from "react"
import Header from '../components/Header'
import TextExtract from '../components/TextExtract'
import Footer from "../components/Footer";

export default function Homepage() {
    const [selectedPhoto, setSelectedPhoto] = useState(null)

    const handleSelectedPhotoChange = (photo) => {
        setSelectedPhoto(photo);
    };
    return (
        <>
            <Header />
            <TextExtract photo={selectedPhoto} />
            {/* <Footer /> */}
        </>
    )
}
