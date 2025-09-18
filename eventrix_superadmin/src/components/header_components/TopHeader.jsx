import React from 'react'
import { CiFacebook } from "react-icons/ci";
import { CiLinkedin } from "react-icons/ci";
import { CiTwitter } from "react-icons/ci";

const TopHeader = () => {
  return (
    <div className="text-right shadow-sm flex items-center justify-between">

<ul className="nav">
  <li className="nav-item">
    <a className="nav-link text-dark font-bold text-2xl" href="/">Eventrix</a>
  </li>

</ul>
      <ul className="nav justify-content-end items-center ">
  <li className="nav-item">
    <a className="nav-link text-dark"  href="https://www.facebook.com" target="_blank"><CiFacebook className='w-auto h-5' /></a>
  </li>
  <li className="nav-item">
  <a className="nav-link text-dark"  href="https://www.twitter.com" target="_blank"><CiTwitter  className='w-auto h-5' /></a>
  </li>
  <li className="nav-item">
  <a className="nav-link text-dark"  href="https://www.linkedin.com" target="_blank"><CiLinkedin className='w-auto h-5' /></a>
  </li>
  <li className="nav-item">
    <a className="nav-link text-dark"  href="https://www.ecoders.in" target="_blank">eventrixofficial@gmail.com</a>
  </li>

  <li className="nav-item">
  <a className="nav-link text-dark"  href="https://www.ecoders.in" target="_blank">+91 9538596766</a>
  </li>
</ul>
    </div>
  )
}

export default TopHeader
