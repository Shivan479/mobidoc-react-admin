
import React, { useState } from "react";
import SimpleBar from 'simplebar-react';
import { useLocation } from "react-router-dom";
import { CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faTable, faTimes, faUser, faUsers, faGifts, faBusinessTime, faList, faPlus, faInfo, faBoxOpen, faWindowRestore, faDollarSign, faAddressBook } from "@fortawesome/free-solid-svg-icons";
import { Nav, Badge, Image, Button, Dropdown, Accordion, Navbar } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';

import { Routes } from "../routes";
import Logo from "../assets/img/logo.png";
import ProfilePicture from "../assets/img/team/profile-picture-3.jpg";

export default (props = {}) => {
  const location = useLocation();
  const { pathname } = location;
  const [show, setShow] = useState(false);
  const showClass = show ? "show" : "";

  const onCollapse = () => setShow(!show);

  const CollapsableNavItem = (props) => {
    const { eventKey, title, icon, children = null } = props;
    const defaultKey = pathname.indexOf(eventKey) !== -1 ? eventKey : "";

    return (
      <Accordion as={Nav.Item} defaultActiveKey={defaultKey}>
        <Accordion.Item eventKey={eventKey}>
          <Accordion.Button as={Nav.Link} className="d-flex justify-content-between align-items-center">
            <span>
              <span className="sidebar-icon"><FontAwesomeIcon icon={icon} /> </span>
              <span className="sidebar-text">{title}</span>
            </span>
          </Accordion.Button>
          <Accordion.Body className="multi-level">
            <Nav className="flex-column">
              {children}
            </Nav>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  };

  const NavItem = (props) => {
    const { title, link, external, target, icon, image, badgeText, badgeBg = "secondary", badgeColor = "primary" } = props;
    const classNames = badgeText ? "d-flex justify-content-start align-items-center justify-content-between" : "";
    const navItemClassName = link === pathname ? "active" : "";
    const linkProps = external ? { href: link } : { as: Link, to: link };

    return (
      <Nav.Item className={navItemClassName} onClick={() => setShow(false)}>
        <Nav.Link {...linkProps} target={target} className={classNames}>
          <span>
            {icon ? <span className="sidebar-icon"><FontAwesomeIcon icon={icon} /> </span> : null}
            {image ? <Image src={image}  height={25} className="sidebar-icon svg-icon" /> : null}

            <span className="sidebar-text">{title}</span>
          </span>
          {badgeText ? (
            <Badge pill bg={badgeBg} text={badgeColor} className="badge-md notification-count ms-2">{badgeText}</Badge>
          ) : null}
        </Nav.Link>
      </Nav.Item>
    );
  };

  return (
    <>
      <Navbar expand={false} collapseOnSelect variant="dark" className="navbar-theme-primary px-4 d-md-none">
        <Navbar.Brand className="me-lg-5" as={Link} to={Routes.Dashboard.path}>
          <Image src={Logo} className="navbar-brand-light" />
        </Navbar.Brand>
        <Navbar.Toggle as={Button} aria-controls="main-navbar" onClick={onCollapse}>
          <span className="navbar-toggler-icon" />
        </Navbar.Toggle>
      </Navbar>
      <CSSTransition timeout={300} in={show} classNames="sidebar-transition">
        <SimpleBar className={`collapse ${showClass} sidebar d-md-block bg-primary text-white`}>
          <div className="sidebar-inner px-4 pt-3">
            <div className="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4">
              <div className="d-flex align-items-center">
                <div className="user-avatar lg-avatar me-4">
                  <Image src={Logo} className="card-img-top rounded-circle border-white" />
                </div>
                <div className="d-block">
                  <h6>Hi, Admin</h6>
                  <Button as={Link} variant="secondary" size="xs" to={Routes.Signin.path} className="text-dark">
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Sign Out
                  </Button>
                </div>
              </div>
              <Nav.Link className="collapse-close d-md-none" onClick={onCollapse}>
                <FontAwesomeIcon icon={faTimes} />
              </Nav.Link>
            </div>
            <Nav className="flex-column pt-3 pt-md-0">
              <Image src={Logo} style={{ backgroundColor: 'white', marginBottom:20, borderRadius: '6px'}}/>
              <NavItem title="Overview" link={Routes.Dashboard.path} />

              

              <Dropdown.Divider className="my-3 border-indigo" />

              {/* <NavItem title="About" link={Routes.About.path} icon={faInfo}>
                About
              </NavItem> */}
              <CollapsableNavItem eventKey="doctors/" title="Doctors" icon={faBusinessTime}>
                <NavItem title="List" link={Routes.DoctorsList.path} icon={faList} />
                {/* <NavItem title="Create" link={Routes.CronsCreate.path} icon={faPlus} /> */}
                {/* <NavItem title="Logs" link={Routes.CronLogsList.path} icon={faWindowRestore} /> */}
                {/* <NavItem title="Revanue(Coming soon)" link={'#'} icon={faWindowRestore} /> */}
              </CollapsableNavItem>
              <CollapsableNavItem eventKey="users/" title="Users" icon={faBusinessTime}>
                <NavItem title="List" link={Routes.UsersList.path} icon={faList} />
                {/* <NavItem title="Create" link={Routes.CronsCreate.path} icon={faPlus} /> */}
                {/* <NavItem title="Logs" link={Routes.CronLogsList.path} icon={faWindowRestore} /> */}
                {/* <NavItem title="Revanue(Coming soon)" link={'#'} icon={faWindowRestore} /> */}
              </CollapsableNavItem>
              <NavItem title="Payments" link={'#'} icon={faDollarSign} />
              <NavItem title="Logs" link={'#'} icon={faAddressBook} />

              {/* <CollapsableNavItem eventKey="holidays/" title="Holidays" icon={faGifts}>
                <NavItem title="List" link={Routes.HolidaysList.path} icon={faList} />
                <NavItem title="Create" link={Routes.HolidaysCreate.path} icon={faPlus} />
              </CollapsableNavItem> */}

              {/* <NavItem title="Merchants" link={Routes.MerchantsList.path} icon={faUsers} /> */}

              {/* <CollapsableNavItem eventKey="components/" title="Components" icon={faBoxOpen}>
                <NavItem title="Accordion" link={Routes.Accordions.path} />
                <NavItem title="Alerts" link={Routes.Alerts.path} />
                <NavItem title="Badges" link={Routes.Badges.path} />
                <NavItem external title="Widgets" link="https://demo.themesberg.com/volt-pro-react/#/components/widgets" target="_blank" badgeText="Pro" />
                <NavItem title="Breadcrumbs" link={Routes.Breadcrumbs.path} />
                <NavItem title="Buttons" link={Routes.Buttons.path} />
                <NavItem title="Forms" link={Routes.Forms.path} />
                <NavItem title="Modals" link={Routes.Modals.path} />
                <NavItem title="Navbars" link={Routes.Navbars.path} />
                <NavItem title="Navs" link={Routes.Navs.path} />
                <NavItem title="Pagination" link={Routes.Pagination.path} />
                <NavItem title="Popovers" link={Routes.Popovers.path} />
                <NavItem title="Progress" link={Routes.Progress.path} />
                <NavItem title="Tables" link={Routes.Tables.path} />
                <NavItem title="Tabs" link={Routes.Tabs.path} />
                <NavItem title="Toasts" link={Routes.Toasts.path} />
                <NavItem title="Tooltips" link={Routes.Tooltips.path} />
              </CollapsableNavItem> */}

            </Nav>
          </div>
        </SimpleBar>
      </CSSTransition>
    </>
  );
};
