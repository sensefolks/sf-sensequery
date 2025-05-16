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
          <div part="error-container">
            <p part="message error-message">Please provide a valid survey key</p>
            <button part="button retry-button">
              Try again
            </button>
          </div>
        </mock:shadow-root>
      </sf-sensequery>
    `);
  });
});
