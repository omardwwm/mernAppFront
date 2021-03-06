import React, { useState, useEffect } from 'react';
import {useSelector, useDispatch} from "react-redux";
import {logOut} from "../../redux";
import {Redirect, useHistory, withRouter, Link} from "react-router-dom";
import {Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button
} from 'reactstrap';
import {GoSignIn} from 'react-icons/go';
import {RiLogoutBoxLine, RiUserFill, RiUserAddFill, RiAccountPinBoxLine} from 'react-icons/ri';
import "./navBar.css";

const NavBar = (props)=>{
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);
    const isLogged = useSelector(state=>state.userReducer.isUserLogged);
    const[logged, setLogged] = useState(isLogged);
    // console.log(isLogged);
    // console.log(logged);
    const token = localStorage.getItem('userToken')
    // console.log('token from navBar', token);
    // const user = localStorage.getItem('myUser')
    const user = JSON.parse(localStorage.getItem('myUser'));
    // console.log(user);
    const dispatch = useDispatch(); 
    // const logoutfrom = dispatch(logOut());
    let history = useHistory();
    const logoutFromNavBar = ()=>{
        // localStorage.removeItem('userToken');
        dispatch(logOut());
        history.push("/");
    }

    // useEffect(()=>{
    //     // localStorage.getItem('userToken');
    //     setLogged(isLogged);
    // }, [])

    return(
        <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">Home</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <Link to="/recipes/">Nos recettes</Link>
            </NavItem>
            <NavItem>
                  <Link to="/create-recipes/">Creer votre recette</Link>
                </NavItem>
                <NavItem>
                  <Link to="/chefs/">Nos chefs</Link>
                </NavItem>
            {/* {user ? 
            (
              <>
                <NavItem>
                  <Link to="/create-recipes/">Creer votre recette</Link>
                </NavItem>
                <NavItem>
                  <Link to="/recipes/">Nos chefs</Link>
                </NavItem>
              </>
              
            ) : null
            } */}

            
            {/* <NavItem>
              <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>
            </NavItem> */}
            {/* <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Options
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>
                  Option 1
                </DropdownItem>
                <DropdownItem>
                  Option 2
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem>
                  Reset
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown> */}
          </Nav>
        
        {user ? 
            (
              <div>
                 <Link to={{pathname:`/profile/${user.id}`}} ><Button className="d-inline-block">
                   {/* <RiAccountPinBoxLine style={{color:'#ddff13', fontSize:'22px'}}/> */}
                   <img src={user && user.profilePicture} className="profilePic" style={{width:'24px', height:'24px'}} />
                   My info</Button></Link>
                <Button onClick={logoutFromNavBar}> <RiLogoutBoxLine style={{color:'#f00', fontSize:'22px'}}/>LOGOUT</Button>
              </div>
            
            )
            :
            (
              <div>
                <Link to='/login' ><Button className="d-inline-block"><GoSignIn style={{color:'#0f0', fontSize:'22px'}}/> <RiUserFill/></Button></Link>
                <Link to='/create-account' ><Button className="d-inline-block">CREATE<RiUserAddFill style={{color:'#0f0', fontSize:'22px'}}/></Button></Link>
              </div>
                
            )
        }
           
        </Collapse>
      </Navbar>
    </div>
    )
}

export default withRouter (NavBar);