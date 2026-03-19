/**
 * Unit tests for Features component
 * Requirements: 9.2, 9.3, 9.4, 12.1
 * 
 * Tests cover:
 * - Component rendering without authentication
 * - Responsive behavior on different screen sizes
 * - RTL layout and Arabic text rendering
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Features from './Features';

// Mock framer-motion to avoid animation issues in tests
jest.mock('motion/react', () => ({
  motion: {
    h2: ({ children, whileInView, viewport, transition, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, whileInView, viewport, transition, ...props }: any) => <p {...props}>{children}</p>,
    div: ({ children, whileInView, viewport, transition, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Wallet: () => <div data-testid="wallet-icon">Wallet</div>,
  ShieldCheck: () => <div data-testid="shield-icon">ShieldCheck</div>,
  Car: () => <div data-testid="car-icon">Car</div>,
  Clock: () => <div data-testid="clock-icon">Clock</div>,
}));

describe('Features Component', () => {
  describe('Rendering without authentication', () => {
    it('should render the features section without requiring authentication', () => {
      render(<Features />);
      
      const heading = screen.getByText(/لماذا تختار/i);
      expect(heading).toBeInTheDocument();
    });

    it('should display the main title with highlight', () => {
      render(<Features />);
      
      expect(screen.getByText('مشوار مصر؟')).toBeInTheDocument();
    });

    it('should display the subtitle', () => {
      render(<Features />);
      
      const subtitle = screen.getByText(/نقدم لك تجربة نقل فريدة/i);
      expect(subtitle).toBeInTheDocument();
    });

    it('should render all four feature cards', () => {
      const { container } = render(<Features />);
      
      const cards = container.querySelectorAll('[class*="card"]');
      expect(cards.length).toBeGreaterThanOrEqual(4);
    });

    it('should display "حدد سعرك بنفسك" feature', () => {
      render(<Features />);
      
      expect(screen.getByText('حدد سعرك بنفسك')).toBeInTheDocument();
      expect(screen.getByText(/مع مشوار مصر، أنت من يقرر سعر الرحلة/i)).toBeInTheDocument();
    });

    it('should display "رحلات آمنة وموثوقة" feature', () => {
      render(<Features />);
      
      expect(screen.getByText('رحلات آمنة وموثوقة')).toBeInTheDocument();
      expect(screen.getByText(/جميع الكباتن مسجلون وموثقون/i)).toBeInTheDocument();
    });

    it('should display "خيارات متعددة" feature', () => {
      render(<Features />);
      
      expect(screen.getByText('خيارات متعددة')).toBeInTheDocument();
      expect(screen.getByText(/سواء كنت تبحث عن سيارة اقتصادية/i)).toBeInTheDocument();
    });

    it('should display "متوفرون على مدار الساعة" feature', () => {
      render(<Features />);
      
      expect(screen.getByText('متوفرون على مدار الساعة')).toBeInTheDocument();
      expect(screen.getByText(/نحن هنا لخدمتك في أي وقت وأي مكان/i)).toBeInTheDocument();
    });

    it('should render all feature icons', () => {
      render(<Features />);
      
      expect(screen.getByTestId('wallet-icon')).toBeInTheDocument();
      expect(screen.getByTestId('shield-icon')).toBeInTheDocument();
      expect(screen.getByTestId('car-icon')).toBeInTheDocument();
      expect(screen.getByTestId('clock-icon')).toBeInTheDocument();
    });
  });

  describe('RTL layout and Arabic text rendering', () => {
    it('should render all Arabic text correctly', () => {
      render(<Features />);
      
      const arabicTexts = [
        'لماذا تختار',
        'مشوار مصر؟',
        'حدد سعرك بنفسك',
        'رحلات آمنة وموثوقة',
        'خيارات متعددة',
        'متوفرون على مدار الساعة'
      ];

      arabicTexts.forEach(text => {
        expect(screen.getByText(new RegExp(text, 'i'))).toBeInTheDocument();
      });
    });

    it('should have proper section structure for RTL', () => {
      const { container } = render(<Features />);
      
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('id', 'features');
    });

    it('should render feature descriptions in Arabic', () => {
      render(<Features />);
      
      expect(screen.getByText(/تفاوض مع الكباتن/i)).toBeInTheDocument();
      expect(screen.getByText(/يمكنك مشاركة مسار رحلتك/i)).toBeInTheDocument();
      expect(screen.getByText(/دراجة نارية/i)).toBeInTheDocument();
      expect(screen.getByText(/اطلب رحلتك الآن/i)).toBeInTheDocument();
    });
  });

  describe('Responsive behavior', () => {
    it('should render container with proper structure', () => {
      const { container } = render(<Features />);
      
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      
      const containerDiv = container.querySelector('[class*="container"]');
      expect(containerDiv).toBeInTheDocument();
    });

    it('should render header section', () => {
      const { container } = render(<Features />);
      
      const header = container.querySelector('[class*="header"]');
      expect(header).toBeInTheDocument();
    });

    it('should render grid layout for feature cards', () => {
      const { container } = render(<Features />);
      
      const grid = container.querySelector('[class*="grid"]');
      expect(grid).toBeInTheDocument();
    });

    it('should render all feature cards in grid', () => {
      const { container } = render(<Features />);
      
      const grid = container.querySelector('[class*="grid"]');
      const cards = grid?.querySelectorAll('[class*="card"]');
      // Each card has nested elements with "card" in class name, so we check for at least 4
      expect(cards && cards.length >= 4).toBe(true);
    });

    it('should have icon containers for each feature', () => {
      const { container } = render(<Features />);
      
      const iconContainers = container.querySelectorAll('[class*="iconContainer"]');
      expect(iconContainers.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Component structure and accessibility', () => {
    it('should have semantic section element', () => {
      const { container } = render(<Features />);
      
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      const { container } = render(<Features />);
      
      const h2 = container.querySelector('h2');
      expect(h2).toBeInTheDocument();
      
      const h3Elements = container.querySelectorAll('h3');
      expect(h3Elements.length).toBe(4);
    });

    it('should render feature titles as h3 elements', () => {
      const { container } = render(<Features />);
      
      const titles = container.querySelectorAll('h3');
      expect(titles).toHaveLength(4);
    });

    it('should have descriptive text for each feature', () => {
      const { container } = render(<Features />);
      
      const descriptions = container.querySelectorAll('[class*="cardDescription"]');
      expect(descriptions.length).toBe(4);
    });
  });
});
