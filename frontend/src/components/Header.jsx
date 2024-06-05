import React, { useState, useEffect } from "react";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NavList() {
  return (
    <List className="mt-4 mb-6 p-0 lg:mt-0 lg:mb-0 lg:flex-row lg:p-1">
      <Typography
        as="a"
        href="#"
        variant="small"
        color="blue-gray"
        className="font-medium"
      >
        <ListItem className="flex items-center gap-2 py-2 pr-4">
          ¿Como jugar?
        </ListItem>
      </Typography>
      <Typography
        as="a"
        href="#"
        variant="small"
        color="blue-gray"
        className="font-medium"
      >
        <ListItem className="flex items-center gap-2 py-2 pr-4">
          ¿Como crear un bingo?
        </ListItem>
      </Typography>
      <Typography
        as="a"
        href="#"
        variant="small"
        color="blue-gray"
        className="font-medium"
      >
        <ListItem className="flex items-center gap-2 py-2 pr-4">
          Información y precios
        </ListItem>
      </Typography>
    </List>
  );
}

export function Header() {
  const [openNav, setOpenNav] = useState(false);
  const navigate = useNavigate();
  const { user, userName, handleLogout } = useAuth();

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const goToAdminBingo = () => {
    navigate("/list-bingos");
  };
  const gotToHome = () => {
    navigate("/");
  };

  return (
    <Navbar className="mx-auto min-w-full px-4 py-2 text-slate-950 shadow-lg">
      <div className="flex items-center justify-between text-blue-gray-900">
        <Typography
          as="a"
          variant="lead"
          className="mr-4 cursor-pointer py-1.5 lg:ml-2"
          onClick={gotToHome}
        >
          Power by Magnetic
        </Typography>
        <div className="hidden lg:block">
          <NavList />
        </div>
        <div className="hidden gap-2 lg:flex">
          {user && userName ? (
            <Menu>
              <MenuHandler>
                <div className="flex items-center gap-2">
                  <span>{userName}</span>
                  <img
                    src={
                      user?.photoURL ||
                      "https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG.png"
                    }
                    alt="Avatar"
                    className="h-8 w-8 rounded-full"
                  />
                </div>
              </MenuHandler>
              <MenuList className="text-center">
                <MenuItem onClick={goToAdminBingo}>Dashboard Bingos</MenuItem>
                <hr className="my-2 border-blue-gray-50" />
                <MenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 "
                >
                  <ArrowLeftStartOnRectangleIcon
                    className="h-4 w-4"
                    strokeWidth={2}
                  />
                  <Typography variant="small" className="font-medium">
                    Cerrar sesión
                  </Typography>
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <>
              <Button variant="outlined" size="sm" color="blue-gray">
                Log In
              </Button>
              <Button variant="gradient" size="sm">
                Sign In
              </Button>
            </>
          )}
        </div>
        <IconButton
          variant="text"
          color="blue-gray"
          className="lg:hidden"
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon className="h-6 w-6" strokeWidth={2} />
          ) : (
            <Bars3Icon className="h-6 w-6" strokeWidth={2} />
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        {openNav && (
          <div>
            <NavList />
            <div className="flex min-w-full flex-nowrap items-center gap-2 lg:hidden">
              {user && userName ? (
                <Menu>
                  <MenuHandler>
                    <div className="flex items-center gap-2">
                      <span>{userName}</span>
                      <img
                        src={
                          user?.photoURL ||
                          "https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG.png"
                        }
                        alt="Avatar"
                        className="h-8 w-8 rounded-full"
                      />
                    </div>
                  </MenuHandler>
                  <MenuList>
                    <MenuItem onClick={goToAdminBingo}>
                      Dashboard Bingos
                    </MenuItem>
                    <hr className="my-2 border-blue-gray-50" />
                    <MenuItem
                      onClick={handleLogout}
                      className="flex items-center gap-2 "
                    >
                      <ArrowLeftStartOnRectangleIcon
                        className="h-4 w-4"
                        strokeWidth={2}
                      />
                      <Typography variant="small" className="font-medium">
                        Cerrar sesión
                      </Typography>
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <>
                  <Button variant="outlined" size="sm" color="blue-gray">
                    Log In
                  </Button>
                  <Button variant="gradient" size="sm">
                    Sign In
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Collapse>
    </Navbar>
  );
}
