import { getBusinessConfig } from "@/lib/business-config";
import { LandingPage } from "@/components/LandingPage";

export default function Home() {
  const businessConfig = getBusinessConfig();
  return <LandingPage businessConfig={businessConfig} />;
}
