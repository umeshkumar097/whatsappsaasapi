/**
 * ============================================================
 * © 2026 Aiclex Technologies
 * Original Author: Aiclex Engineering Team
 * Website: https://aiclex.in
 * Contact: info@aiclex.in
 *
 * All rights reserved.
 * ============================================================
 */
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import {
  MessageCircle,
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  Users,
  Briefcase,
  Mail,
  Zap,
  BookOpen,
  Calculator,
  FileText,
  Code,
  TrendingUp,
  LogOut,
  User,
  Settings,
  MessageSquare,
} from "lucide-react";
import LoadingAnimation from "./LoadingAnimation";
import { useAuth } from "@/contexts/auth-context";
import useStaticData from "@/hooks/useStaticData";
import { useTranslation } from "@/lib/i18n";
import { LanguageSelector } from "./language-selector";
import { AppSettings } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAboutMega, setShowAboutMega] = useState(false);
  const [showResourcesMega, setShowResourcesMega] = useState(false);
  const [showAboutMobile, setShowAboutMobile] = useState(false);
  const [showResourcesMobile, setShowResourcesMobile] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [getStartedLoading, setGetStartedLoading] = useState(false);
  const [location, setLocation] = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user, logout } = useAuth();

  const staticData = useStaticData();
  const { t } = useTranslation();

  const username = (user?.firstName || "") + " " + (user?.lastName || "");

  const logos = user?.avatar;

  const { data: brandSettings } = useQuery<AppSettings>({
    queryKey: ["/api/brand-settings"],
    queryFn: () => fetch("/api/brand-settings").then((res) => res.json()),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setShowAboutMobile(false);
    setShowResourcesMobile(false);
    closeMegaMenus();
  }, [location]);

  const handleLogin = () => {
    setLoginLoading(true);
    setTimeout(() => {
      setLoginLoading(false);
    }, 2000);
  };

  const handleGetStarted = () => {
    setGetStartedLoading(true);
    setTimeout(() => {
      setGetStartedLoading(false);
    }, 2000);
  };

  const closeMegaMenus = () => {
    setShowAboutMega(false);
    setShowResourcesMega(false);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isMenuOpen) {
      setShowAboutMobile(false);
      setShowResourcesMobile(false);
    }
  };

  const MegaMenu = ({
    items,
    isVisible,
  }: {
    items: typeof staticData.header.aboutMenuItems;
    isVisible: boolean;
    title: string;
  }) => (
    <div
      className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 transition-all duration-200 ease-out ${
        isVisible ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 invisible pointer-events-none"
      }`}
      style={{ minWidth: "220px" }}
    >
      <div
        className="rounded-2xl overflow-hidden shadow-2xl py-2"
        style={{ background: "#0d3b26", border: "1px solid rgba(37,211,102,0.2)" }}
      >
        {items.map((item, index) => (
          <Link
            key={`${item.title}-${index}`}
            href={item.path}
            className="flex items-center gap-3 px-5 py-3 transition-all duration-150 group"
            style={{}}
            onClick={closeMegaMenus}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(37,211,102,0.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(37,211,102,0.12)" }}>
              <item.icon className="w-4 h-4" style={{ color: "#25d366" }} />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{item.title}</div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{item.description}</div>
            </div>
          </Link>
        ))}
        <div className="mx-4 mt-1 mb-2 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <Link
            href="/signup"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{ background: "#25d366", color: "#fff" }}
            onClick={closeMegaMenus}
          >
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );



  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-out ${isScrolled
          ? "bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-lg shadow-black/[0.03] border-b border-gray-200/50 dark:border-gray-700/50"
          : "bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex justify-between items-center transition-all duration-500 ${isScrolled ? "h-16" : "h-[72px]"
              }`}
          >
            <Link href="/" className="flex items-center space-x-2.5 group">
              {brandSettings?.logo && brandSettings.logo.trim() !== "" ? (
                <img
                  src={brandSettings.logo}
                  alt="Waki by Aiclex"
                  className="h-10 object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <div className="flex items-center gap-2.5 transition-transform duration-300 group-hover:scale-105">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg" style={{ background: "linear-gradient(135deg, #128c7e 0%, #25d366 100%)" }}>
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="text-xl font-black tracking-tight" style={{ color: "#0d3b26" }}>Waki</span>
                    <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: "#128c7e" }}>by Aiclex</span>
                  </div>
                </div>
              )}
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href="/"
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${location === "/"
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/20"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
              >
                {t("Landing.header.Navlinks.0")}
              </Link>

              <div
                className="relative group"
                onMouseEnter={() => setShowAboutMega(true)}
                onMouseLeave={() => setShowAboutMega(false)}
              >
                <button
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer bg-transparent border-none ${showAboutMega
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/20"
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                  aria-haspopup="true"
                  aria-expanded={showAboutMega}
                  type="button"
                >
                  {t("Landing.header.Navlinks.1")}
                  <ChevronDown
                    className={`w-3.5 h-3.5 ml-1 transition-transform duration-300 ${showAboutMega ? "rotate-180" : ""
                      }`}
                  />
                </button>

                <div
                  className="absolute left-0 right-0 h-4 top-full"
                  style={{ top: "100%" }}
                />

                <MegaMenu
                  items={staticData.header.aboutMenuItems}
                  isVisible={showAboutMega}
                  title={t("Landing.header.megaMenuTitles.about")}
                />
              </div>

              <div
                className="relative group"
                onMouseEnter={() => setShowResourcesMega(true)}
                onMouseLeave={() => setShowResourcesMega(false)}
              >
                <button
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer bg-transparent border-none ${showResourcesMega
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/20"
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                  aria-haspopup="true"
                  aria-expanded={showResourcesMega}
                  type="button"
                >
                  {t("Landing.header.Navlinks.2")}
                  <ChevronDown
                    className={`w-3.5 h-3.5 ml-1 transition-transform duration-300 ${showResourcesMega ? "rotate-180" : ""
                      }`}
                  />
                </button>

                <div
                  className="absolute left-0 right-0 h-4 top-full"
                  style={{ top: "100%" }}
                />

                <MegaMenu
                  items={staticData.header.resourcesMenuItems}
                  isVisible={showResourcesMega}
                  title={t("Landing.header.megaMenuTitles.resources")}
                />
              </div>

              <div className="mx-1">
                <LanguageSelector />
              </div>

              {!isAuthenticated && (
                <div className="flex items-center gap-2 ml-2">
                  <a
                    href={typeof window !== "undefined" && (window.location.hostname === "waki.in" || window.location.hostname === "www.waki.in") ? "https://app.waki.in/login" : "/login"}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300"
                  >
                    {t("Landing.header.Navlinks.3")}
                  </a>
                  <a
                    href={typeof window !== "undefined" && (window.location.hostname === "waki.in" || window.location.hostname === "www.waki.in") ? "https://app.waki.in/signup" : "/signup"}
                    className="text-white px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.02] flex items-center group text-sm font-bold shadow-lg"
                    style={{ background: "linear-gradient(135deg, #128c7e, #25d366)", boxShadow: "0 4px 15px rgba(37,211,102,0.3)" }}
                  >
                    {t("Landing.header.getstart")}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </a>
                </div>
              )}

              {isAuthenticated && (
                <div className="flex items-center gap-3 ml-2">
                  <a
                    href={typeof window !== "undefined" && (window.location.hostname === "waki.in" || window.location.hostname === "www.waki.in") ? "https://app.waki.in/dashboard" : "/dashboard"}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300"
                  >
                    {t("Landing.header.dash")}
                  </a>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      className="w-10 h-10 rounded-xl overflow-hidden border-2 border-gray-200/80 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-md hover:shadow-blue-500/10 ring-0 hover:ring-2 hover:ring-blue-500/20"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          username
                        )}`}
                        alt={t("Landing.header.ariaLabels.userAvatar")}
                        className="w-full h-full object-cover"
                      />
                    </button>

                    <div
                      className={`absolute right-0 mt-2 w-56 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200/80 dark:border-gray-700/80 rounded-2xl shadow-xl shadow-black/[0.08] z-50 overflow-hidden transition-all duration-300 origin-top-right ${dropdownOpen
                        ? "opacity-100 scale-100 visible"
                        : "opacity-0 scale-95 invisible pointer-events-none"
                        }`}
                    >
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/80 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/10">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {username}
                        </p>
                      </div>

                      <div className="p-1.5">
                        <button
                          className="flex items-center w-full px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all duration-200"
                          onClick={() => {
                            setLocation("/settings");
                            setDropdownOpen(false);
                          }}
                        >
                          <Settings className="w-4 h-4 mr-2.5 opacity-70" />
                          {t("Landing.header.Settings")}
                        </button>
                        <button
                          className="flex items-center w-full px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all duration-200"
                          onClick={() => {
                            setLocation("/account");
                            setDropdownOpen(false);
                          }}
                        >
                          <User className="w-4 h-4 mr-2.5 opacity-70" />
                          {t("Landing.header.Account")}
                        </button>
                        <div className="my-1 border-t border-gray-100 dark:border-gray-700/50"></div>
                        <button
                          className="flex items-center w-full px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/15 rounded-xl transition-all duration-200"
                          onClick={() => {
                            logout();
                            setDropdownOpen(false);
                          }}
                        >
                          <LogOut className="w-4 h-4 mr-2.5 opacity-70" />
                          {t("Landing.header.logout")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </nav>

            <button
              className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-300"
              onClick={handleMenuToggle}
              aria-label={t("Landing.header.ariaLabels.toggleMenu")}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`lg:hidden fixed inset-0 z-30 transition-all duration-500 ${isMenuOpen
          ? "visible"
          : "invisible pointer-events-none"
          }`}
      >
        <div
          className={`absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? "opacity-100" : "opacity-0"
            }`}
          onClick={() => setIsMenuOpen(false)}
        />

        <div
          className={`absolute top-0 right-0 w-full max-w-sm h-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-l border-gray-200/50 dark:border-gray-700/50 shadow-2xl transition-transform duration-500 ease-out overflow-y-auto ${isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          style={{ paddingTop: isScrolled ? "64px" : "72px" }}
        >
          <div className="px-5 py-6 space-y-1">
            <Link
              href="/"
              className={`block px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${location === "/"
                ? "text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/20"
                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {t("Landing.header.Navlinks.0")}
            </Link>

            <div>
              <button
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-gray-900 dark:text-white font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300"
                onClick={() => setShowAboutMobile(!showAboutMobile)}
                aria-expanded={showAboutMobile}
              >
                <span>{t("Landing.header.Navlinks.1")}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${showAboutMobile ? "rotate-180" : ""
                    }`}
                />
              </button>

              <div
                className={`grid overflow-hidden transition-all duration-400 ease-in-out ${showAboutMobile
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
                  }`}
              >
                <div className="overflow-hidden">
                  <div className="space-y-0.5 pl-4 pr-2 pb-2">
                    {staticData.header.aboutMenuItems.map((item, index) => (
                      <Link
                        key={`mobile-about-${index}`}
                        href={item.path}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/60 dark:hover:bg-blue-900/15 font-medium text-sm transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-4 h-4 text-blue-600" />
                        </div>
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-gray-900 dark:text-white font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300"
                onClick={() => setShowResourcesMobile(!showResourcesMobile)}
                aria-expanded={showResourcesMobile}
              >
                <span>{t("Landing.header.Navlinks.2")}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${showResourcesMobile ? "rotate-180" : ""
                    }`}
                />
              </button>

              <div
                className={`grid overflow-hidden transition-all duration-400 ease-in-out ${showResourcesMobile
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
                  }`}
              >
                <div className="overflow-hidden">
                  <div className="space-y-0.5 pl-4 pr-2 pb-2">
                    {staticData.header.resourcesMenuItems.map((item, index) => (
                      <Link
                        key={`mobile-resources-${index}`}
                        href={item.path}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/60 dark:hover:bg-blue-900/15 font-medium text-sm transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-4 h-4 text-blue-600" />
                        </div>
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
              <div className="px-4 py-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("Landing.header.Language") || "Language"}
                </span>
                <LanguageSelector />
              </div>
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/login"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogin();
                    }}
                    className="block w-full text-center px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 font-medium text-sm transition-all duration-300"
                  >
                    {loginLoading ? (
                      <LoadingAnimation size="sm" color="green" />
                    ) : (
                      t("Landing.header.Navlinks.3")
                    )}
                  </Link>

                  <Link
                    href="/signup"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleGetStarted();
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium flex items-center justify-center text-sm shadow-lg shadow-blue-500/20"
                  >
                    {getStartedLoading ? (
                      <LoadingAnimation size="sm" color="white" />
                    ) : (
                      <>
                        {t("Landing.header.getstart")}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 font-medium text-sm transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("Landing.header.dash")}
                  </Link>

                  <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-2">
                    <div className="flex items-center gap-3 px-4 mb-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-blue-200/50 dark:border-blue-800/50 shadow-sm">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            username
                          )}`}
                          alt={t("Landing.header.ariaLabels.userAvatar")}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white font-semibold">
                        {username}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <button
                        className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all duration-200"
                        onClick={() => {
                          setLocation("/settings");
                          setIsMenuOpen(false);
                        }}
                      >
                        <Settings className="w-4 h-4 mr-2.5 opacity-70" />
                        {t("Landing.header.Settings")}
                      </button>
                      <button
                        className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all duration-200"
                        onClick={() => {
                          setLocation("/account");
                          setIsMenuOpen(false);
                        }}
                      >
                        <User className="w-4 h-4 mr-2.5 opacity-70" />
                        {t("Landing.header.Account")}
                      </button>
                      <button
                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/15 rounded-xl transition-all duration-200"
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2.5 opacity-70" />
                        {t("Landing.header.logout")}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {(showAboutMega || showResourcesMega) && (
        <div
          className="fixed inset-0 bg-black/5 dark:bg-black/20 backdrop-blur-[2px] z-30 transition-opacity duration-300"
          onClick={closeMegaMenus}
        />
      )}
    </>
  );
};

export default Header;
