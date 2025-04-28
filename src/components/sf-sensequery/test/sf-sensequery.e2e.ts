import { newE2EPage } from '@stencil/core/testing';

describe('sf-sensequery', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sf-sensequery></sf-sensequery>');

    const element = await page.find('sf-sensequery');
    expect(element).toHaveClass('hydrated');
  });
});
