import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  ChartLineIcon,
  CircleUserIcon,
  LayoutDashboardIcon,
  Package2Icon,
  SettingsIcon,
  TruckElectricIcon,
  UsersRoundIcon,
  ChefHat,
  ClipboardList,
} from "lucide-react";

export default function Navbar() {
  return (
    <div className="grid h-full w-full grid-flow-row grid-rows-4 align-center">
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
                <Link
                  href="/"
                  className="flex items-center rounded-lg p-2 text-base font-medium text-gray-900 hover:bg-gray-100"
                >
                  <LayoutDashboardIcon className="mr-3 h-5 w-5 text-gray-500" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/menus"
                  className="flex items-center rounded-lg p-2 text-base font-medium text-gray-900 hover:bg-gray-100"
                >
                  <ChefHat className="mr-3 h-5 w-5 text-gray-500" />
                  Menus
                </Link>
              </li>
              <li>
                <Link
                  href="/inventory"
                  className="flex items-center rounded-lg p-2 text-base font-medium text-gray-900 hover:bg-gray-100"
                >
                  <Package2Icon className="mr-3 h-5 w-5 text-gray-500" />
                  Product Inventory
                </Link>
              </li>
              <li>
                <Link
                  href="/haccp"
                  className="flex items-center rounded-lg p-2 text-base font-medium text-gray-900 hover:bg-gray-100"
                >
                  <ClipboardList className="mr-3 h-5 w-5 text-gray-500" />
                  HACCP
                </Link>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-100">
                  <TruckElectricIcon className="w-5 h-5 mr-3 text-gray-500" />
                  Orders
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-100">
                  <ChartLineIcon className="w-5 h-5 mr-3 text-gray-500" />
                  Reports & Insights
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-100">
                  <UsersRoundIcon className="w-5 h-5 mr-3 text-gray-500" />
                  User Management
                </a>
              </li>
            </ul>
          </nav>
        </div> 
      </div>
      <div className="row-span-1 grid grid-rows-4">
        <div className=" row-span-3 px-2 items-center flex flex-col align-center justify-center">
          <Button variant="tertiary" className="w-3/4 mb-4"> <CircleUserIcon size={16} />My Profile</Button>
          <Button variant="tertiary" className="w-3/4"> <SettingsIcon size={16} />Settings</Button>
        </div>
        <div className="row-span-1 px-4 flex items-center justify-center">
          Apptit - 2023
        </div>
      </div>
    </div>
  );
}
