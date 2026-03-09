"use client";

import Image from "next/image";
import "./HeroSection.css";
import heroData from "@/data/dashboard/hero-section.json";
import { DashboardStatistics } from "@/services/dashboardService";

interface HeroSectionProps {
  stats: DashboardStatistics | null;
}

export default function HeroSection({ stats }: HeroSectionProps) {
  const { title, subtitle, actions, image } = heroData;

  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">{title}</h1>
          <p className="hero-subtitle">{subtitle}</p>

          <div className="hero-actions">
            {actions.map((action, index) => (
              <button 
                key={index} 
                className={`hero-btn hero-btn-${action.type}`}
              >
                {action.text}
              </button>
            ))}
          </div>
        </div>

        <div className="hero-image">
          <Image 
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            priority
          />
        </div>
      </div>
    </section>
  );
}
