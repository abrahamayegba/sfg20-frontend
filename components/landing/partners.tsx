import React from "react";

const Partners = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powered by Industry Leaders
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Seamlessly integrating with the tools you already trust
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
          <a
            href="https://www.sfg20.co.uk/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-4 group"
          >
            <div className="bg-white border-2 rounded-xl p-12 group-hover:border-blue-200 transition-all group-hover:shadow-lg group-hover:scale-105 w-80 h-52 flex items-center justify-center">
              <img
                src="sfg-logo.png"
                alt="SFG20"
                className="h-20 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              SFG20 Maintenance Schedules
            </p>
          </a>

          <a
            href="https://www.facilities-iq.com/app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-4 group"
          >
            <div className="bg-white border-2 rounded-xl p-12 group-hover:border-blue-200 transition-all group-hover:shadow-lg group-hover:scale-105 w-80 h-52 flex items-center justify-center">
              <img
                src="fiq-logo.png"
                alt="Facilities-iQ"
                className="h-36 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              Facilities-iQ Platform
            </p>
          </a>

          <a
            href="https://www.simprogroup.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-4 group"
          >
            <div className="bg-white border-2 rounded-xl p-12 group-hover:border-blue-200 transition-all group-hover:shadow-lg group-hover:scale-105 w-80 h-52 flex items-center justify-center">
              <img
                src="simpro-logo.png"
                alt="Simpro"
                className="h-32 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              Simpro Management Software
            </p>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Partners;
