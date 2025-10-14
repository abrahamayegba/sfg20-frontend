import React, { forwardRef } from "react";
import { WaitlistForm } from "../waitlist/waitlist-form";
import { CheckCircle } from "lucide-react";

const WaitlistCta = forwardRef<HTMLDivElement>((_props, ref) => {
  return (
    <section ref={ref} id="waitlist" className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your Workflow?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join hundreds of facility managers who are already signed up for
                early access to SFG20 Integrator.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Early access to all features</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Priority customer support</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Special launch pricing</span>
                </div>
              </div>
            </div>

            <WaitlistForm source="landing" className="w-full" />
          </div>
        </div>
      </div>
    </section>
  );
});

WaitlistCta.displayName = "WaitlistCta";

export default WaitlistCta;
