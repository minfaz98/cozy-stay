import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Menu, X, User, Home, Calendar, Hotel, Bell, Bed, Info, Image, HelpCircle, Shield, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Hotel className="h-8 w-8 text-hotel-accent" />
          <span className="text-2xl font-display font-bold text-hotel">CozyStay</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              {user ? (
                <>
                  {user?.role !== 'MANAGER' && (
                    <>
                      <NavigationMenuItem>
                        <Link to="/dashboard" className="navigation-link flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="navigation-link flex items-center gap-1">
                          <Bed className="h-4 w-4" />
                          <span>Rooms</span>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid gap-3 p-4 w-[400px] md:w-[500px] grid-cols-2">
                            <li className="row-span-3">
                              <NavigationMenuLink asChild>
                                <Link
                                  to="/rooms"
                                  className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-hotel to-hotel-dark p-6 no-underline outline-none focus:shadow-md"
                                >
                                  <div className="mt-4 mb-2 text-lg font-medium text-white">
                                    Browse All Rooms
                                  </div>
                                  <p className="text-sm leading-tight text-white/90">
                                    View our complete selection of rooms and suites.
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                            <ListItem href="/rooms?type=SINGLE" title="Single Rooms">
                              Perfect for solo travelers.
                            </ListItem>
                            <ListItem href="/rooms?type=DOUBLE" title="Double Rooms">
                              Ideal for couples or small families.
                            </ListItem>
                            <ListItem href="/rooms?type=SUITE" title="Luxury Suites">
                              Experience premium comfort.
                            </ListItem>
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <Link to="/check-availability" className="navigation-link flex items-center gap-1">
                          <Search className="h-4 w-4" />
                          <span>Check Availability</span>
                        </Link>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <Link to="/reservations" className="navigation-link flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>My Bookings</span>
                        </Link>
                      </NavigationMenuItem>
                    </>
                  )}
                  {user.role === 'MANAGER' && (
                    <NavigationMenuItem>
                      <Link to="/admin/dashboard" className="navigation-link flex items-center gap-1">
                        <Shield className="h-4 w-4" />
                        <span>Admin Panel</span>
                      </Link>
                    </NavigationMenuItem>
                  )}
                </>
              ) : (
                <>
                  <NavigationMenuItem>
                    <Link to="/" className="navigation-link flex items-center gap-1">
                      <Home className="h-4 w-4" />
                      <span>Home</span>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="navigation-link">Rooms</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-4 w-[400px] md:w-[500px] grid-cols-2">
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <Link
                              to="/rooms"
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-hotel to-hotel-dark p-6 no-underline outline-none focus:shadow-md"
                            >
                              <div className="mt-4 mb-2 text-lg font-medium text-white">
                                View Our Rooms
                              </div>
                              <p className="text-sm leading-tight text-white/90">
                                Discover our range of comfortable accommodations.
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <ListItem href="/rooms?type=SINGLE" title="Single Rooms">
                          Perfect for solo travelers.
                        </ListItem>
                        <ListItem href="/rooms?type=DOUBLE" title="Double Rooms">
                          Ideal for couples or small families.
                        </ListItem>
                        <ListItem href="/rooms?type=SUITE" title="Luxury Suites">
                          Experience premium comfort.
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/check-availability" className="navigation-link flex items-center gap-1">
                      <Search className="h-4 w-4" />
                      <span>Check Availability</span>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="navigation-link">About</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-4 w-[400px] md:w-[500px] grid-cols-2">
                        <ListItem href="/about" title="About Us" icon={<Info className="h-4 w-4 mr-2" />}>
                          Learn about our hotel and our story.
                        </ListItem>
                        <ListItem href="/amenities" title="Amenities" icon={<Bed className="h-4 w-4 mr-2" />}>
                          Discover our premium facilities and services.
                        </ListItem>
                        <ListItem href="/gallery" title="Gallery" icon={<Image className="h-4 w-4 mr-2" />}>
                          View our photo gallery.
                        </ListItem>
                        <ListItem href="/faqs" title="FAQs" icon={<HelpCircle className="h-4 w-4 mr-2" />}>
                          Frequently asked questions.
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Auth buttons */}
          <div className="flex items-center gap-2">
            {user ? (
              <Button
                variant="ghost"
                onClick={logout}
                className="text-gray-700 hover:text-hotel"
              >
                Logout
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-gray-700 hover:text-hotel">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-hotel hover:bg-hotel-light text-white">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-hotel"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white pt-2 pb-4 px-4 animate-fade-in">
          <ul className="space-y-4">
            {user ? (
              <>
                <li>
                  <Link
                    to="/dashboard"
                    className="navigation-link block py-2 border-b border-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/rooms"
                    className="navigation-link block py-2 border-b border-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Browse Rooms
                  </Link>
                </li>
                <li>
                  <Link
                    to="/check-availability"
                    className="navigation-link block py-2 border-b border-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Check Availability
                  </Link>
                </li>
                <li>
                  <Link
                    to="/reservations"
                    className="navigation-link block py-2 border-b border-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    My Bookings
                  </Link>
                </li>
                {user.role === 'MANAGER' && (
                  <li>
                    <Link
                      to="/admin/dashboard"
                      className="navigation-link block py-2 border-b border-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  </li>
                )}
                <li>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left text-gray-700 hover:text-hotel"
                  >
                    Logout
                  </Button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/"
                    className="navigation-link block py-2 border-b border-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/rooms"
                    className="navigation-link block py-2 border-b border-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Browse Rooms
                  </Link>
                </li>
                <li>
                  <Link
                    to="/check-availability"
                    className="navigation-link block py-2 border-b border-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Check Availability
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="navigation-link block py-2 border-b border-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/amenities"
                    className="navigation-link block py-2 border-b border-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Amenities
                  </Link>
                </li>
                <li>
                  <Link
                    to="/gallery"
                    className="navigation-link block py-2 border-b border-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faqs"
                    className="navigation-link block py-2 border-b border-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    FAQs
                  </Link>
                </li>
                <li className="flex gap-2 pt-2">
                  <Link to="/login">
                    <Button variant="ghost" className="text-gray-700 hover:text-hotel">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-hotel hover:bg-hotel-light text-white">
                      Register
                    </Button>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    icon?: React.ReactNode;
  }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none flex items-center">{icon}{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Navbar;
