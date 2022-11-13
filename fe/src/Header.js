import { Link } from 'react-router-dom';

export const Header = () => {

    const logo = (<svg width="41" height="55" viewBox="0 0 41 55" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M0.400024 34.2C0.400024 23.0333 7.10002 12.9833 20.5 0.700012C33.9 12.9833 40.6 23.0333 40.6 34.2C40.6 39.5309 38.4823 44.6434 34.7129 48.4129C30.9434 52.1823 25.8309 54.3 20.5 54.3C15.1692 54.3 10.0567 52.1823 6.28718 48.4129C2.5177 44.6434 0.400024 39.5309 0.400024 34.2ZM35.919 31.0867C30.2061 28.9338 24.0198 31.8014 18.222 34.4814C13.5008 36.6611 9.03856 38.7247 5.29996 37.8716C5.01123 36.6691 4.8658 35.4367 4.86669 34.2C4.86669 25.7669 9.45396 17.5483 20.5 6.83721C30.1838 16.2261 34.905 23.7033 35.919 31.0912V31.0867Z" fill="currentColor" />
    </svg>)


    return (
        <Link to='/'>
            <div className="header-background">
                <div className="header">
                    <div className="blending-logo">{logo}</div>
                    <span className="title">Blending Demo</span>
                </div >
            </div>
        </Link>
    )
}