/**
 * Unit tests for Navbar component
 * Requirements: 9.2, 9.3, 9.4, 12.1
 * 
 * Tests cover:
 * - Component rendering without authentication
 * - Responsive behavior on different screen sizes
 * - RTL layout and Arabic text rendering
 * - Mobile menu functionality
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from './Navbar';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Menu: () => <div data-testid="menu-icon">Menu</div>,
  X: () => <div data-testid="close-icon">X</div>,
}));

describe('Navbar Component', () => {
  describe('Rendering without authentication', () => {
    it('should render the navbar without requiring authentication', () => {
      const { container } = render(<Navbar />);
      
      const nav = container.querySelector('nav');
      expect(nav).toBeInTheDocument();
    });

    it('should display the logo', () => {
      render(<Navbar />);
      
      const logo = screen.getByAltText('مشوار مصر');
      expect(logo).toBeInTheDocument();
      expect(logo.getAttribute('src')).toContain('logo.png');
    });

    it('should display all navigation links', () => {
      render(<Navbar />);
      
      expect(screen.getByText('الرئيسية')).toBeInTheDocument();
      expect(screen.getByText('المميزات')).toBeInTheDocument();
      expect(screen.getByText('المركبات')).toBeInTheDocument();
      expect(screen.getByText('كيف يعمل')).toBeInTheDocument();
    });

    it('should have correct href attributes for navigation links', () => {
      render(<Navbar />);
      
      const homeLink = screen.getAllByText('الرئيسية')[0].closest('a');
      const featuresLink = screen.getByText('المميزات').closest('a');
      const vehiclesLink = screen.getByText('المركبات').closest('a');
      const howItWorksLink = screen.getByText('كيف يعمل').closest('a');
      
      expect(homeLink).toHaveAttribute('href', '#home');
      expect(featuresLink).toHaveAttribute('href', '#features');
      expect(vehiclesLink).toHaveAttribute('href', '#vehicles');
      expect(howItWorksLink).toHaveAttribute('href', '#how-it-works');
    });

    it('should display download button', () => {
      render(<Navbar />);
      
      const downloadBtn = screen.getByText('حمل التطبيق');
      expect(downloadBtn).toBeInTheDocument();
      expect(downloadBtn.closest('a')).toHaveAttribute('href', '#home');
    });

    it('should display mobile menu button', () => {
      const { container } = render(<Navbar />);
      
      const menuButton = container.querySelector('[class*="mobileMenuBtn"]');
      expect(menuButton).toBeInTheDocument();
    });
  });

  describe('Mobile menu functionality', () => {
    it('should toggle mobile menu when menu button is clicked', () => {
      const { container } = render(<Navbar />);
      
      const menuButton = container.querySelector('[class*="mobileMenuBtn"]');
      const linksContainer = container.querySelector('[class*="links"]');
      
      // Initially closed
      expect(linksContainer).not.toHaveClass(/open/);
      
      // Click to open
      fireEvent.click(menuButton!);
      expect(linksContainer).toHaveClass(/open/);
      
      // Click to close
      fireEvent.click(menuButton!);
      expect(linksContainer).not.toHaveClass(/open/);
    });

    it('should show menu icon when menu is closed', () => {
      render(<Navbar />);
      
      expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
    });

    it('should show close icon when menu is open', () => {
      const { container } = render(<Navbar />);
      
      const menuButton = container.querySelector('[class*="mobileMenuBtn"]');
      fireEvent.click(menuButton!);
      
      expect(screen.getByTestId('close-icon')).toBeInTheDocument();
    });

    it('should close menu when a navigation link is clicked', () => {
      const { container } = render(<Navbar />);
      
      const menuButton = container.querySelector('[class*="mobileMenuBtn"]');
      const linksContainer = container.querySelector('[class*="links"]');
      
      // Open menu
      fireEvent.click(menuButton!);
      expect(linksContainer).toHaveClass(/open/);
      
      // Click a link
      const homeLink = screen.getAllByText('الرئيسية')[0];
      fireEvent.click(homeLink);
      
      // Menu should close
      expect(linksContainer).not.toHaveClass(/open/);
    });

    it('should close menu when each navigation link is clicked', () => {
      const { container } = render(<Navbar />);
      
      const menuButton = container.querySelector('[class*="mobileMenuBtn"]');
      const linksContainer = container.querySelector('[class*="links"]');
      
      const links = ['الرئيسية', 'المميزات', 'المركبات', 'كيف يعمل'];
      
      links.forEach(linkText => {
        // Open menu
        fireEvent.click(menuButton!);
        expect(linksContainer).toHaveClass(/open/);
        
        // Click link
        const link = screen.getByText(linkText);
        fireEvent.click(link);
        
        // Menu should close
        expect(linksContainer).not.toHaveClass(/open/);
      });
    });
  });

  describe('RTL layout and Arabic text rendering', () => {
    it('should render all Arabic text correctly', () => {
      render(<Navbar />);
      
      const arabicTexts = [
        'الرئيسية',
        'المميزات',
        'المركبات',
        'كيف يعمل',
        'حمل التطبيق'
      ];

      arabicTexts.forEach(text => {
        expect(screen.getByText(text)).toBeInTheDocument();
      });
    });

    it('should have proper nav structure for RTL', () => {
      const { container } = render(<Navbar />);
      
      const nav = container.querySelector('nav');
      expect(nav).toBeInTheDocument();
    });

    it('should render logo with Arabic alt text', () => {
      render(<Navbar />);
      
      const logo = screen.getByAltText('مشوار مصر');
      expect(logo).toBeInTheDocument();
    });
  });

  describe('Responsive behavior', () => {
    it('should render container with proper structure', () => {
      const { container } = render(<Navbar />);
      
      const nav = container.querySelector('nav');
      expect(nav).toBeInTheDocument();
      
      const containerDiv = container.querySelector('[class*="container"]');
      expect(containerDiv).toBeInTheDocument();
    });

    it('should have logo section', () => {
      const { container } = render(<Navbar />);
      
      const logo = container.querySelector('[class*="logo"]');
      expect(logo).toBeInTheDocument();
    });

    it('should have links section', () => {
      const { container } = render(<Navbar />);
      
      const links = container.querySelector('[class*="links"]');
      expect(links).toBeInTheDocument();
    });

    it('should have actions section', () => {
      const { container } = render(<Navbar />);
      
      const actions = container.querySelector('[class*="actions"]');
      expect(actions).toBeInTheDocument();
    });

    it('should render all navigation links in links container', () => {
      const { container } = render(<Navbar />);
      
      const linksContainer = container.querySelector('[class*="links"]');
      const links = linksContainer?.querySelectorAll('a');
      expect(links?.length).toBe(4);
    });
  });

  describe('Component structure and accessibility', () => {
    it('should have semantic nav element', () => {
      const { container } = render(<Navbar />);
      
      const nav = container.querySelector('nav');
      expect(nav).toBeInTheDocument();
    });

    it('should have clickable navigation links', () => {
      const { container } = render(<Navbar />);
      
      const links = container.querySelectorAll('a[class*="link"]');
      expect(links.length).toBeGreaterThanOrEqual(4);
    });

    it('should have alt text for logo image', () => {
      render(<Navbar />);
      
      const logo = screen.getByAltText('مشوار مصر');
      expect(logo).toHaveAttribute('alt');
    });

    it('should have interactive button for mobile menu', () => {
      const { container } = render(<Navbar />);
      
      const button = container.querySelector('button[class*="mobileMenuBtn"]');
      expect(button).toBeInTheDocument();
    });

    it('should maintain state correctly across interactions', () => {
      const { container } = render(<Navbar />);
      
      const menuButton = container.querySelector('[class*="mobileMenuBtn"]');
      const linksContainer = container.querySelector('[class*="links"]');
      
      // Multiple open/close cycles
      for (let i = 0; i < 3; i++) {
        fireEvent.click(menuButton!);
        expect(linksContainer).toHaveClass(/open/);
        
        fireEvent.click(menuButton!);
        expect(linksContainer).not.toHaveClass(/open/);
      }
    });
  });
});
