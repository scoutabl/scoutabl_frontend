import React from 'react'
import footerLogo from '/greyLogo.svg'

const Footer = () => {
  return (
    <footer className='flex items-center justify-center gap-2'>
      <img src={footerLogo} alt="scoutable logo" />
      <span className='text-base font-normal text-greyTertiary'>Powered by Scoutabl</span>
    </footer >
  )
}

export default Footer