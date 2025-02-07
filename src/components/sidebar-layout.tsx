import { useAuth } from "@/hooks/use-auth";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu} from "lucide-react";
import SigapLogo from "/src/assets/sigap.svg";
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

type Props = {
  children: React.ReactNode;
};

const SidebarLayout = (props: Props) => {
  const { children } = props;

  const { auth } = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);
  const sidebarWidth = isExpanded ? 316 : 80;
  const [openSubNav, setOpenSubNav] = useState<string[]>([]);
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    if (!isMobileScreen) {
      setIsExpanded(!isExpanded);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768; 
      setIsMobileScreen(isMobile);

      if (isMobile) {
        setIsExpanded(false); 
        setIsSidebarVisible(false)
      } else {
        setIsSidebarVisible(true)
        setIsExpanded(true)
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setOpenSubNav(["Master Data", "SIHKA"]);
  }, []);

  const handleSubNavToggle = (text: string) => {
    setOpenSubNav((prevOpenSubNav) =>
      prevOpenSubNav.includes(text)
        ? prevOpenSubNav.filter((item) => item !== text)
        : [...prevOpenSubNav, text]
    );
  };

  useEffect(() => {
    if (!isExpanded) {
      setOpenSubNav([]);
    }
  }, [isExpanded]);

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
      iconClosed: <ChevronDownIcon 
      isSelected={
        location.pathname.includes("/hidrology") ||
        location.pathname.includes("/hidrology/rainfall") ||
        location.pathname.includes("/hidrology/water-level") ||
        location.pathname.includes("/climatology") ||
        location.pathname.includes("/water-quality") ||
        location.pathname.includes("/map")
      } 
      />,
      iconOpened: <ChevronUpIcon
      isSelected={
        location.pathname.includes("/hidrology") ||
        location.pathname.includes("/hidrology/rainfall") ||
        location.pathname.includes("/hidrology/water-level") ||
        location.pathname.includes("/climatology") ||
        location.pathname.includes("/water-quality") ||
        location.pathname.includes("/map")
      }
      />,
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
      iconClosed: <ChevronDownIcon 
      isSelected={
        location.pathname.includes("/assets-data") ||
        location.pathname.includes("/projects-data") ||
        location.pathname.includes("/employees-data") ||
        location.pathname.includes("/jdih") 
      } 
      />,
      iconOpened: <ChevronUpIcon
      isSelected={
        location.pathname.includes("/assets-data") ||
        location.pathname.includes("/projects-data") ||
        location.pathname.includes("/employees-data") ||
        location.pathname.includes("/jdih") 
      }
      />,
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
      icon: <SiJagaCaiIcon isSelected={location.pathname === "/sijagacai/" || /^\/sijagacai\/[a-zA-Z0-9-]+$/.test(location.pathname) || location.pathname === "/sijagacai"} />,
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
    <div className="flex overflow-hidden bg-background relative">
      {isSidebarVisible && (
        <aside
          style={{
            width: isExpanded ? 316 : 80,
            background: "linear-gradient(135deg, #25185A, #4F33C0)",
          }}
          className="text-white transition-all duration-300 ease-in-out my-5 ml-5 mr-7 rounded-2xl pb-4"
        >
        <div className="flex items-center justify-between p-4">
          {isExpanded && <img src={SigapLogo} alt="Logo PUPR" />}
          {!isMobileScreen && (
            <button 
              onClick={toggleSidebar} 
              className="p-2"
            >
              <Menu size={24} />
            </button>
          )}
        </div>
        <nav>
          {!isMobileScreen && (
            <div className="h-px bg-[#8873CD] mx-4 mb-4" />
          )}
          <ul>
            {isExpanded && (
              <div className="text-base px-5 py-4 font-semibold">
                Menu Utama
              </div>
            )}
            {menuItems.map((item, index) => (
              <li key={index} className="relative group">
                <NavLink
                  to={item.to}
                  className={({ isActive }) => `
                    flex items-center px-5 py-3 transition-colors rounded-full mx-2 font-semibold 
                    ${isExpanded ? "justify-start" : "justify-center"}
                    ${
                      (isActive && item.to !== "#") ||
                      (item.subNav &&
                        item.subNav.some((sub) => window.location.pathname.includes(sub.path)))
                        ? "bg-white text-primary-brand-500"
                        : ""
                    }
                  `}
                  onClick={() => item.subNav && handleSubNavToggle(item.text)}
                >
                  {item.icon}
                  {isExpanded && <span className="ml-4">{item.text}</span>}
                  {isExpanded && item.subNav && (
                    <span className="ml-auto">
                      {openSubNav.includes(item.text)
                        ? item.iconOpened
                        : item.iconClosed}
                    </span>
                  )}
                </NavLink>

                {item.subNav && openSubNav.includes(item.text) && (
                  <ul className="p-3 space-y-2 bg-primary-brand-600 mx-2 rounded-xl mt-2 mb-3">
                    {item.subNav.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <NavLink
                          to={subItem.path}
                          className={({ isActive }) => `
                            flex items-center p-2 transition-colors rounded-xl mx-2 font-semibold
                            ${isActive ? "bg-primary-brand-400" : ""}
                          `}
                        >
                          {subItem.iconSubNav}
                          <span className="ml-4">{subItem.title}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
                {!isExpanded && (
                  <span className="absolute z-50 left-full ml-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.text}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      )}

      <main
        style={{
          width: auth ? `calc(100% - ${sidebarWidth}px)` : "100%",
        }}
        className="flex-1 bg-background relative"
      >
        <div className={`h-full overflow-y-auto ${auth ? "p-5" : "p-0"}`}>
          {children}
        </div>
      </main>

    </div>
  );
};

export default SidebarLayout;
