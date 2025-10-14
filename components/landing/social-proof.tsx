import { Users, Building, Clock } from "lucide-react";
import React from "react";

const SocialProof = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">
          Trusted by Facility Management Professionals
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="flex flex-col items-center">
            <Users className="h-12 w-12 text-accent mb-4" />
            <h3 className="text-2xl font-bold mb-2">500+</h3>
            <p className="text-muted-foreground">Facility Managers</p>
          </div>
          <div className="flex flex-col items-center">
            <Building className="h-12 w-12 text-accent mb-4" />
            <h3 className="text-2xl font-bold mb-2">1000+</h3>
            <p className="text-muted-foreground">Properties Managed</p>
          </div>
          <div className="flex flex-col items-center">
            <Clock className="h-12 w-12 text-accent mb-4" />
            <h3 className="text-2xl font-bold mb-2">80%</h3>
            <p className="text-muted-foreground">Time Saved</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
