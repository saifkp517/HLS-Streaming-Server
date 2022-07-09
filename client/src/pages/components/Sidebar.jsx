import { useEffect, useRef, useState } from 'react';
import { GrHomeRounded, GrLogin , GrFormSearch} from "react-icons/gr";
import '../../scss/sidebar.scss'
import { Link, useLocation } from "react-router-dom";

const SideBarNavItems = [
    {
        display: 'Login',
        icon: <GrLogin />,
        to: '/',
        section: ''
    },

    {
        display: 'Account',
        icon: <GrHomeRounded />,
        to: '/DashBoard',
        section: 'DashBoard'
    },

    {
        display: 'Browse',
        icon: <GrFormSearch />,
        to: '/DashBoard',
        section: 'DashBoard'
    },
]

function SideBar() {

    const [activeIndex, setActiveIndex] = useState(0);
    const [stepHeight, setStepHeight] = useState(0);
    const sidebarRef = useRef();
    const indicatorRef = useRef();
    const location = useLocation();

    useEffect(() => {
        setTimeout(() => {
            const sidebarItem = sidebarRef.current.querySelector('.sidebar__menu__item');
            indicatorRef.current.style.height = `${sidebarItem.clientHeight}px`;
            setStepHeight(sidebarItem.clientHeight);
        }, 50);
    }, []);

    // change active index
    useEffect(() => {
        const curPath = window.location.pathname.split('/')[1];
        const activeItem = SideBarNavItems.findIndex(item => item.section === curPath);
        setActiveIndex(curPath.length === 0 ? 0 : activeItem);
    }, [location]);

    return (
        <div className='sidebar'>
            <div className="sidebar__logo">
                Animate
            </div>
            <div ref={sidebarRef} className="sidebar__menu">
                <div
                    ref={indicatorRef}
                    className="sidebar__menu__indicator"
                    style={{
                        transform: `translateX(-50%) translateY(${activeIndex * stepHeight}px)`
                    }}
                ></div>
                {
                    SideBarNavItems.map((item, index) => (
                        <Link className="link" to={item.to} key={index}>
                            <div className={`sidebar__menu__item ${activeIndex === index ? 'active' : ''}`}>
                                <div className="sidebar__menu__item__icon">
                                    {item.icon}
                                </div>
                                <div className="sidebar__menu__item__text">
                                    <p>{item.display}</p>
                                </div>
                            </div>
                        </Link>
                    ))
                }
            </div>
        </div>
    );
}

export default SideBar;
