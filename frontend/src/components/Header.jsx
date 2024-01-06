import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap'
import { logout } from '../slices/authSlice';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { userInfo } = useSelector(state => state.auth);

    console.log(userInfo)

    const [logoutApiCall] = useLogoutMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/')
            console.log("logout clicked")
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <header>
            <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand>MERN Auth</Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls='basic-navbar-nav' />
                    <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav className='ms-auto'>
                            {
                                userInfo ? (
                                    <React.Fragment>
                                        <NavDropdown title={userInfo.name} id='username'>
                                            <LinkContainer to="/profile">
                                                <NavDropdown.Item>
                                                    Profile
                                                </NavDropdown.Item>
                                            </LinkContainer>
                                            <NavDropdown.Item onClick={logoutHandler}>
                                                Logout
                                            </NavDropdown.Item>
                                        </NavDropdown>
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        <LinkContainer to="/login">
                                            <Nav.Link>
                                                <FaSignInAlt /> Sing In
                                            </Nav.Link>
                                        </LinkContainer>
                                        <LinkContainer to="/register">
                                            <Nav.Link>
                                                <FaSignOutAlt /> Sing Up
                                            </Nav.Link>
                                        </LinkContainer>
                                    </React.Fragment>
                                )
                            }

                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar >
        </header >
    )
}

export default Header;