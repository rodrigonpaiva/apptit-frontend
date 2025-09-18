import React from "react";
import Navbar from "@/src/components/dashboard/navbar";

export default function Menus() {
  return (
        
    <div className="grid grid-flow-col grid-rows-1 grid-cols-12 gap-4 h-screen bg-white">
      <div className="grid col-span-2 ">
        <Navbar />
      </div>

      <div className="col-span-10 grid grid-rows-8 gap-4 w-full">
        <div className="row-span-1 grid grid-cols-8 gap-4 bg-amber-500">
          <div className="col-span-7 bg-pink-500">
            Rodrigo
          </div>
          <div className="col-span-1 bg-purple-500">
            Header
          </div>
        </div>
        <div className="row-span-7 p-4 bg-red-500">
          <h1 className="text-3xl font-bold mb-4">Menus</h1>
          <div className="w-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Aucun menu disponible.</p>
          </div>
        </div>
      </div>
    </div>
    
  );
}