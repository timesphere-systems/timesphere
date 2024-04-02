import React from 'react'
import styled from 'styled-components';
import Logo from '../assets/icons/FDM.svg';
import Facebook from '../assets/icons/Facebook.svg';
import Twitter from '../assets/icons/Twitter.svg';
import Instagram from '../assets/icons/Instagram.svg';
import LinkedIn from '../assets/icons/LinkedIn.svg';
import TikTok from '../assets/icons/Tiktok.svg';

const FOOTER_WRAPPER = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    background-color: #1B143E;
    color: #ffffff;

    width: 100%;
`;

const FDM_COMPONENT = styled.div`
    display: flex;
    flex-direction: column;
`;

const CONTACT_WRAPPER = styled.div`
    display: flex;
    min-height: 220px;
    flex-direction: column;
    gap: 20px;
    justify-content: space-between;
    height: 100%;
`;
const CONTACT_COMPONENT = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;

    p{
        color: #A9A9A9;
        font-weight: bold;
        margin-top: 0;
        margin-bottom: 0;   
    }

    a{
        color: white;
        text-decoration: none;
        transition-duration: 0.5s;

    }
    a:hover{
        color: #FFA500;
        transition-duration: 0.25s;

    }

`;
const SOCIAL_MEDIA_WRAPPER = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
`;
const SOCIAL_MEDIA_ICON = styled.a`
    img{
        height: 30px;
        width: auto;
        transition-duration: 0.5s;
    }
    img:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 25px 1px rgb(0, 0, 0, 0.5);
        transition-duration: 0.5s;
    }

`;
const POLICIES_COMPONENT = styled.div`
    height: fit-content;
    display: flex;
    flex-direction: column;
    gap: 20px;
    p{
        color: #A9A9A9;
        font-weight: bold;
        margin-top: 0;
        margin-bottom: 0;   
    }

    a{
        color: white;
        text-decoration: none;
        transition-duration: 0.5s;
    }
    a:hover{
        color: #FFA500;
        transition-duration: 0.25s;
    }
`;

export default function Footer() {
  return (
    <FOOTER_WRAPPER>
        <FDM_COMPONENT id='FDM'>
            <p>© FDM Group 2024</p>
            <a href='https://www.fdmgroup.com/'><img src={Logo} alt="FDM Group logo"/></a>
        </FDM_COMPONENT>
        <CONTACT_WRAPPER>
            <CONTACT_COMPONENT>
                <p>Get in Touch</p>
                <a href='https://www.fdmgroup.com/about-us/contact-us/'>Contact Us</a>
                <a href='https://www.fdmgroup.com/about-us/contact-us/#offices'>Centers</a>
                <a href='https://careers.fdmgroup.com/vacancies/vacancy-search-results.aspx'>Vacancies</a>
            </CONTACT_COMPONENT>
            <SOCIAL_MEDIA_WRAPPER>
                <SOCIAL_MEDIA_ICON href='https://www.facebook.com/FDMGroup/?locale=en_GB'><img src={Facebook} alt="Facebook icon"/></SOCIAL_MEDIA_ICON>
                <SOCIAL_MEDIA_ICON href='https://twitter.com/FDMGroup?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor'><img src={Twitter} alt="Twitter icon"/></SOCIAL_MEDIA_ICON>
                <SOCIAL_MEDIA_ICON href='https://www.instagram.com/fdm_group/?hl=en'><img src={Instagram} alt="Instagram icon"/></SOCIAL_MEDIA_ICON>
                <SOCIAL_MEDIA_ICON href='https://www.linkedin.com/company/fdm-group/?originalSubdomain=uk'><img src={LinkedIn} alt="LinkedIn icon"/></SOCIAL_MEDIA_ICON>
                <SOCIAL_MEDIA_ICON href='https://www.tiktok.com/@fdm_group'><img src={TikTok} alt="TikTok icon"/></SOCIAL_MEDIA_ICON>
            </SOCIAL_MEDIA_WRAPPER>
        </CONTACT_WRAPPER>
        <POLICIES_COMPONENT>
            <p>Policies</p>
            <a href='https://www.fdmgroup.com/privacy-policy/'>Privacy Policy</a>
            <a href='https://www.fdmgroup.com/cookie-policy/'>Cookies</a>
            <a href='https://www.fdmgroup.com/terms-conditions/'>T&C's</a>
            <a href='https://www.fdmgroup.com/modern-slavery-act/'>Modern Slavery Act</a>
            <a href='https://www.fdmgroup.com/accessibility/'>Accessibility</a>
        </POLICIES_COMPONENT>
    </FOOTER_WRAPPER>
  )
}
