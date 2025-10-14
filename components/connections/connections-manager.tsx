"use client";

import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  Database,
  Building,
  CheckCircle,
  AlertCircle,
  Webhook,
  Clock,
  Zap,
  Loader2,
} from "lucide-react";

interface ConnectionsManagerProps {
  onBack: () => void;
}

export function ConnectionsManager({ onBack }: ConnectionsManagerProps) {
  const [sfg20Connected, setSfg20Connected] = useState(false);
  const [simproConnected, setSimproConnected] = useState(false);
  const [webhooksEnabled, setWebhooksEnabled] = useState(false);
  const [rateLimitEnabled, setRateLimitEnabled] = useState(true);
  const [monthlyImports, setMonthlyImports] = useState(3);
  const [maxImportsPerMonth] = useState(6);

  const [isConnecting, setIsConnecting] = useState<"sfg20" | "simpro" | null>(
    null
  );
  const [isTesting, setIsTesting] = useState<"sfg20" | "simpro" | null>(null);
  const [testResult, setTestResult] = useState<{
    type: "sfg20" | "simpro";
    success: boolean;
  } | null>(null);

  const [sfg20Config, setSfg20Config] = useState({
    shareLink: "",
  });

  const [simproConfig, setSimproConfig] = useState({
    accessToken: "",
    baseUrl: "",
    companyId: "",
  });

  const [webhookConfig, setWebhookConfig] = useState({
    url: "",
    secret: "",
    events: ["regime_updated", "schedule_changed"],
  });

  useEffect(() => {
    // Load saved configurations
    const savedSfg20 = localStorage.getItem("sfg20_config");
    const savedSimpro = localStorage.getItem("simpro_config");
    const savedWebhook = localStorage.getItem("webhook_config");

    if (savedSfg20) {
      const config = JSON.parse(savedSfg20);
      setSfg20Config(config);
      setSfg20Connected(!!config.shareLink);
    }

    if (savedSimpro) {
      const config = JSON.parse(savedSimpro);
      setSimproConfig(config);
      setSimproConnected(!!config.accessToken);
    }

    if (savedWebhook) {
      const config = JSON.parse(savedWebhook);
      setWebhookConfig(config);
      setWebhooksEnabled(!!config.url);
    }
  }, []);

  const populateSfg20Demo = () => {
    setSfg20Config({
      shareLink: "demo_sharelink_abc123",
    });
  };

  const populateSimproDemo = () => {
    setSimproConfig({
      accessToken: "simpro_demo_token_def456uvw012",
      baseUrl: "https://demo-company.simpro.com",
      companyId: "DEMO_COMPANY_001",
    });
  };

  const populateWebhookDemo = () => {
    setWebhookConfig({
      url: "https://your-app.com/webhooks/sfg20",
      secret: "webhook_secret_demo_789xyz",
      events: ["regime_updated", "schedule_changed"],
    });
  };

  const handleSfg20Connect = async () => {
    if (sfg20Config.shareLink) {
      setIsConnecting("sfg20");

      // Simulate connection process
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Save share link in localStorage
      localStorage.setItem("sfg20_config", JSON.stringify(sfg20Config));
      setSfg20Connected(true);
      setIsConnecting(null);
    }
  };

  const handleSimproConnect = async () => {
    if (simproConfig.accessToken && simproConfig.baseUrl) {
      setIsConnecting("simpro");

      // Simulate connection process
      await new Promise((resolve) => setTimeout(resolve, 1500));

      localStorage.setItem("simpro_config", JSON.stringify(simproConfig));
      setSimproConnected(true);
      setIsConnecting(null);
    }
  };

  const handleTestConnection = async (type: "sfg20" | "simpro") => {
    setIsTesting(type);
    setTestResult(null);

    // Simulate test process
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // 90% success rate for demo
    const success = Math.random() > 0.1;
    setTestResult({ type, success });
    setIsTesting(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Connections</h1>
            <p className="text-sm text-muted-foreground">
              Manage your SFG20 and Simpro integrations
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* SFG20 Connection */}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-500" />
              SFG20 Connection
              {sfg20Connected ? (
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Disconnected
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Connect to your SFG20 Facilities-iQ account to import maintenance
              regimes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="sfg20-sharelink">Share Link ID</Label>
                <Button variant="outline" size="sm" onClick={populateSfg20Demo}>
                  Demo Data
                </Button>
              </div>
              <Input
                id="sfg20-sharelink"
                type="text"
                placeholder="Enter SFG20 share link ID"
                value={sfg20Config.shareLink}
                onChange={(e) =>
                  setSfg20Config((prev) => ({
                    ...prev,
                    shareLink: e.target.value,
                  }))
                }
                disabled={sfg20Connected}
              />
              <p className="text-xs text-muted-foreground">
                Obtain this from your Facilities-iQ regime share link
              </p>
            </div>

            <div className="flex gap-2">
              {sfg20Connected ? (
                <Button
                  variant="destructive"
                  onClick={() => {
                    localStorage.removeItem("sfg20_config");
                    setSfg20Config({ shareLink: "" });
                    setSfg20Connected(false);
                  }}
                >
                  Disconnect SFG20
                </Button>
              ) : (
                <Button
                  onClick={handleSfg20Connect}
                  disabled={!sfg20Config.shareLink || isConnecting === "sfg20"}
                >
                  {isConnecting === "sfg20" ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Connect to SFG20"
                  )}
                </Button>
              )}
              <Button
                variant="outline"
                disabled={!sfg20Connected || isTesting === "sfg20"}
                onClick={() => handleTestConnection("sfg20")}
              >
                {isTesting === "sfg20" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  "Test Connection"
                )}
              </Button>
            </div>

            {testResult?.type === "sfg20" && (
              <div
                className={`p-3 rounded-lg ${
                  testResult.success
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  {testResult.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      testResult.success ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {testResult.success
                      ? "Connection successful!"
                      : "Connection failed. Please check the share link ID."}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Simpro Connection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-green-500" />
              Simpro Connection
              {simproConnected ? (
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Disconnected
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Connect to your Simpro system to export maintenance data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Connection Details</span>
              <Button variant="outline" size="sm" onClick={populateSimproDemo}>
                Demo Data
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="simpro-api-key">Access token</Label>
                <Input
                  id="simpro-api-key"
                  type="password"
                  placeholder="Enter your Simpro Access Token"
                  value={simproConfig.accessToken}
                  onChange={(e) =>
                    setSimproConfig((prev) => ({
                      ...prev,
                      apiKey: e.target.value,
                    }))
                  }
                  disabled={simproConnected}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="simpro-url">Company URL</Label>
                <Input
                  id="simpro-url"
                  placeholder="https://your-company.simpro.com"
                  value={simproConfig.baseUrl}
                  onChange={(e) =>
                    setSimproConfig((prev) => ({
                      ...prev,
                      baseUrl: e.target.value,
                    }))
                  }
                  disabled={simproConnected}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="simpro-company">Company ID (Optional)</Label>
              <Input
                id="simpro-company"
                placeholder="Your company identifier"
                value={simproConfig.companyId}
                onChange={(e) =>
                  setSimproConfig((prev) => ({
                    ...prev,
                    companyId: e.target.value,
                  }))
                }
                disabled={simproConnected}
              />
            </div>

            <div className="flex gap-2">
              {simproConnected ? (
                <Button
                  variant="destructive"
                  onClick={() => {
                    localStorage.removeItem("simpro_config");
                    setSimproConfig({ accessToken: "", baseUrl: "", companyId: "" });
                    setSimproConnected(false);
                  }}
                >
                  Disconnect Simpro
                </Button>
              ) : (
                <Button
                  onClick={handleSimproConnect}
                  disabled={
                    !simproConfig.accessToken ||
                    !simproConfig.baseUrl ||
                    isConnecting === "simpro"
                  }
                >
                  {isConnecting === "simpro" ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Connect to Simpro"
                  )}
                </Button>
              )}
              <Button
                variant="outline"
                disabled={!simproConnected || isTesting === "simpro"}
                onClick={() => handleTestConnection("simpro")}
              >
                {isTesting === "simpro" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  "Test Connection"
                )}
              </Button>
            </div>

            {testResult?.type === "simpro" && (
              <div
                className={`p-3 rounded-lg ${
                  testResult.success
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  {testResult.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      testResult.success ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {testResult.success
                      ? "Connection successful!"
                      : "Connection failed. Please check your credentials."}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Webhook Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="h-5 w-5 text-purple-500" />
              Webhook Configuration
              {webhooksEnabled ? (
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Enabled
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Disabled
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Configure webhooks to receive real-time updates from SFG20
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Webhook Settings</span>
              <Button variant="outline" size="sm" onClick={populateWebhookDemo}>
                Demo Data
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input
                id="webhook-url"
                placeholder="https://your-app.com/webhooks/sfg20"
                value={webhookConfig.url}
                disabled
                onChange={(e) =>
                  setWebhookConfig((prev) => ({ ...prev, url: e.target.value }))
                }
              />
              <p className="text-xs text-muted-foreground">
                This URL will receive notifications when your SFG20 regimes are
                updated
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhook-secret">Webhook Secret</Label>
              <Input
                id="webhook-secret"
                type="password"
                placeholder="Enter a secret for webhook verification"
                value={webhookConfig.secret}
                disabled
                onChange={(e) =>
                  setWebhookConfig((prev) => ({
                    ...prev,
                    secret: e.target.value,
                  }))
                }
              />
            </div>

            <Button
              onClick={() => {
                localStorage.setItem(
                  "webhook_config",
                  JSON.stringify(webhookConfig)
                );
                setWebhooksEnabled(!!webhookConfig.url);
              }}
            >
              Save Webhook Configuration
            </Button>
          </CardContent>
        </Card>

        {/* Rate Limiting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Rate Limiting
            </CardTitle>
            <CardDescription>
              Manage import frequency and usage limits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Enable Rate Limiting</Label>
                <p className="text-sm text-muted-foreground">
                  Limit the number of imports per month to prevent API overuse
                </p>
              </div>
              <Switch
                checked={rateLimitEnabled}
                onCheckedChange={setRateLimitEnabled}
              />
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-accent">
                  {monthlyImports}
                </div>
                <div className="text-sm text-muted-foreground">
                  Imports Used
                </div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">
                  {maxImportsPerMonth - monthlyImports}
                </div>
                <div className="text-sm text-muted-foreground">Remaining</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{maxImportsPerMonth}</div>
                <div className="text-sm text-muted-foreground">
                  Monthly Limit
                </div>
              </div>
            </div>

            <div className="p-4 bg-accent/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-accent" />
                <span className="font-medium">Usage Information</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your current plan allows {maxImportsPerMonth} imports per month.
                Resets on the 1st of each month. Contact support to increase
                limits.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
