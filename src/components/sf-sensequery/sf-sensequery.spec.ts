import { newSpecPage } from '@stencil/core/testing';
import { SfSensequery } from './sf-sensequery';

describe('sf-sensequery', () => {
  it('renders with error when no survey key is provided', async () => {
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

  it('renders with error state when no survey configuration is found', async () => {
    // Mock the fetch function to return empty data
    global.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    const page = await newSpecPage({
      components: [SfSensequery],
      html: `<sf-sensequery survey-key="test-key"></sf-sensequery>`,
    });

    // Wait for the component to update after the fetch call is initiated
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
      <sf-sensequery survey-key="test-key">
        <mock:shadow-root>
          <div part="error-container">
            <p part="message error-message">No survey configuration found</p>
            <button part="button retry-button">
              Try again
            </button>
          </div>
        </mock:shadow-root>
      </sf-sensequery>
    `);

    // Clean up
    jest.restoreAllMocks();
  });

  it('retries fetching data when the Try again button is clicked', async () => {
    // First mock fetch to return an error
    let fetchCallCount = 0;
    global.fetch = jest.fn().mockImplementation(() => {
      fetchCallCount++;
      if (fetchCallCount === 1) {
        // First call fails
        return Promise.resolve({
          ok: false,
          statusText: 'Not Found',
        });
      } else {
        // Second call succeeds
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              payload: {
                config: {
                  question: 'Test Question',
                  thankYouMessage: 'Thank you!',
                },
                respondentDetails: [],
              },
            }),
        });
      }
    });

    const page = await newSpecPage({
      components: [SfSensequery],
      html: `<sf-sensequery survey-key="test-key"></sf-sensequery>`,
    });

    // Wait for the component to update after the first fetch call
    await page.waitForChanges();

    // Verify error state is shown
    let errorMessage = page.root.shadowRoot.querySelector('[part="error-message"]');
    expect(errorMessage).not.toBeNull();
    expect(errorMessage.textContent).toContain('Failed to fetch survey data');

    // Find and click the retry button
    const retryButton = page.root.shadowRoot.querySelector('[part="retry-button"]');
    expect(retryButton).not.toBeNull();
    (retryButton as HTMLButtonElement).click();

    // Wait for the component to update after the second fetch call
    await page.waitForChanges();

    // Verify the component is now showing the question step
    const questionHeading = page.root.shadowRoot.querySelector('[part="question-heading"]');
    expect(questionHeading).not.toBeNull();
    expect(questionHeading.textContent).toBe('Test Question');

    // Clean up
    jest.restoreAllMocks();
  });
});
