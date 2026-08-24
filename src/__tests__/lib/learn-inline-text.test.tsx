import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { InlineText } from '@/components/learn/InlineText';

/**
 * The rendering half of the guide link contract. `learn-links.test.ts` proves
 * every slug in the copy resolves; this proves the markup becomes a real
 * anchor with a real href, because a link that only appears after hydration is
 * worth nothing to the crawler these pages exist for.
 */
describe('InlineText', () => {
  it('renders plain copy unchanged', () => {
    render(<InlineText text="Aperture decides what you can see." />);
    expect(screen.getByText('Aperture decides what you can see.')).toBeInTheDocument();
  });

  it('renders bold markup as an element, not as asterisks', () => {
    const { container } = render(<InlineText text="The rule is **aperture first**, always." />);
    expect(container.querySelector('strong')?.textContent).toBe('aperture first');
    expect(container.textContent).toBe('The rule is aperture first, always.');
  });

  it('turns guide link markup into an anchor pointing at that guide', () => {
    render(<InlineText text="Try [[sunk-cost-fallacy|the sunk cost fallacy guide]] next." />);
    const link = screen.getByRole('link', { name: 'the sunk cost fallacy guide' });
    expect(link).toHaveAttribute('href', '/learn/psychology/sunk-cost-fallacy');
  });

  it('handles bold and links in one string, in order', () => {
    const { container } = render(
      <InlineText text="**Aperture** beats [[aperture-vs-magnification|magnification]] every time." />
    );
    expect(container.textContent).toBe('Aperture beats magnification every time.');
    expect(container.querySelector('a')).toHaveAttribute(
      'href',
      '/learn/space-astronomy/aperture-vs-magnification'
    );
  });

  it('falls back to plain anchor text rather than a dead link', () => {
    const { container } = render(<InlineText text="See [[not-a-guide|the missing guide]]." />);
    expect(container.querySelector('a')).toBeNull();
    expect(container.textContent).toBe('See the missing guide.');
  });
});
