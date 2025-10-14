import React from "react";

const HowItWorks = () => {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple 3-Step Process
          </h2>
          <p className="text-xl text-muted-foreground">
            From SFG20 to Simpro in just a few clicks
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">Import from SFG20</h3>
            <p className="text-muted-foreground">
              Connect your SFG20 API key and import all available maintenance
              schedules with real-time progress tracking.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">Select Your Data</h3>
            <p className="text-muted-foreground">
              Use our advanced filtering and selection interface to choose
              exactly which schedules and tasks you need.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">Export to Simpro</h3>
            <p className="text-muted-foreground">
              Generate Simpro-compatible files with detailed previews and export
              your selected maintenance data instantly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
