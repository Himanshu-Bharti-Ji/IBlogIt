import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';

export default function SignIn() {
    const [formData, setFormData] = useState({});
    const { loading, error: errorMessage } = useSelector(state => state?.user)
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const handleChange = (e) => {
        // console.log(e.target.value)
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };
    // console.log(formData);
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username && !formData.email && !formData.password) {
            return dispatch(signInFailure("Please fill out all fields"))
        }

        // Validate form fields and provide specific error messages
        // if (!formData.username) {
        //     return setErrorMessage("Username is required");
        // }
        if (!formData.email) {
            return dispatch(signInFailure("Email is required"));
        }
        if (!formData.password) {
            return dispatch(signInFailure("Password is required"));
        }

        try {
            dispatch(signInStart());
            const res = await fetch("/api/auth/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(signInFailure(data.message));
            }
            // setLoading(false);
            if (res.ok) {
                dispatch(signInSuccess(data))
                navigate("/");
            }
        } catch (error) {
            dispatch(signInFailure(error.message))
        }
    }

    return (
        <div className='min-h-screen mt-20'>
            <div className="flex p-3 max-w-4xl mx-auto flex-col md:flex-row md:items-center gap-5">
                {/* Left Section */}
                <div className="flex-1 text-center md:text-left">
                    <Link to={"/"} className='font-bold dark:text-white text-4xl'>
                        <span className='text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-full px-5 py-2.5 text-center me-2 mb-2'>IBlogIt</span>
                    </Link>
                    <p className='text-sm mt-5'>Begin a journey with IBlogIt! Join our community today. <br />Sign in using your email or Google.</p>
                </div>
                {/* Right Section */}
                <div className="flex-1">
                    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
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
                                ) : "Sign In"
                            }
                        </Button>
                    </form>
                    <div className="flex gap-2 text-sm mt-5">
                        <span>Don't have an account ?</span>
                        <Link to={"/sign-up"} className='text-blue-500'>Sign Up</Link>
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
