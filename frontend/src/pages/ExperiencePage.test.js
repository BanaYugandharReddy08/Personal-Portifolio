import { render, screen, fireEvent, waitFor } from '../test-utils';
import Experience from './Experience';
import { ExperiencesProvider } from '../context/ExperiencesContext';
import { ProjectsProvider } from '../context/ProjectsContext';

const Wrapper = ({ children }) => (
  <ExperiencesProvider>
    <ProjectsProvider>{children}</ProjectsProvider>
  </ExperiencesProvider>
);

const experiences = [{ id: 1, position: 'Dev', company: 'X' }];
const projects = [{ id: 1, title: 'Proj', technologies: '' }];

describe('Experience page lazy loading', () => {
  beforeEach(() => {
    global.fetch = jest.fn((url) => {
      if (url.includes('/experiences')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(experiences) });
      }
      if (url.includes('/projects')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(projects) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('APIs are called only once when switching tabs', async () => {
    render(<Experience />, { wrapper: Wrapper });
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    fireEvent.click(screen.getByRole('button', { name: /projects/i }));
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    fireEvent.click(screen.getByRole('button', { name: /professional experience/i }));
    fireEvent.click(screen.getByRole('button', { name: /projects/i }));
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
