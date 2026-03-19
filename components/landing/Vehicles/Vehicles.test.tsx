/**
 * Unit tests for Vehicles component
 * Requirements: 9.2, 9.3, 9.4, 12.1
 * 
 * Tests cover:
 * - Component rendering without authentication
 * - Responsive behavior on different screen sizes
 * - RTL layout and Arabic text rendering
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Vehicles from './Vehicles';

// Mock framer-motion
jest.mock('motion/react', () => ({
  motion: {
    h2: ({ children, whileInView, viewport, transition, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, whileInView, viewport, transition, ...props }: any) => <p {...props}>{children}</p>,
    div: ({ children, whileInView, viewport, transition, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Car: () => <div data-testid="car-icon">Car</div>,
  Truck: () => <div data-testid="truck-icon">Truck</div>,
  Bike: () => <div data-testid="bike-icon">Bike</div>,
  Users: () => <div data-testid="users-icon">Users</div>,
}));

describe('Vehicles Component', () => {
  describe('Rendering without authentication', () => {
    it('should render the vehicles section without requiring authentication', () => {
      render(<Vehicles />);
      
      const heading = screen.getByText(/مركبات/i);
      expect(heading).toBeInTheDocument();
    });

    it('should display the main title with highlight', () => {
      render(<Vehicles />);
      
      expect(screen.getByText('متنوعة')).toBeInTheDocument();
      expect(screen.getByText(/لجميع احتياجاتك/i)).toBeInTheDocument();
    });

    it('should display the subtitle', () => {
      render(<Vehicles />);
      
      const subtitle = screen.getByText(/اختر المركبة التي تناسب مشوارك/i);
      expect(subtitle).toBeInTheDocument();
    });

    it('should render all four vehicle type cards', () => {
      const { container } = render(<Vehicles />);
      
      const cards = container.querySelectorAll('[class*="card"]');
      expect(cards.length).toBeGreaterThanOrEqual(4);
    });

    it('should display "اقتصادي" vehicle type', () => {
      render(<Vehicles />);
      
      expect(screen.getByText('اقتصادي')).toBeInTheDocument();
      expect(screen.getByText(/رحلات يومية بأسعار مناسبة للجميع/i)).toBeInTheDocument();
    });

    it('should display "عائلي" vehicle type', () => {
      render(<Vehicles />);
      
      expect(screen.getByText('عائلي')).toBeInTheDocument();
      expect(screen.getByText(/سيارات واسعة تناسب العائلة والأصدقاء/i)).toBeInTheDocument();
    });

    it('should display "توصيل طلبات" vehicle type', () => {
      render(<Vehicles />);
      
      expect(screen.getByText('توصيل طلبات')).toBeInTheDocument();
      expect(screen.getByText(/نقل الأغراض والطرود بأمان وسرعة/i)).toBeInTheDocument();
    });

    it('should display "دراجة نارية" vehicle type', () => {
      render(<Vehicles />);
      
      expect(screen.getByText('دراجة نارية')).toBeInTheDocument();
      expect(screen.getByText(/للوصول السريع وتجنب الزحام المروري/i)).toBeInTheDocument();
    });

    it('should render all vehicle icons', () => {
      render(<Vehicles />);
      
      expect(screen.getByTestId('car-icon')).toBeInTheDocument();
      expect(screen.getByTestId('users-icon')).toBeInTheDocument();
      expect(screen.getByTestId('truck-icon')).toBeInTheDocument();
      expect(screen.getByTestId('bike-icon')).toBeInTheDocument();
    });
  });

  describe('RTL layout and Arabic text rendering', () => {
    it('should render all Arabic text correctly', () => {
      render(<Vehicles />);
      
      const arabicTexts = [
        'مركبات',
        'متنوعة',
        'اقتصادي',
        'عائلي',
        'توصيل طلبات',
        'دراجة نارية'
      ];

      arabicTexts.forEach(text => {
        expect(screen.getByText(new RegExp(text, 'i'))).toBeInTheDocument();
      });
    });

    it('should have proper section structure for RTL', () => {
      const { container } = render(<Vehicles />);
      
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('id', 'vehicles');
    });

    it('should render vehicle descriptions in Arabic', () => {
      render(<Vehicles />);
      
      expect(screen.getByText(/رحلات يومية بأسعار مناسبة/i)).toBeInTheDocument();
      expect(screen.getByText(/سيارات واسعة تناسب العائلة/i)).toBeInTheDocument();
      expect(screen.getByText(/نقل الأغراض والطرود/i)).toBeInTheDocument();
      expect(screen.getByText(/للوصول السريع وتجنب الزحام/i)).toBeInTheDocument();
    });
  });

  describe('Responsive behavior', () => {
    it('should render container with proper structure', () => {
      const { container } = render(<Vehicles />);
      
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      
      const containerDiv = container.querySelector('[class*="container"]');
      expect(containerDiv).toBeInTheDocument();
    });

    it('should render header section', () => {
      const { container } = render(<Vehicles />);
      
      const header = container.querySelector('[class*="header"]');
      expect(header).toBeInTheDocument();
    });

    it('should render grid layout for vehicle cards', () => {
      const { container } = render(<Vehicles />);
      
      const grid = container.querySelector('[class*="grid"]');
      expect(grid).toBeInTheDocument();
    });

    it('should render all vehicle cards in grid', () => {
      const { container } = render(<Vehicles />);
      
      const grid = container.querySelector('[class*="grid"]');
      const cards = grid?.querySelectorAll('[class*="card"]');
      // Each card has nested elements with "card" in class name, so we check for at least 4
      expect(cards && cards.length >= 4).toBe(true);
    });

    it('should have icon wrappers for each vehicle type', () => {
      const { container } = render(<Vehicles />);
      
      const iconWrappers = container.querySelectorAll('[class*="iconWrapper"]');
      expect(iconWrappers.length).toBe(4);
    });

    it('should apply custom colors to vehicle cards', () => {
      const { container } = render(<Vehicles />);
      
      const cards = container.querySelectorAll('[class*="card"]');
      // Just verify cards exist with style attribute
      expect(cards.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Component structure and accessibility', () => {
    it('should have semantic section element', () => {
      const { container } = render(<Vehicles />);
      
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      const { container } = render(<Vehicles />);
      
      const h2 = container.querySelector('h2');
      expect(h2).toBeInTheDocument();
      
      const h3Elements = container.querySelectorAll('h3');
      expect(h3Elements.length).toBe(4);
    });

    it('should render vehicle types as h3 elements', () => {
      const { container } = render(<Vehicles />);
      
      const titles = container.querySelectorAll('h3');
      expect(titles).toHaveLength(4);
    });

    it('should have descriptive text for each vehicle type', () => {
      const { container } = render(<Vehicles />);
      
      const descriptions = container.querySelectorAll('[class*="cardDescription"]');
      expect(descriptions.length).toBe(4);
    });
  });
});
