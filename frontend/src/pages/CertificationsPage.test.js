import { render, screen } from '../test-utils';
import CertificationsPage from './CertificationsPage';
import defaultCertificates from '../data/certificates';

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(defaultCertificates) });
});

afterEach(() => {
  jest.resetAllMocks();
  localStorage.clear();
});

test('renders admin dashboard when user is admin', async () => {
  localStorage.setItem('user', JSON.stringify({ role: 'admin', name: 'Admin User' }));
  render(<CertificationsPage />);
  expect(await screen.findByRole('button', { name: /add new certificate/i })).toBeInTheDocument();
});

test('renders certificate grid for guests', async () => {
  render(<CertificationsPage />);
  expect(await screen.findByText(defaultCertificates[0].title)).toBeInTheDocument();
});
