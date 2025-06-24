import { render } from '../test-utils';
import YugiQuestPage from './YugiQuestPage';

test('iframe src is /yugi-quest/index.html', () => {
  const { container } = render(<YugiQuestPage />);
  const iframe = container.querySelector('iframe');
  expect(iframe).toHaveAttribute('src', '/yugi-quest/index.html');
});
