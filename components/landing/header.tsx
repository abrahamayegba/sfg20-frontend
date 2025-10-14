import React from 'react'
import Link from "next/link";
import Image from "next/image";
import { Button } from '../ui/button';

const Header = () => {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between ">
        <div className="flex items-center gap-3">
          <Image
            src="/ignite-logo.png"
            alt="Ignite Consultancy Services"
            width={180}
            height={60}
            className="h-[50px] w-auto"
          />
        </div>
        <Link href="/?app=true">
          <Button variant="outline">Sign In</Button>
        </Link>
      </div>
    </header>
  );
}

export default Header
