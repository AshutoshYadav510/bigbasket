import { Outlet } from "react-router";
import { AppProvider } from "../context/AppContext";
import { NavBar } from "./NavBar";
import { BottomNav } from "./BottomNav";
import { Toaster } from "./ui/sonner";

export function RootLayout() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#f8fafc] dark:bg-gray-950 text-gray-900 dark:text-gray-50 flex flex-col relative overflow-hidden">
        {/* Global Beautiful 3D Background & Blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          {/* Super Premium 3D Grocery Art */}
          <div className="absolute inset-0 opacity-[0.15] dark:opacity-[0.1] blur-[2px] scale-105">
            <img src="/images/beautiful_bg.png" alt="" className="w-full h-full object-cover" />
          </div>
          
          {/* Soft Dreamy Blobs */}
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-green-200/40 to-emerald-200/40 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-15%] w-[70%] h-[70%] rounded-full bg-gradient-to-tr from-sky-100/50 to-blue-200/40 blur-[150px]" />
          <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-gradient-to-bl from-pink-100/30 to-rose-200/20 blur-[100px]" />
          
          {/* Subtle Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        </div>

        <NavBar />
        <main className="flex-1 relative z-10">
          <Outlet />
        </main>
        <BottomNav />
        <Toaster />
      </div>
    </AppProvider>
  );
}





