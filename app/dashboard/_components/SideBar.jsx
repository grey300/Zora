"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  BrainCircuit,
  Bookmark,
  History,
  PlusCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
} from "lucide-react";

const SECTIONS = [
  {
    label: "Learn",
    items: [
      { name: "Home", icon: Home, path: "/dashboard" },
      { name: "Explore", icon: Compass, path: "/dashboard/explore" },
    ],
  },
  {
    label: "Quiz",
    items: [
      {
        name: "Quiz Hub",
        icon: BrainCircuit,
        path: "/dashboard/quiz",
        // Rendered nested underneath Quiz Hub
        children: [
          { name: "Saved Quizzes", icon: Bookmark, path: "/saved-quizzes" },
          { name: "History", icon: History, path: "/history" },
        ],
      },
    ],
  },
  {
    label: "Account",
    items: [{ name: "Settings", icon: Settings, path: "/dashboard/settings" }],
  },
];

function SideBar({ collapsed: controlledCollapsed, setCollapsed: controlledSet }) {
  // Works controlled (dashboard layout) or standalone (history / saved-quizzes).
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = controlledCollapsed ?? internalCollapsed;
  const setCollapsed = controlledSet ?? setInternalCollapsed;

  const path = usePathname();

  const isActive = (target) =>
    target === "/dashboard" ? path === "/dashboard" : path.startsWith(target);

  return (
    <div
      className={`fixed z-40 h-full ${
        collapsed ? "w-20" : "w-64"
      } flex flex-col border-r border-gray-200 bg-white p-4 transition-all duration-300 dark:border-gray-800 dark:bg-[#0B0E14]`}
    >
      {/* Logo + collapse toggle */}
      <div className="mb-6 flex items-center justify-between">
        {!collapsed && (
          <Link href="/dashboard">
            <Image
              src="/Zora.png"
              width={100}
              height={80}
              alt="Zora"
              className="ml-2 block dark:hidden"
              priority
            />
            <Image
              src="/ZoraW.png"
              width={100}
              height={80}
              alt="Zora"
              className="ml-2 hidden dark:block"
              priority
            />
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          title="Toggle sidebar"
        >
          {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>

      {/* Create course CTA */}
      <Link
        href="/create-course"
        className={`mb-6 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 ${
          collapsed ? "px-0" : "px-4"
        }`}
      >
        <PlusCircle size={18} />
        {!collapsed && <span>Create Course</span>}
      </Link>

      {/* Nav sections */}
      <nav className="flex-1 space-y-6 overflow-y-auto">
        {SECTIONS.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                {section.label}
              </p>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.path);
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      title={collapsed ? item.name : undefined}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                        active
                          ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/70 dark:hover:text-white"
                      } ${collapsed ? "justify-center px-0" : ""}`}
                    >
                      <Icon size={19} />
                      {!collapsed && <span>{item.name}</span>}
                    </Link>

                    {/* Nested children (e.g. Saved / History under Quiz Hub) */}
                    {item.children && !collapsed && (
                      <ul className="ml-5 mt-1 space-y-1 border-l border-gray-200 pl-3 dark:border-gray-800">
                        {item.children.map((child) => {
                          const childActive = isActive(child.path);
                          const ChildIcon = child.icon;
                          return (
                            <li key={child.path}>
                              <Link
                                href={child.path}
                                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition ${
                                  childActive
                                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300"
                                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-500 dark:hover:bg-gray-800/70 dark:hover:text-white"
                                }`}
                              >
                                <ChildIcon size={16} />
                                <span>{child.name}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                    {/* Collapsed mode: children as icon-only entries */}
                    {item.children && collapsed && (
                      <ul className="mt-1 space-y-1">
                        {item.children.map((child) => {
                          const childActive = isActive(child.path);
                          const ChildIcon = child.icon;
                          return (
                            <li key={child.path}>
                              <Link
                                href={child.path}
                                title={child.name}
                                className={`flex items-center justify-center rounded-lg py-2 transition ${
                                  childActive
                                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300"
                                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800/70"
                                }`}
                              >
                                <ChildIcon size={16} />
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}

export default SideBar;
