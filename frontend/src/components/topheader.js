import React from 'react'
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Mail'
import PromotionCode from '../API/promotionCodeAPI';
import DiscountIcon from '@mui/icons-material/Discount';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import GoogleIcon from '@mui/icons-material/Google';

export default function topheader() {
  return (
    <div className='flex flex-row justify-between py-1 px-4 w-full'>
        <div className='flex flex-row text-xs items-center'>
            <PhoneIcon fontSize='small'/>
            <p className='px-1'> Call us: 123-456-7890 |</p>
            <EmailIcon fontSize='small'/>
            <p className='px-1'> Email: example@email.com</p>
        </div>
        <div className='flex flex-row text-xs items-center'>
            <DiscountIcon fontSize='small'/>
            <p className='px-2'>Claim Special Discount</p>
            <PromotionCode promotion="BLCKFRDY"/>
        </div>
        <div className='flex flex-row'>
            <FacebookIcon fontSize='small' style={{margin: '0px 10px'}}/>
            <YouTubeIcon fontSize='small' style={{margin: '0px 10px'}}/>
            <InstagramIcon fontSize='small' style={{margin: '0px 10px'}}/>
            <GoogleIcon fontSize='small' style={{margin: '0px 10px'}}/>
            <XIcon fontSize='small' style={{margin: '0px 10px'}}/>
        </div>
        
    </div>
  )
}
