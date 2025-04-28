import { newSpecPage } from '@stencil/core/testing';
import { SfSensequery } from '../sf-sensequery';

describe('sf-sensequery', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SfSensequery],
      html: `<sf-sensequery></sf-sensequery>`,
    });
    expect(page.root).toEqualHtml(`
      <sf-sensequery>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sf-sensequery>
    `);
  });
});
