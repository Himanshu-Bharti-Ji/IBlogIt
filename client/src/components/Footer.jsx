import React from 'react'
import { Footer, FooterCopyright, FooterDivider, FooterIcon } from 'flowbite-react'
import { Link } from "react-router-dom"
import { BsLinkedin, BsInstagram, BsTwitterX, BsGithub } from "react-icons/bs"


export default function FooterCom() {
    return (
        <Footer container className="border border-t-8 border-blue-500">
            <div className="w-full max-w-7xl mx-auto">
                <div className="grid w-full justify-between sm:flex md:grid-cols-1">
                    <div className="mt-5 mb-2">
                        <Link to={"/"} className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'>
                            <span className='text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-full text-lg px-5 py-2.5 text-center me-2 mb-2'>IBlogIt</span>
                        </Link>
                    </div>
                    <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
                        <div>
                            <Footer.Title title='About' />
                            <Footer.LinkGroup col>
                                <Footer.Link href='https://github.com/Himanshu-Bharti-Ji/IBlogIt' target='_blank' rel='noopener noreferrer' >
                                    Repository
                                </Footer.Link>
                                <Footer.Link href='/about' target='_blank' rel='noopener noreferrer' >
                                    IBlogIt
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title='Follow Us' />
                            <Footer.LinkGroup col>
                                <Footer.Link href='https://www.linkedin.com/in/himanshu-bharti-ji/' target='_blank' rel='noopener noreferrer' >
                                    LinkedIn
                                </Footer.Link>
                                <Footer.Link href='https://github.com/Himanshu-Bharti-Ji' target='_blank' rel='noopener noreferrer' >
                                    GitHub
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title='Legal' />
                            <Footer.LinkGroup col>
                                <Footer.Link href='#' target='_blank' rel='noopener noreferrer' >
                                    Privacy Policy
                                </Footer.Link>
                                <Footer.Link href='#' target='_blank' rel='noopener noreferrer' >
                                    Terms &amp; Conditions
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                    </div>
                </div>
                <FooterDivider />
                <div className="w-full sm:flex sm:items-center sm:justify-between">
                    <FooterCopyright
                        href='https://www.linkedin.com/in/himanshu-bharti-ji/'
                        by='Himanshu Bharti'
                        year={new Date().getFullYear()}
                    />
                    <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
                        <FooterIcon href='https://www.linkedin.com/in/himanshu-bharti-ji/' target='_blank' icon={BsLinkedin} />
                        <FooterIcon href='https://www.instagram.com/hitechhimanshu/' target='_blank' icon={BsInstagram} />
                        <FooterIcon href='https://x.com/HiTechHimanshu' target='_blank' icon={BsTwitterX} />
                        <FooterIcon href='https://github.com/Himanshu-Bharti-Ji' target='_blank' icon={BsGithub} />
                    </div>
                </div>
            </div>
        </Footer>
    )
}
