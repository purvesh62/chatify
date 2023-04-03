import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TextExtract() {
    let [loading, setLoading] = useState(true);
    let [color, setColor] = useState("#ffffff");


    const [imageList, setimageList] = useState([]);
    const [selectedImage, setSelectedImage] = useState();
    const [selectedImageData, setSelectedImageData] = useState({
        url: "https://images.unsplash.com/photo-1671523435843-e3cd426c24e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        name: "dummy image",
        labels: [
            {
                "Name": "Laptop",
                "confidence": 100
            },
            {
                "Name": "Keyboard",
                "confidence": 100
            },
            {
                "Name": "Desk",
                "Confidence": 100
            }
        ]
    });
    const [uploadedImage, setUploadedImage] = useState();

    const url = "http://localhost:5000";

    const labels = selectedImageData.labels.map((l) => {
        return <span key={l.name} className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-2 rounded dark:bg-gray-700 dark:text-gray-400 border border-gray-500">{l.Name}</span>
    })
    console.log(selectedImageData)

    useEffect(() => {
        axios.get(`${url}/photos`)
            .then(res => {
                const data = res.data;
                setimageList(data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }, []);

    useEffect(() => {
        if (selectedImage) {
            console.log("Image selected ", selectedImage);
            // axios.get(`${url}/photos/${selectedImage}`)
            //     .then(res => {
            //         const { url, name } = res.data;
            //         // setSelectedImageData({ url: url, name: name });
            //         imgData = {
            //             url: url,
            //             name: name
            //         }
            //     })
            //     .catch(function (error) {
            //         console.log(error);
            //     })

            axios.get(`${url}/photos/${selectedImage}/labels`)
                .then(res => {
                    let { url, labels, name } = res.data;
                    // data.map(label => {
                    //     labels.push({ name: label.Name, confidence: label.Confidence })
                    // });
                    setSelectedImageData({
                        url: url,
                        labels: labels,
                        name: name
                    });
                })
                .catch(function (error) {
                    console.log(error);
                })


        }
    }, [selectedImage])

    const handleImageDelete = (e) => {
        const imageName = e.currentTarget.id;
        axios.delete(
            `${url}/photos/${imageName}`,
        ).then(res => {
            toast.success('File deleted!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setimageList(imageList.filter(i => i !== res.data))
        }).catch(function (error) {
            console.log(error);
        })

    }

    const uploadFile = () => {
        event.preventDefault();
        const data = new FormData(event.target);
        data.append("image_file", uploadedImage, uploadedImage.name);
        axios.post(
            `${url}/photos`,
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }
        ).then(res => {
            toast.success('File uploaded!', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            console.log(res);
            if (!imageList.hasOwnProperty(uploadedImage.name)){
                imageList.push(uploadedImage.name)
                setimageList(imageList);
            }           
            setUploadedImage(undefined)
        }).catch(function (error) {
            toast.error('Error while uploading the file', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        })
    }

    return (
        <div>
            <ToastContainer
                position="top-right"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            {/* Same as */}
            <ToastContainer />
            <section className="bg-white dark:bg-gray-900">
                <div className="gap-16 items-start py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
                    <div className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
                        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Image Analyzer</h2>
                        <p className="mb-4">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sed dignissimos saepe quos impedit, nemo doloribus autem quidem amet accusamus nisi. At corporis iusto id facere nesciunt assumenda illum similique vitae.</p>

                        <ul className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                            {imageList.map((image) => (
                                <li className="flex justify-between pb-4 sm:pb-4" key={image}>
                                    <button onClick={(e) => { setSelectedImage(image) }} className='w-full px-1 text-justify hover:bg-gray-300 rounded-sm'>{image}</button>
                                    <button className='w-1/3 hover:text-red' id={image} onClick={(e) => { handleImageDelete(e) }}>
                                        <div className='flex gap-1 p-1 items-center hover:bg-red-200'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                            <p>Delete</p>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>


                        {/* Upload File */}
                        <form onSubmit={(e) => uploadFile(e)}>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload file</label>
                            <div className='flex flex-wrap-reverse'>
                                <input
                                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help"
                                    id="file_input"
                                    type="file"
                                    accept=".jpg,.png"
                                    onChange={(e) => { setUploadedImage(event.target.files[0]) }}
                                />
                                <button type="submit" className="block w-1/3 text-sm px-2 font-medium text-white border border-gray-900 rounded-sm cursor-pointer bg-gray-900 focus:outline-none">Submit</button>
                            </div>
                            <p className="text-sm mt-1 text-gray-500 dark:text-gray-300" id="file_input_help">PNG or JPG</p>
                        </form>

                    </div>
                    <div className="grid grid-cols-1 gap-4 ">
                        <div className="flex flex-wrap justify-center">
                            <img
                                src={selectedImageData.url}
                                className="h-auto max-w-xl rounded-lg shadow-none transition-shadow duration-300 ease-in-out hover:shadow-lg hover:shadow-black/30"
                                alt={selectedImageData.name} />
                        </div>
                        <div className='grid grid-cols-4 gap-4 mt-8 px-5'>
                            {labels}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
