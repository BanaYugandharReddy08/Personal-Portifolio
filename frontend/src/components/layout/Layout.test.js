import { render, screen } from '../../test-utils';
import Header from './Header';
import Footer from './Footer';

describe('Header and Footer', () => {
  afterEach(() => {
    localStorage.clear();
  });

  test('navigation links and theme toggle appear', () => {
    render(
      <>
        <Header />
        <Footer />
      </>
    );

    expect(screen.getAllByRole('link', { name: /home/i })[0]).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument();
    expect(screen.getByText(/built with react/i)).toBeInTheDocument();
  });
});
