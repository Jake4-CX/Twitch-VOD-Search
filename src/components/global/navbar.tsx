import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Box } from "lucide-react"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAppSelector } from "@/redux/store";
import ThemeToggleComponent from "@/components/global/themeToggle";
import { removeLocalStoredTokens, removeLocalStoredUser } from "@/api/authentication";
import { useDispatch } from "react-redux";
import { setTokens, setUser } from "@/redux/features/user-slice";

const NavbarComponent: React.FC = () => {

  // userRedux import (if required)

  return (
    <>
      <header className="flex h-14 lg:h-[60px] items-center justify-center gap-4 border-b bg-gray-100/40 dark:bg-gray-800/40">
        <div className="flex w-full px-[6%] md:px-[4%] lg:max-w-[1280px] items-center gap-4">
          <Link className="flex items-center gap-2 font-semibold hover:bg-secondary px-4 py-2 rounded-lg duration-300" to="/">
            <Box className="h-6 w-6" />
            <span className="hidden lg:block">Example</span>
          </Link>
          <div className="w-full flex-1">
            {/* <form>
            <div className="relative">
              <FiSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                className="w-full bg-white shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3 dark:bg-gray-950"
                placeholder="Search products..."
                type="search"
              />
            </div>
          </form> */}
          </div>
          <ThemeToggleComponent />
          <LoginProfileComponent />
        </div>
      </header>
    </>
  )

}

const LoginProfileComponent: React.FC = () => {

  const dispatch = useDispatch();
  const userRedux = useAppSelector((state) => state.userReduser.value);

  return (
    <>
      {
        userRedux.userData ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="rounded-full border border-gray-200 w-8 h-8 dark:border-gray-800"
                  size="icon"
                  variant="ghost"
                >
                  <img
                    alt="Avatar"
                    className="rounded-full"
                    height="32"
                    src="/avatar.webp"
                    style={{
                      aspectRatio: "32/32",
                      objectFit: "cover",
                    }}
                    width="32"
                  />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuPortal>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logoutUser}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button
                size={"default"}
                variant={"outline"}
              >
                Login
              </Button>
            </Link>
          </>
        )
      }
    </>
  )

  function logoutUser() {
    
    removeLocalStoredUser();
    removeLocalStoredTokens();
  
    dispatch(setUser(undefined));
    dispatch(setTokens(undefined));

    // refresh page to clear state
    window.location.reload();
  }
}

export default NavbarComponent;