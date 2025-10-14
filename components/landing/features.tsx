import React from 'react'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, DatabaseZap, Download, Filter, Shield, Zap } from 'lucide-react';

const Features = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need for Efficient Data Integration
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform bridges the gap between SFG20 and Simpro with powerful
            selection tools and seamless integration.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-2 hover:border-accent/50 transition-colors">
            <CardHeader>
              <DatabaseZap className="h-10 w-10 text-accent mb-4" />
              <CardTitle>Smart Data Import</CardTitle>
              <CardDescription>
                Connect your SFG20 API and import maintenance schedules with
                animated progress tracking
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-accent/50 transition-colors">
            <CardHeader>
              <Filter className="h-10 w-10 text-accent mb-4" />
              <CardTitle>Advanced Selection</CardTitle>
              <CardDescription>
                Filter, search, and select exactly the maintenance tasks you
                need with our intuitive interface
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-accent/50 transition-colors">
            <CardHeader>
              <Download className="h-10 w-10 text-accent mb-4" />
              <CardTitle>Seamless Export</CardTitle>
              <CardDescription>
                Export selected data in Simpro-compatible format with detailed
                preview and validation
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-accent/50 transition-colors">
            <CardHeader>
              <Shield className="h-10 w-10 text-accent mb-4" />
              <CardTitle>Secure & Reliable</CardTitle>
              <CardDescription>
                Enterprise-grade security with API key authentication and
                encrypted data handling
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-accent/50 transition-colors">
            <CardHeader>
              <Clock className="h-10 w-10 text-accent mb-4" />
              <CardTitle>Save Time</CardTitle>
              <CardDescription>
                Reduce manual data entry from hours to minutes with automated
                import and export processes
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-accent/50 transition-colors">
            <CardHeader>
              <Zap className="h-10 w-10 text-accent mb-4" />
              <CardTitle>Real-time Updates</CardTitle>
              <CardDescription>
                Get notified when SFG20 schedules are updated and sync changes
                automatically
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default Features
