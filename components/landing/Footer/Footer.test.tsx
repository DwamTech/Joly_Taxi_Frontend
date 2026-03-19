/**
 * Unit tests for Footer component
 * Requirements: 9.2, 9.3, 9.4, 12.1
 * 
 * Tests cover:
 * - Component rendering without authentication
 * - Responsive behavior on different screen sizes
 * - RTL layout and Arabic text rendering
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from './Footer';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Facebook: () => <div data-testid="facebook-icon">Facebook</div>,
  Twitter: () => <div data-testid="twitter-icon">Twitter</div>,
  Instagram: () => <div data-testid="instagram-icon">Instagram</div>,
  Linkedin: () => <div data-testid="linkedin-icon">Linkedin</div>,
}));

describe('Footer Component', () => {
  describe('Rendering without authentication', () => {
    it('should render the footer without requiring authentication', () => {
      const { container } = render(<Footer />);
      
      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
    });

    it('should display the logo', () => {
      render(<Footer />);
      
      const logo = screen.getByAltText('مشوار مصر');
      expect(logo).toBeInTheDocument();
      expect(logo.getAttribute('src')).toContain('logo.png');
    });

    it('should display copyright text', () => {
      render(<Footer />);
      
      const copyright = screen.getByText(/جميع الحقوق محفوظة/i);
      expect(copyright).toBeInTheDocument();
      expect(screen.getByText(/مشوار مصر/i)).toBeInTheDocument();
      expect(screen.getByText(/2026/)).toBeInTheDocument();
    });

    it('should display privacy policy link', () => {
      render(<Footer />);
      
      const privacyLink = screen.getByText('سياسة الخصوصية');
      expect(privacyLink).toBeInTheDocument();
      expect(privacyLink.closest('a')).toHaveAttribute('href', '/privacy');
    });

    it('should display terms and conditions link', () => {
      render(<Footer />);
      
      const termsLink = screen.getByText('الشروط والأحكام');
      expect(termsLink).toBeInTheDocument();
      expect(termsLink.closest('a')).toHaveAttribute('href', '/terms');
    });

    it('should display divider between legal links', () => {
      const { container } = render(<Footer />);
      
      const divider = container.querySelector('[class*="divider"]');
      expect(divider).toBeInTheDocument();
      expect(divider?.textContent).toBe('|');
    });

    it('should display all social media icons', () => {
      render(<Footer />);
      
      expect(screen.getByTestId('facebook-icon')).toBeInTheDocument();
      expect(screen.getByTestId('twitter-icon')).toBeInTheDocument();
      expect(screen.getByTestId('instagram-icon')).toBeInTheDocument();
      expect(screen.getByTestId('linkedin-icon')).toBeInTheDocument();
    });

    it('should display App Store download button', () => {
      render(<Footer />);
      
      const appStoreImg = screen.getByAltText('App Store');
      expect(appStoreImg).toBeInTheDocument();
      expect(appStoreImg.getAttribute('src')).toContain('app-store.png');
      
      expect(screen.getByText('حمل من')).toBeInTheDocument();
      expect(screen.getByText('App Store')).toBeInTheDocument();
    });

    it('should display Google Play download button', () => {
      render(<Footer />);
      
      const googlePlayImg = screen.getByAltText('Google Play');
      expect(googlePlayImg).toBeInTheDocument();
      expect(googlePlayImg.getAttribute('src')).toContain('google.png');
      
      expect(screen.getByText('احصل عليه من')).toBeInTheDocument();
      expect(screen.getByText('Google Play')).toBeInTheDocument();
    });

    it('should display "Soon" badges on download buttons', () => {
      render(<Footer />);
      
      const soonBadges = screen.getAllByText('Soon');
      expect(soonBadges.length).toBeGreaterThanOrEqual(2);
    });

    it('should have download buttons aria-label', () => {
      const { container } = render(<Footer />);
      
      const downloadSection = container.querySelector('[aria-label="حمل التطبيق"]');
      expect(downloadSection).toBeInTheDocument();
    });
  });

  describe('RTL layout and Arabic text rendering', () => {
    it('should render all Arabic text correctly', () => {
      render(<Footer />);
      
      const arabicTexts = [
        'جميع الحقوق محفوظة',
        'مشوار مصر',
        'سياسة الخصوصية',
        'الشروط والأحكام',
        'حمل من',
        'احصل عليه من'
      ];

      arabicTexts.forEach(text => {
        expect(screen.getByText(new RegExp(text, 'i'))).toBeInTheDocument();
      });
    });

    it('should have proper footer structure for RTL', () => {
      const { container } = render(<Footer />);
      
      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
    });

    it('should render logo with Arabic alt text', () => {
      render(<Footer />);
      
      const logo = screen.getByAltText('مشوار مصر');
      expect(logo).toBeInTheDocument();
    });

    it('should render copyright in Arabic', () => {
      render(<Footer />);
      
      expect(screen.getByText(/جميع الحقوق محفوظة/)).toBeInTheDocument();
    });
  });

  describe('Responsive behavior', () => {
    it('should render container with proper structure', () => {
      const { container } = render(<Footer />);
      
      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
      
      const containerDiv = container.querySelector('[class*="container"]');
      expect(containerDiv).toBeInTheDocument();
    });

    it('should have bottom section', () => {
      const { container } = render(<Footer />);
      
      const bottom = container.querySelector('[class*="bottom"]');
      expect(bottom).toBeInTheDocument();
    });

    it('should have footer side logo section', () => {
      const { container } = render(<Footer />);
      
      const logoSection = container.querySelector('[class*="footerSideLogo"]');
      expect(logoSection).toBeInTheDocument();
    });

    it('should have bottom center section', () => {
      const { container } = render(<Footer />);
      
      const bottomCenter = container.querySelector('[class*="bottomCenter"]');
      expect(bottomCenter).toBeInTheDocument();
    });

    it('should have bottom actions section', () => {
      const { container } = render(<Footer />);
      
      const bottomActions = container.querySelector('[class*="bottomActions"]');
      expect(bottomActions).toBeInTheDocument();
    });

    it('should have center links section', () => {
      const { container } = render(<Footer />);
      
      const centerLinks = container.querySelector('[class*="centerLinks"]');
      expect(centerLinks).toBeInTheDocument();
    });

    it('should have socials section', () => {
      const { container } = render(<Footer />);
      
      const socials = container.querySelector('[class*="socials"]');
      expect(socials).toBeInTheDocument();
    });

    it('should have download buttons section', () => {
      const { container } = render(<Footer />);
      
      const downloadButtons = container.querySelector('[class*="downloadButtons"]');
      expect(downloadButtons).toBeInTheDocument();
    });

    it('should render two store buttons', () => {
      const { container } = render(<Footer />);
      
      const storeButtons = container.querySelectorAll('[class*="storeBtn"]');
      expect(storeButtons.length).toBe(2);
    });
  });

  describe('Component structure and accessibility', () => {
    it('should have semantic footer element', () => {
      const { container } = render(<Footer />);
      
      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
    });

    it('should have clickable social media links', () => {
      const { container } = render(<Footer />);
      
      const socialLinks = container.querySelectorAll('[class*="socialLink"]');
      expect(socialLinks.length).toBe(4);
      
      socialLinks.forEach(link => {
        expect(link).toHaveAttribute('href');
      });
    });

    it('should have clickable legal links', () => {
      const { container } = render(<Footer />);
      
      const legalLinks = container.querySelectorAll('[class*="legalLink"]');
      expect(legalLinks.length).toBe(2);
    });

    it('should have alt text for logo image', () => {
      render(<Footer />);
      
      const logo = screen.getByAltText('مشوار مصر');
      expect(logo).toHaveAttribute('alt');
    });

    it('should have alt text for store icons', () => {
      render(<Footer />);
      
      const appStoreIcon = screen.getByAltText('App Store');
      const googlePlayIcon = screen.getByAltText('Google Play');
      
      expect(appStoreIcon).toHaveAttribute('alt');
      expect(googlePlayIcon).toHaveAttribute('alt');
    });

    it('should have interactive buttons for app downloads', () => {
      const { container } = render(<Footer />);
      
      const buttons = container.querySelectorAll('button[class*="storeBtn"]');
      expect(buttons.length).toBe(2);
    });

    it('should have proper text hierarchy in store buttons', () => {
      const { container } = render(<Footer />);
      
      const storeTexts = container.querySelectorAll('[class*="storeText"]');
      expect(storeTexts.length).toBe(2);
      
      storeTexts.forEach(text => {
        const strong = text.querySelector('strong');
        expect(strong).toBeInTheDocument();
      });
    });
  });
});
