import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth';

export default function SignUp() {
    const [formData, setFormData] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const handleChange = (e) => {
        console.log(e.target.value)
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };
    console.log(formData);
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username && !formData.email && !formData.password) {
            return setErrorMessage("Please fill out all fields")
        }

        // Validate form fields and provide specific error messages
        if (!formData.username) {
            return setErrorMessage("Username is required");
        }
        if (!formData.email) {
            return setErrorMessage("Email is required");
        }
        if (!formData.password) {
            return setErrorMessage("Password is required");
        }

        try {
            setLoading(true);
            setErrorMessage(null);
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success === false) {
                return setErrorMessage(data.message)
            }
            setLoading(false);
            if (res.ok) {
                navigate("/sign-in");
            }
        } catch (error) {
            setErrorMessage(error.message)
            setLoading(false);
        }
    }

    return (
        <div className='min-h-screen mt-20'>
            <div className="flex p-3 max-w-4xl mx-auto flex-col md:flex-row md:items-center gap-5">
                {/* Left Section */}
                <div className="flex-1 text-center md:text-left">
                    <Link to={"/"} className='font-bold dark:text-white text-3xl'>
                        <span className='text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-full px-5 py-2.5 text-center me-2 mb-2'>IBlogIt</span>
                    </Link>
                    <p className='text-sm mt-5'>Begin a journey with IBlogIt! Join our community today. <br />Sign up using your email or Google.</p>
                </div>
                {/* Right Section */}
                <div className="flex-1">
                    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                        <div>
                            <Label value='Your username' />
                            <TextInput type='text' placeholder='Username' id='username' onChange={handleChange} />
                        </div>
                        <div>
                            <Label value='Your email' />
                            <TextInput type='email' placeholder='Email' id='email' onChange={handleChange} />
                        </div>
                        <div>
                            <Label value='Your password' />
                            <TextInput type='password' placeholder='Password' id='password' onChange={handleChange} />
                        </div>
                        <Button
                            className='text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 rounded-lg text-center '
                            type='submit'
                            disabled={loading}
                        >
                            {
                                loading ? (
                                    <>
                                        <Spinner size="sm" />
                                        <span className='pl-3'>Loading...</span>
                                    </>
                                ) : "Sign Up"
                            }
                        </Button>
                        <OAuth />
                    </form>
                    <div className="flex gap-2 text-sm mt-5">
                        <span>Have an account ?</span>
                        <Link to={"/sign-in"} className='text-blue-500'>Sign In</Link>
                    </div>
                    {
                        errorMessage && (
                            <Alert className='mt-5' color="failure">
                                {errorMessage}
                            </Alert>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
