import { Button, Label, TextInput } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'

export default function SignUp() {
    return (
        <div className='min-h-screen mt-20'>
            <div className="flex p-3 max-w-4xl mx-auto flex-col md:flex-row md:items-center gap-5">
                {/* Left Section */}
                <div className="flex-1">
                    <Link to={"/"} className='font-bold dark:text-white text-4xl'>
                        <span className='text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-full px-5 py-2.5 text-center me-2 mb-2'>IBlogIt</span>
                    </Link>
                    <p className='text-sm mt-5'>Begin a journey with IBlogIt! Join our community today. <br />Sign up using your email or Google.</p>
                </div>
                {/* Right Section */}
                <div className="flex-1">
                    <form className='flex flex-col gap-4'>
                        <div>
                            <Label value='Your username' />
                            <TextInput type='text' placeholder='Username' id='username' />
                        </div>
                        <div>
                            <Label value='Your email' />
                            <TextInput type='email' placeholder='Email' id='username' />
                        </div>
                        <div>
                            <Label value='Your password' />
                            <TextInput type='password' placeholder='Password' id='username' />
                        </div>
                        <Button className='text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 rounded-lg text-center ' type='submit'>
                            Sign Up
                        </Button>
                    </form>
                    <div className="flex gap-2 text-sm mt-5">
                        <span>Have an account ?</span>
                        <Link to={"/sign-in"} className='text-blue-500'>Sign In</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
