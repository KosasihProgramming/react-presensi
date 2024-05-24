import { Link } from "react-router-dom";
import { Disclosure, Menu } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { IoIosArrowDown } from "react-icons/io";
import { useState } from "react";
import Swal from "sweetalert2";

const loggedInNavItems = [
  { name: "Shift", href: "/shift" },
  { name: "Jadwal", href: "/jadwal-kehadiran" },
  { name: "Master Data", href: "#" },
];

const notLoggedInNavItems = [
  { name: "Kehadiran", href: "/kehadiran" },
  { name: "Absen", href: "/presensi" },
];

const masterData = [
  { name: "Rekap Kehadiran Dokter", href: "/rekap-kehadiran-dokter" },
  { name: "Rekap Kehadiran Dokter Gigi", href: "/rekap-kehadiran-dokter-gigi" },
  { name: "Rekap Kehadiran Perawat", href: "/rekap-kehadiran-perawat" },
  {
    name: "Rekap Kehadiran Perawat Gigi",
    href: "/rekap-kehadiran-perawat-gigi",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Navigation = () => {
  const isLoggedIn = sessionStorage.getItem("user");

  const handleLogout = () => {
    Swal.fire({
      title: "Yakin ingin keluar?",
      showCancelButton: true,
      confirmButtonText: "Keluar",
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem("user");
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Berhasil logout",
          showConfirmButton: false,
          timer: 1500,
          didClose: () => {
            window.location.href = "/";
          },
        });
      }
    });
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                    alt="Your Company"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {isLoggedIn
                      ? loggedInNavItems.map((item) => (
                          <Menu key={item.name}>
                            <Menu.Button
                              as={Link}
                              to={item.href}
                              className={classNames(
                                "text-gray-300 hover:bg-gray-700 hover:text-white",
                                "rounded-md px-3 py-2 text-sm font-medium"
                              )}>
                              {item.name}
                              {item.name === "Master Data"}
                            </Menu.Button>
                            {item.name === "Master Data" && (
                              <Menu.Items className="origin-top-left absolute mt-2 w-50 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                  {masterData.map((data, index) => (
                                    <Menu.Item key={index}>
                                      {({ active }) => (
                                        <Link
                                          to={data.href}
                                          className={classNames(
                                            active ? "bg-gray-100" : "",
                                            "block px-4 py-2 text-sm text-gray-700"
                                          )}>
                                          {data.name}
                                        </Link>
                                      )}
                                    </Menu.Item>
                                  ))}
                                </div>
                              </Menu.Items>
                            )}
                          </Menu>
                        ))
                      : notLoggedInNavItems.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className={classNames(
                              "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "rounded-md px-3 py-2 text-sm font-medium"
                            )}>
                            {item.name}
                          </Link>
                        ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Tombol Login */}
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className={classNames(
                      "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "rounded-md px-3 py-2 text-sm font-medium"
                    )}>
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className={classNames(
                      "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "rounded-md px-3 py-2 text-sm font-medium"
                    )}>
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
};

export default Navigation;
