import { Button, FileInput, Select, TextInput } from 'flowbite-react'
import React from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreatePost = () => {
    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
            <form className='flex flex-col gap-4'>
                <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                    <TextInput type='text' placeholder='Title' required id='title' className='flex-1' />
                    <Select id="countries" required>
                        <option value={"uncategorized"}>Select a Category</option>
                        <option value={"javascript"}>Javascript</option>
                        <option value={"react"}>React</option>
                        <option value={"mongodb"}>MongoDB</option>
                    </Select>
                </div>
                <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
                    <FileInput type="file" accept='image/*' />
                    <Button type='button' size={"sm"} outline className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 rounded-lg text-center">Upload Image</Button>
                </div>
                <ReactQuill theme='snow' required placeholder='Write Something Awesome...' className='h-72 mb-12' />
                <Button type='submit' className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 rounded-lg text-center">Publish</Button>
            </form>
        </div>
    )
}

export default CreatePost
