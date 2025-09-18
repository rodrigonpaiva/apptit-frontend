import Image from "next/image";
import { Button } from "../ui/button";
import { ChartLineIcon, CircleUserIcon, LayoutDashboardIcon, Package2Icon, SettingsIcon, TruckElectricIcon, UsersRoundIcon } from "lucide-react";

export default function Navbar() {
  return (
    <div className="grid grid-flow-row grid-rows-4 w-full align-center h-screen">
      <div className="row-span-3 grid grid-flow-row-dense pl-4 grid-rows-8">
        <div className="row-span-1">
          <Image 
            src="/images/apptit-logo.svg" 
            alt="Apptit Logo" 
            width={74}
            height={74}
            className="my-4 mx-4"
          />
        </div>
        <div className="row-span-7 px-4 mb-4 mt-2">
          <nav>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-100">
                  <LayoutDashboardIcon className="w-5 h-5 mr-3 text-gray-500" />
                  Menus
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-100">
                  <Package2Icon className="w-5 h-5 mr-3 text-gray-500" />
                  Gestions Produits
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-100">
                  <TruckElectricIcon className="w-5 h-5 mr-3 text-gray-500" />
                  Commandes
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-100">
                  <ChartLineIcon className="w-5 h-5 mr-3 text-gray-500" />
                  Rapports & Analyses
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-100">
                  <UsersRoundIcon className="w-5 h-5 mr-3 text-gray-500" />
                  Gestion Utilisateurs
                </a>
              </li>
            </ul>
          </nav>
        </div> 
      </div>
      <div className="row-span-1 grid grid-rows-4">
        <div className=" row-span-3 px-2 items-center flex flex-col align-center justify-center">
          <Button variant="tertiary" className="w-3/4 mb-4"> <CircleUserIcon size={16} />Mon profil</Button>
          <Button variant="tertiary" className="w-3/4"> <SettingsIcon size={16} />Paramètres</Button>
        </div>
        <div className="row-span-1 px-4 flex items-center justify-center">
          Apptit - 2023
        </div>
      </div>
    </div>
  );
}
