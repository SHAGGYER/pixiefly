import React, { useContext } from "react";
import AppContext from "../../Contexts/AppContext";
import Logo from "../../Images/logo.svg";
import SidebarLink from "./SidebarLink";
import SidebarSubmenu from "./SidebarSubmenu";

export default function () {
  const { logout, user } = useContext(AppContext);

  const resourcesItems = [
    {
      title: "Steder",
      to: "/places",
    },
    {
      title: "Produkter",
      to: "/items",
    },
    {
      title: "Kunder",
      to: "/customers",
    },
    {
      title: "Leverandører",
      to: "/suppliers",
    },
  ];

  const invoicesItems = [
    {
      title: "Gennemse Fakturer",
      to: "/invoices",
    },
    {
      title: "Opret Salgsfaktura",
      to: "/invoices/create",
    },
    {
      title: "Opret Købsfaktura",
      to: "/invoices/create-buy",
    },
  ];

  return (
    <div className="fixed left-0 top-0 w-64 h-full bg-gray-600 flex flex-col">
      <div className="flex justify-center p-4">
        <img src={Logo} className="h-24" />
      </div>
      <div className="flex justify-center mb-12 text-white">
        <p>{user.displayName}</p>
      </div>
      <article className="flex-grow h-0 overflow-y-auto px-4">
        <SidebarLink
          to="/"
          title="Dashboard"
          icon={<i className="fas fa-tachometer-alt"></i>}
        />
        <SidebarSubmenu
          title="Ressourser"
          icon={<i className="fas fa-th-large"></i>}
          items={resourcesItems}
        />
        <SidebarSubmenu
          title="Fakturer"
          icon={<i className="fas fa-paperclip"></i>}
          items={invoicesItems}
        />
        <SidebarLink
          to="/inventory"
          title="Lager"
          icon={<i className="fas fa-archive"></i>}
        />
        <SidebarLink
          to="/statistics"
          title="Statistikker"
          icon={<i className="fas fa-chart-bar"></i>}
        />
        {/* <SidebarLink
          icon={<i className="fas fa-money-bill-wave-alt"></i>}
          to="/billing"
          title="Betalinger"
        /> */}
      </article>
      <button
        onClick={logout}
        className="bg-purple-600 text-white py-4 hover:bg-pink-700"
      >
        Logout
      </button>
    </div>
  );
}
