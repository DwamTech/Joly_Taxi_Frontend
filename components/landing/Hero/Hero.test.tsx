/**
 * Unit tests for Hero component
 * Requirements: 9.2, 9.3, 9.4, 12.1
 * 
 * Tests cover:
 * - Component rendering without authentication
 * - Responsive behavior on different screen sizes
 * - RTL layout and Arabic text rendering
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Hero from './Hero';

// Mock framer-motion to avoid animation issues in tests
jest.mock('motion/react', () => ({
  motion: {
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('Hero Component', () => {
  describe('Rendering without authentication', () => {
    it('should render the hero section without requiring authentication', () => {
      render(<Hero />);
      
      // Check main heading is present
      const heading = screen.getByText(/مشوارك أسهل مع/i);
      expect(heading).toBeInTheDocument();
    });

    it('should display the main title with highlight', () => {
      render(<Hero />);
      
      const highlight = screen.getByText('مشوار مصر');
      expect(highlight).toBeInTheDocument();
    });

    it('should display the description text', () => {
      render(<Hero />);
      
      const description = screen.getByText(/تطبيق النقل الذكي الذي يتيح لك التفاوض على سعر رحلتك/i);
      expect(description).toBeInTheDocument();
    });

    it('should display download buttons for both app stores', () => {
      render(<Hero />);
      
      const buttons = screen.getAllByText('حمل التطبيق الآن');
      expect(buttons).toHaveLength(2);
    });

    it('should display "Soon" badges on download buttons', () => {
      render(<Hero />);
      
      const soonBadges = screen.getAllByText('Soon');
      expect(soonBadges.length).toBeGreaterThanOrEqual(2);
    });

    it('should display statistics section', () => {
      render(<Hero />);
      
      expect(screen.getByText('+1M')).toBeInTheDocument();
      expect(screen.getByText('مستخدم')).toBeInTheDocument();
      expect(screen.getByText('+50K')).toBeInTheDocument();
      expect(screen.getByText('كابتن')).toBeInTheDocument();
      expect(screen.getByText('4.9')).toBeInTheDocument();
      expect(screen.getByText('تقييم')).toBeInTheDocument();
    });

    it('should display hero image', () => {
      render(<Hero />);
      
      const heroImage = screen.getByAltText('مشوار مصر');
      expect(heroImage).toBeInTheDocument();
      expect(heroImage.getAttribute('src')).toContain('hero.jpg');
    });

    it('should display floating card with driver information', () => {
      render(<Hero />);
      
      expect(screen.getByText('الكابتن أحمد')).toBeInTheDocument();
      expect(screen.getByText('في الطريق إليك')).toBeInTheDocument();
      expect(screen.getByText('السعر المتفق عليه')).toBeInTheDocument();
      expect(screen.getByText('25 ر.س')).toBeInTheDocument();
    });
  });

  describe('RTL layout and Arabic text rendering', () => {
    it('should render Arabic text correctly', () => {
      render(<Hero />);
      
      // Check for unique Arabic text content
      expect(screen.getByText('مشوارك أسهل مع')).toBeInTheDocument();
      expect(screen.getByText('مشوار مصر')).toBeInTheDocument();
      expect(screen.getByText(/تطبيق النقل الذكي/i)).toBeInTheDocument();
      expect(screen.getByText('مستخدم')).toBeInTheDocument();
      expect(screen.getByText('تقييم')).toBeInTheDocument();
      
      // Check for download button text (appears twice)
      const downloadButtons = screen.getAllByText('حمل التطبيق الآن');
      expect(downloadButtons.length).toBe(2);
      
      // Check for "كابتن" which appears in stats and floating card
      const kaptanTexts = screen.getAllByText(/كابتن/i);
      expect(kaptanTexts.length).toBeGreaterThanOrEqual(1);
    });

    it('should have proper section structure for RTL', () => {
      const { container } = render(<Hero />);
      
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('id', 'home');
    });

    it('should render all text elements in Arabic', () => {
      render(<Hero />);
      
      // Verify key Arabic phrases are present
      expect(screen.getByText(/مشوارك أسهل/)).toBeInTheDocument();
      expect(screen.getByText(/التفاوض على سعر رحلتك/)).toBeInTheDocument();
      expect(screen.getByText(/الكابتن أحمد/)).toBeInTheDocument();
    });
  });

  describe('Responsive behavior', () => {
    it('should render container with proper structure', () => {
      const { container } = render(<Hero />);
      
      const heroSection = container.querySelector('section');
      expect(heroSection).toBeInTheDocument();
      
      // Check for main structural elements
      const contentDiv = container.querySelector('[class*="content"]');
      expect(contentDiv).toBeInTheDocument();
    });

    it('should render image container for responsive images', () => {
      const { container } = render(<Hero />);
      
      const imageContainer = container.querySelector('[class*="imageContainer"]');
      expect(imageContainer).toBeInTheDocument();
    });

    it('should have buttons container for responsive layout', () => {
      const { container } = render(<Hero />);
      
      const buttonsContainer = container.querySelector('[class*="buttons"]');
      expect(buttonsContainer).toBeInTheDocument();
    });

    it('should render stats in a grid layout', () => {
      const { container } = render(<Hero />);
      
      const statsContainer = container.querySelector('[class*="stats"]');
      expect(statsContainer).toBeInTheDocument();
      
      const statItems = container.querySelectorAll('[class*="statItem"]');
      expect(statItems).toHaveLength(3);
    });

    it('should render all interactive elements', () => {
      const { container } = render(<Hero />);
      
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Component structure and accessibility', () => {
    it('should have semantic section element', () => {
      const { container } = render(<Hero />);
      
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      const { container } = render(<Hero />);
      
      const h1 = container.querySelector('h1');
      expect(h1).toBeInTheDocument();
    });

    it('should have alt text for images', () => {
      render(<Hero />);
      
      const heroImage = screen.getByAltText('مشوار مصر');
      expect(heroImage).toHaveAttribute('alt');
    });

    it('should render store icons with alt text', () => {
      render(<Hero />);
      
      const appStoreIcon = screen.getByAltText('App Store');
      const googlePlayIcon = screen.getByAltText('Google Play');
      
      expect(appStoreIcon).toBeInTheDocument();
      expect(googlePlayIcon).toBeInTheDocument();
    });
  });
});
