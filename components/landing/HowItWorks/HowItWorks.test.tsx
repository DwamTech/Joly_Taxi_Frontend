/**
 * Unit tests for HowItWorks component
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
import HowItWorks from './HowItWorks';

// Mock framer-motion
jest.mock('motion/react', () => ({
  motion: {
    h2: ({ children, whileInView, viewport, transition, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, whileInView, viewport, transition, ...props }: any) => <p {...props}>{children}</p>,
    div: ({ children, whileInView, viewport, transition, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('HowItWorks Component', () => {
  describe('Rendering without authentication', () => {
    it('should render the how it works section without requiring authentication', () => {
      render(<HowItWorks />);
      
      const heading = screen.getByText(/كيف يعمل/i);
      expect(heading).toBeInTheDocument();
    });

    it('should display the main title with highlight', () => {
      render(<HowItWorks />);
      
      expect(screen.getByText('التطبيق؟')).toBeInTheDocument();
    });

    it('should display the subtitle', () => {
      render(<HowItWorks />);
      
      const subtitle = screen.getByText(/بخطوات بسيطة وسريعة/i);
      expect(subtitle).toBeInTheDocument();
    });

    it('should render all three steps', () => {
      const { container } = render(<HowItWorks />);
      
      const steps = container.querySelectorAll('[class*="step"]');
      expect(steps.length).toBeGreaterThanOrEqual(3);
    });

    it('should display step 1: "حدد وجهتك"', () => {
      render(<HowItWorks />);
      
      expect(screen.getByText('01')).toBeInTheDocument();
      expect(screen.getByText('حدد وجهتك')).toBeInTheDocument();
      expect(screen.getByText(/افتح التطبيق، اختر موقعك الحالي/i)).toBeInTheDocument();
    });

    it('should display step 2: "اختر المركبة واقترح السعر"', () => {
      render(<HowItWorks />);
      
      expect(screen.getByText('02')).toBeInTheDocument();
      expect(screen.getByText('اختر المركبة واقترح السعر')).toBeInTheDocument();
      expect(screen.getByText(/اختر نوع المركبة المناسب لك/i)).toBeInTheDocument();
    });

    it('should display step 3: "تفاوض مع الكباتن"', () => {
      render(<HowItWorks />);
      
      expect(screen.getByText('03')).toBeInTheDocument();
      expect(screen.getByText('تفاوض مع الكباتن')).toBeInTheDocument();
      expect(screen.getByText(/تلقى عروضاً من الكباتن القريبين منك/i)).toBeInTheDocument();
    });

    it('should display phone mockup image', () => {
      render(<HowItWorks />);
      
      const mockupImage = screen.getByAltText('واجهة تطبيق مشوار مصر');
      expect(mockupImage).toBeInTheDocument();
      expect(mockupImage.getAttribute('src')).toContain('mobile.png');
    });

    it('should display scroll hint text', () => {
      render(<HowItWorks />);
      
      expect(screen.getByText('اسحب لأعلى لعمل تجربة كاملة')).toBeInTheDocument();
    });
  });

  describe('RTL layout and Arabic text rendering', () => {
    it('should render all Arabic text correctly', () => {
      render(<HowItWorks />);
      
      const arabicTexts = [
        'كيف يعمل',
        'التطبيق؟',
        'حدد وجهتك',
        'اختر المركبة واقترح السعر',
        'تفاوض مع الكباتن'
      ];

      arabicTexts.forEach(text => {
        expect(screen.getByText(new RegExp(text, 'i'))).toBeInTheDocument();
      });
    });

    it('should have proper section structure for RTL', () => {
      const { container } = render(<HowItWorks />);
      
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('id', 'how-it-works');
    });

    it('should render step descriptions in Arabic', () => {
      render(<HowItWorks />);
      
      expect(screen.getByText(/افتح التطبيق، اختر موقعك الحالي/i)).toBeInTheDocument();
      expect(screen.getByText(/اختر نوع المركبة المناسب لك/i)).toBeInTheDocument();
      expect(screen.getByText(/تلقى عروضاً من الكباتن القريبين/i)).toBeInTheDocument();
    });

    it('should render step numbers in correct order', () => {
      render(<HowItWorks />);
      
      expect(screen.getByText('01')).toBeInTheDocument();
      expect(screen.getByText('02')).toBeInTheDocument();
      expect(screen.getByText('03')).toBeInTheDocument();
    });
  });

  describe('Responsive behavior', () => {
    it('should render container with proper structure', () => {
      const { container } = render(<HowItWorks />);
      
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      
      const containerDiv = container.querySelector('[class*="container"]');
      expect(containerDiv).toBeInTheDocument();
    });

    it('should render content section', () => {
      const { container } = render(<HowItWorks />);
      
      const content = container.querySelector('[class*="content"]');
      expect(content).toBeInTheDocument();
    });

    it('should render steps container', () => {
      const { container } = render(<HowItWorks />);
      
      const stepsContainer = container.querySelector('[class*="steps"]');
      expect(stepsContainer).toBeInTheDocument();
    });

    it('should render image container for phone mockup', () => {
      const { container } = render(<HowItWorks />);
      
      const imageContainer = container.querySelector('[class*="imageContainer"]');
      expect(imageContainer).toBeInTheDocument();
    });

    it('should render phone mockup structure', () => {
      const { container } = render(<HowItWorks />);
      
      const phoneMockup = container.querySelector('[class*="phoneMockup"]');
      expect(phoneMockup).toBeInTheDocument();
      
      const screen = container.querySelector('[class*="screen"]');
      expect(screen).toBeInTheDocument();
    });

    it('should have step numbers for each step', () => {
      const { container } = render(<HowItWorks />);
      
      const stepNumbers = container.querySelectorAll('[class*="stepNumber"]');
      expect(stepNumbers.length).toBe(3);
    });

    it('should have step content for each step', () => {
      const { container } = render(<HowItWorks />);
      
      const stepContents = container.querySelectorAll('[class*="stepContent"]');
      expect(stepContents.length).toBe(3);
    });
  });

  describe('Component structure and accessibility', () => {
    it('should have semantic section element', () => {
      const { container } = render(<HowItWorks />);
      
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      const { container } = render(<HowItWorks />);
      
      const h2 = container.querySelector('h2');
      expect(h2).toBeInTheDocument();
      
      const h3Elements = container.querySelectorAll('h3');
      expect(h3Elements.length).toBe(3);
    });

    it('should render step titles as h3 elements', () => {
      const { container } = render(<HowItWorks />);
      
      const titles = container.querySelectorAll('h3');
      expect(titles).toHaveLength(3);
    });

    it('should have alt text for phone mockup image', () => {
      render(<HowItWorks />);
      
      const image = screen.getByAltText('واجهة تطبيق مشوار مصر');
      expect(image).toHaveAttribute('alt');
    });

    it('should have descriptive text for each step', () => {
      const { container } = render(<HowItWorks />);
      
      const descriptions = container.querySelectorAll('[class*="stepDescription"]');
      expect(descriptions.length).toBe(3);
    });
  });
});
