import { render, screen } from '../../test-utils';
import userEvent from '@testing-library/user-event';
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

  test('profile menu toggles on click', async () => {
    const user = { id: '1', name: 'John', email: 'john@example.com', role: 'user' };
    localStorage.setItem('user', JSON.stringify(user));

    render(<Header />);

    const profileButton = screen.getByRole('button', { name: /open profile menu/i });
    expect(profileButton).toBeInTheDocument();

    await userEvent.click(profileButton);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /account/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /logout/i })).toBeInTheDocument();

    await userEvent.click(profileButton);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
