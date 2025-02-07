import React, { useState } from "react";
import Notifications from "./notifications";
import UserMenu from "./user-menu";
import { Menu } from "lucide-react";
import { NavLink } from "react-router-dom";
import DashboardIcon from "./icon/sidebar/dashboard-icon";
import PintuAirIcon from "./icon/sidebar/pintu-air-icon";
import InfraIcon from "./icon/sidebar/infra-icon";
import MasterDataIcon from "./icon/sidebar/master-data-icon";
import KonfigurasiAIIcon from "./icon/sidebar/konfig-ai-icon";
import KonfigurasiAlarmIcon from "./icon/sidebar/konfig-alarm-icon";
import ManajemenPenggunaIcon from "./icon/sidebar/manajemen-pengguna-icon";
import SIHKAIcon from "./icon/sidebar/sihka";
import ChevronDownIcon from "./icon/sidebar/chevron-down";
import ChevronUpIcon from "./icon/sidebar/chevron-up";
import SiJagaCaiIcon from "./icon/sidebar/sijagacai-icon";

interface HeaderDashboardProps {
  icon: string;
  title1: React.ReactNode;
  title2: string;
}

const HeaderDashboard: React.FC<HeaderDashboardProps> = ({
  icon,
  title1: title1Component,
  title2,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubNav, setOpenSubNav] = useState<string[]>([]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleSubNavToggle = (text: string) => {
    setOpenSubNav((prevOpenSubNav) =>
      prevOpenSubNav.includes(text)
        ? prevOpenSubNav.filter((item) => item !== text)
        : [...prevOpenSubNav, text]
    );
  };
  const menuItems = [
    {
      icon: <DashboardIcon isSelected={location.pathname === "/"} />,
      text: "Dashboard",
      to: "/",
    },
    {
      icon: <PintuAirIcon isSelected={location.pathname === "/water-gate"} />,
      text: "Pintu Air",
      to: "/water-gate",
    },
    {
      icon: (
        <InfraIcon isSelected={location.pathname.includes("/infrastructure")} />
      ),
      text: "Infrastruktur",
      to: "/infrastructure",
    },
    {
      icon: (
        <SIHKAIcon
          isSelected={
            location.pathname.includes("/hidrology") ||
            location.pathname.includes("/hidrology/rainfall") ||
            location.pathname.includes("/hidrology/water-level") ||
            location.pathname.includes("/climatology") ||
            location.pathname.includes("/water-quality") ||
            location.pathname.includes("/map")
          }
        />
      ),
      text: "SIHKA",
      to: "#",
      iconClosed: (
        <ChevronDownIcon
          isSelected={
            location.pathname.includes("/hidrology") ||
            location.pathname.includes("/hidrology/rainfall") ||
            location.pathname.includes("/hidrology/water-level") ||
            location.pathname.includes("/climatology") ||
            location.pathname.includes("/water-quality") ||
            location.pathname.includes("/map")
          }
        />
      ),
      iconOpened: (
        <ChevronUpIcon
          isSelected={
            location.pathname.includes("/hidrology") ||
            location.pathname.includes("/hidrology/rainfall") ||
            location.pathname.includes("/hidrology/water-level") ||
            location.pathname.includes("/climatology") ||
            location.pathname.includes("/water-quality") ||
            location.pathname.includes("/map")
          }
        />
      ),
      subNav: [
        {
          title: "Hidrologi",
          path: "/hidrology/rainfall",
          iconSubNav: (
            <div
              className={`w-2 h-2 rounded-full ${
                location.pathname.includes("/hidrology") ||
                location.pathname.includes("/hidrology/rainfall") ||
                location.pathname.includes("/hidrology/water-level") ||
                location.pathname.includes("/climatology")
                  ? "bg-secondary-brand-500"
                  : "bg-white"
              }`}
            />
          ),
        },
        {
          title: "Kualitas Air",
          path: "/water-quality",
          iconSubNav: (
            <div
              className={`w-2 h-2 rounded-full ${
                location.pathname.includes("/water-quality")
                  ? "bg-secondary-brand-500"
                  : "bg-white"
              }`}
            />
          ),
        },
        {
          title: "Peta",
          path: "/map",
          iconSubNav: (
            <div
              className={`w-2 h-2 rounded-full ${
                location.pathname.includes("/map")
                  ? "bg-secondary-brand-500"
                  : "bg-white"
              }`}
            />
          ),
        },
      ],
    },
    {
      icon: (
        <MasterDataIcon
          isSelected={
            location.pathname.includes("/assets-data") ||
            location.pathname.includes("/projects-data") ||
            location.pathname.includes("/employees-data") ||
            location.pathname.includes("/jdih")
          }
        />
      ),
      text: "Master Data",
      to: "#",
      iconClosed: (
        <ChevronDownIcon
          isSelected={
            location.pathname.includes("/assets-data") ||
            location.pathname.includes("/projects-data") ||
            location.pathname.includes("/employees-data") ||
            location.pathname.includes("/jdih")
          }
        />
      ),
      iconOpened: (
        <ChevronUpIcon
          isSelected={
            location.pathname.includes("/assets-data") ||
            location.pathname.includes("/projects-data") ||
            location.pathname.includes("/employees-data") ||
            location.pathname.includes("/jdih")
          }
        />
      ),
      subNav: [
        {
          title: "Data Aset",
          path: "/assets-data",
          iconSubNav: (
            <div
              className={`w-2 h-2 rounded-full ${
                location.pathname.includes("/assets-data")
                  ? "bg-secondary-brand-500"
                  : "bg-white"
              }`}
            />
          ),
        },
        {
          title: "Data Proyek",
          path: "/projects-data",
          iconSubNav: (
            <div
              className={`w-2 h-2 rounded-full ${
                location.pathname.includes("/projects-data")
                  ? "bg-secondary-brand-500"
                  : "bg-white"
              }`}
            />
          ),
        },
        {
          title: "Data Kepegawaian",
          path: "/employees-data",
          iconSubNav: (
            <div
              className={`w-2 h-2 rounded-full ${
                location.pathname.includes("/employees-data")
                  ? "bg-secondary-brand-500"
                  : "bg-white"
              }`}
            />
          ),
        },
        {
          title: "JDIH",
          path: "/jdih",
          iconSubNav: (
            <div
              className={`w-2 h-2 rounded-full ${
                location.pathname.includes("/jdih")
                  ? "bg-secondary-brand-500"
                  : "bg-white"
              }`}
            />
          ),
        },
      ],
    },
    {
      icon: (
        <SiJagaCaiIcon
          isSelected={
            location.pathname === "/sijagacai/" ||
            /^\/sijagacai\/[a-zA-Z0-9-]+$/.test(location.pathname) ||
            location.pathname === "/sijagacai"
          }
        />
      ),
      text: "Si JagaCai",
      to: "/sijagacai/",
    },
    {
      icon: (
        <KonfigurasiAIIcon
          isSelected={location.pathname.includes("/ai-configuration")}
        />
      ),
      text: "Konfigurasi Pengetahuan AI",
      to: "/ai-configuration/",
    },
    {
      icon: (
        <KonfigurasiAlarmIcon
          isSelected={
            location.pathname.includes("/alert-system/configuration") ||
            location.pathname.includes("/alert-system/history")
          }
        />
      ),
      text: "Sistem Peringatan",
      to: "/alert-system/configuration",
    },
    {
      icon: (
        <ManajemenPenggunaIcon
          isSelected={location.pathname.includes("/users")}
        />
      ),
      text: "Manajemen Pengguna",
      to: "/users/",
    },
  ];

  return (
    <div className="flex justify-between items-center">
      {/* Logo dan Judul */}
      <div className="flex flex-row gap-4 items-center">
        <div
          style={{
            background: "linear-gradient(135deg, #25185A, #4F33C0)",
          }}
          className="h-14 w-14 flex justify-center items-center text-center rounded-2xl"
        >
          <img src={icon} alt="Icon" width={28} height={28} />
        </div>
        <div className="flex flex-col gap-1">
          <div>{title1Component}</div>
          <div className="text-xl font-semibold">{title2}</div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex gap-7 items-center">
        <Notifications />
        <div className="w-[2px] h-6 bg-[#BACBEC]" />
        <UserMenu />
      </div>

      {/* Mobile View */}
      <div className="flex md:hidden">
        <button
          onClick={toggleMenu}
          aria-label="Open Menu"
          className="text-gray-700 focus:outline-none"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Fullscreen Menu for Mobile */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col p-6">
          <div className="mb-6 flex justify-between">
            <Notifications />
            <div className="flex">
              <UserMenu />
              <button
                onClick={toggleMenu}
                className="self-end mb-2 text-gray-700"
                aria-label="Close Menu"
              >
                ✕
              </button>
            </div>
          </div>
          <div
            className="mb-6 px-2 py-6 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, #25185A, #4F33C0)",
            }}
          >
            <div className="text-base px-5 pb-4 font-semibold text-white">
              Menu Utama
            </div>
            <ul className="space-y-4">
              {menuItems.map((item, index) => (
                <li key={index} className="relative group">
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => `
                      flex items-center px-5 py-3 transition-colors rounded-full mx-2 font-semibold
                      ${
                        (isActive && item.to !== "#") ||
                        (item.subNav &&
                          item.subNav.some((sub) =>
                            window.location.pathname.includes(sub.path)
                          ))
                          ? "bg-white text-primary-brand-500"
                          : "text-white hover:bg-purple-800"
                      }
                    `}
                    onClick={() => item.subNav && handleSubNavToggle(item.text)}
                  >
                    <div className="mr-3">{item.icon}</div>
                    <span>{item.text}</span>
                    {item.subNav && (
                      <span className="ml-auto">
                        {openSubNav.includes(item.text)
                          ? item.iconOpened
                          : item.iconClosed}
                      </span>
                    )}
                  </NavLink>

                  {/* Sub-navigation */}
                  {item.subNav && openSubNav.includes(item.text) && (
                    <ul className="p-3 space-y-2 bg-primary-brand-600 mx-2 rounded-xl mt-2 mb-3">
                      {item.subNav.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <NavLink
                            to={subItem.path}
                            className={({ isActive }) => `
                              flex items-center p-2 transition-colors rounded-xl mx-2 font-semibold
                              ${
                                isActive
                                  ? "bg-yellow-400 text-purple-900"
                                  : "text-gray-300 hover:text-white"
                              }
                            `}
                          >
                            {subItem.iconSubNav && (
                              <div className="mr-2">{subItem.iconSubNav}</div>
                            )}
                            <span>{subItem.title}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderDashboard;
