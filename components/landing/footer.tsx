import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="border-t bg-card py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            {/* <Image
              src="/ignite-logo.png"
              alt="Ignite Consultancy Services"
              width={150}
              height={50}
              className="h-[50px] w-auto"
            /> */}
            <Image
              src="/ignite-logo2.png"
              alt="Ignite Consultancy Services"
              width={200}
              height={80}
              className="h-[60px] w-auto"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 Ignite Technology. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
