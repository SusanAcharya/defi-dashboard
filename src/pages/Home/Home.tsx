import React from "react";
import {
  PortfolioCard,
  LatestNotifications,
  AssetAllocation,
  PortfolioExposure,
} from "@/components";
import styles from "./Home.module.scss";

export const Home: React.FC = () => {
  return (
    <div className={styles.home}>
      <div className={styles.home__topRow}>
        <PortfolioCard />
        <LatestNotifications />
      </div>
      <div className={styles.home__grid}>
        <AssetAllocation />
        <PortfolioExposure />
      </div>
    </div>
  );
};
