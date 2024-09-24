"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import Image from "next/image";

const Navbar = () => {
  const { data: session } = useSession();
  const [providers, setProviders] = useState(null)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const menuButtonRef = useRef(null);
  const menuRef = useRef(null);
  const profileImage = session?.user?.image;

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };

    setAuthProviders();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target) &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  return (
    <nav className="navbar bg-stone-200 border-b-2 border-red-100 py-4">
      <div className="container flex items-center justify-around">
        <Link
          href="/"
          className="navbar-brand text-2xl md:text-[28px] font-bold font-serif"
        >
          <span className="text-yellow-700">E</span>
          <span className="text-lime-900">u</span>
          <span className="text-yellow-800">r</span>
          <span className="text-yellow-800">e</span>
          <span className="text-yellow-700">k</span>
          <span className="text-yellow-800">a</span>{" "}
          <span className="text-blue-900">!</span>
        </Link>
        {!session ? (
          <div className="navbar-nav">
            <button
              className="middle none center mr-3 rounded-lg border border-orange-500 py-3 px-6 font-sans text-xs font-bold uppercase text-orange-500 transition-all hover:opacity-75 focus:ring focus:ring-pink-200 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              data-ripple-dark="true"
              disabled={!providers?.google}
              onClick={() => signIn(providers?.google.id)}
            >
              Sign In
            </button>
          </div>
        ) : (
          <div>
          <div className="relative">
            <button
              type="button"
              className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              id="user-menu-button"
              aria-expanded={isProfileMenuOpen}
              aria-haspopup="true"
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              ref={menuButtonRef}
            >
              <span className="absolute -inset-1.5"></span>
              <span className="sr-only">Open user menu</span>
              <Image
                className="h-9 w-9 rounded-full"
                src={profileImage || "https://www.seekpng.com/png/detail/966-9665493_my-profile-icon-blank-profile-image-circle.png"}
                alt=""
                width={40}
                height={40}
              />
            </button>

            {isProfileMenuOpen && (
              <div
                id="user-menu"
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-100 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                tabIndex="-1"
                ref={menuRef}
              >
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700"
                  role="menuitem"
                  tabIndex="-1"
                  id="user-menu-item-0"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                  }}
                >
                  Your Profile
                </Link>
                <Link
                  href={`/feedback`}
                  className="block px-4 py-2 text-sm text-gray-700"
                  role="menuitem"
                  tabIndex="-1"
                  id="user-menu-item-1"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                  }}
                >
                  Feedback
                </Link>
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    signOut();
                  }}
                  className="block px-4 py-2 text-sm text-gray-700"
                  role="menuitem"
                  tabIndex="-1"
                  id="user-menu-item-2"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
