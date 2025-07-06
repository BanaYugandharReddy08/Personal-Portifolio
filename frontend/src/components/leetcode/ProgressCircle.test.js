import { render } from '../../test-utils';
import ProgressCircle from './ProgressCircle';
import { screen } from '@testing-library/react';

describe('ProgressCircle', () => {
  test('renders with correct stroke offset', () => {
    render(
      <ProgressCircle label="Easy" value={25} total={50} color="red" />
    );

    const circle = screen.getByLabelText('Easy progress');
    const offset = parseFloat(circle.getAttribute('stroke-dashoffset'));
    const expectedRadius = 30; // radius 36 - stroke 6
    const circumference = 2 * Math.PI * expectedRadius;
    const expectedOffset = circumference - 0.5 * circumference;
    expect(offset).toBeCloseTo(expectedOffset);
  });
});
