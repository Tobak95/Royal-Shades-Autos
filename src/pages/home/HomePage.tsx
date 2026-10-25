import { FinderCard } from "./FinderCard";
import { FreshArrivals } from "./FreshArrivals";
import { HomeHero } from "./HomeHero";
import { RecentlySold } from "./RecentlySold";
import { SellBand, WhySection } from "./SellAndWhy";
import { SwapSection } from "./SwapSection";
import { TrackImport } from "./TrackImport";

/** v2 home page, in the order of design-reference-v2/home-v2.html */
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <FinderCard />
      <TrackImport />
      <FreshArrivals />
      <RecentlySold />
      <SwapSection />
      <SellBand />
      <WhySection />
    </>
  );
}
