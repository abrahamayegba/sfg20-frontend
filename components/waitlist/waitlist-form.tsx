"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Mail, User, Building, Briefcase } from "lucide-react";
import { type WaitlistEntry } from "@/lib/waitlist";
import emailjs from "emailjs-com";

interface WaitlistFormProps {
  source: "landing" | "app";
  onSuccess?: (entry: WaitlistEntry) => void;
  className?: string;
}

export function WaitlistForm({
  source,
  className,
}: WaitlistFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    company: "",
    role: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const templateID = "template_gmpyw5n";
  const serviceID = "service_ep9svhj";
  const publicKey = "O7WBRFKcsmTjhhQDl";

  // use email js to send the data as emails to me later
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await emailjs.send(
        serviceID,
        templateID,
        {
          email: formData.email,
          name: formData.name,
          company: formData.company,
          role: formData.role,
          source,
        },
        publicKey
      );

      setIsSuccess(true);
      setFormData({ email: "", name: "", company: "", role: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join waitlist");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">You're on the list!</h3>
          <p className="text-sm text-muted-foreground">
            We'll notify you when SFG20 Data Manager is ready for early access.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Join the Waitlist
        </CardTitle>
        <CardDescription>
          Be the first to know when SFG20 Data Manager launches
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="pl-10"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="John Smith"
                className="pl-10"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <div className="relative">
              <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="company"
                placeholder="Your Company"
                className="pl-10"
                value={formData.company}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, company: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, role: value }))
              }
            >
              <SelectTrigger className=" w-full border border-gray-200">
                <Briefcase className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="facility-manager">
                  Facility Manager
                </SelectItem>
                <SelectItem value="maintenance-manager">
                  Maintenance Manager
                </SelectItem>
                <SelectItem value="operations-manager">
                  Operations Manager
                </SelectItem>
                <SelectItem value="contractor">Contractor</SelectItem>
                <SelectItem value="consultant">Consultant</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Joining..." : "Join Waitlist"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
