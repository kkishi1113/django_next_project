"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const Sidebar = ({ apps, handleSelectApp }) => {

  const menuList = [
    // { name: 'Dashboard', content: <Link href="/dashboard"><span className="block py-2 px-4 text-sm">ダッシュボード</span></Link>},
    { name: 'Profile', content: <Link href="/profile"><span className="block py-2 px-4 text-sm">プロフィール</span></Link>},
    { name: 'Settings', content: <Link href="/settings"><span className="block py-2 px-4 text-sm">設定</span></Link>},
    ...apps,
  ]

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <FontAwesomeIcon icon={faBars} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <ul className="relative">
          { menuList.map((menu, index) => (
            <li key={index} className="relative">
              <SheetClose asChild>
                <Link href="#" onClick={()=>handleSelectApp(menu)} className="block py-2 px-4 text-sm hover:bg-gray-300" >
                  {menu.name}
                </Link>
              </SheetClose>
            </li>
          ))}
        </ul>
        <SheetFooter>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
