import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import AnalyticsPage from '../AnalyticsPage';

const renderWithRoute = (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
  return render(
    <MemoryRouter initialEntries={["/analytics"]}>
      <Routes>
        <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/login" element={<div>login page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('AnalyticsPage', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            GUEST_LOGIN: 1,
            USER_SIGNUP: 2,
            CV_DOWNLOAD: 3,
            COVERLETTER_DOWNLOAD: 4,
          }),
      })
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
    localStorage.clear();
    jest.useRealTimers();
  });

  test('blocks guest users', async () => {
    renderWithRoute({ role: 'guest', email: 'g', name: 'Guest' });
    expect(await screen.findByText(/restricted access/i)).toBeInTheDocument();
  });

  test('shows metrics for admin and refetches on filter change', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-01-10T00:00:00Z'));
    renderWithRoute({ role: 'admin', email: 'a', name: 'Admin' });
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(screen.getByText('Guest Logins')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/time range/i), { target: { value: 'today' } });
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    const url = fetch.mock.calls[1][0];
    expect(url).toContain('start=');
    expect(url).toContain('end=');
  });
});
