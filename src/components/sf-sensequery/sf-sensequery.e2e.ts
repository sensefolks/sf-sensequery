import { newE2EPage } from '@stencil/core/testing';

describe('sf-sensequery', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sf-sensequery></sf-sensequery>');

    const element = await page.find('sf-sensequery');
    expect(element).toHaveClass('hydrated');
  });

  it('displays error message and retry button when no survey key is provided', async () => {
    const page = await newE2EPage();
    await page.setContent('<sf-sensequery></sf-sensequery>');

    // Check for error message
    const errorMessage = await page.find('sf-sensequery >>> p[part="message error-message"]');
    expect(errorMessage).not.toBeNull();
    const text = await errorMessage.getProperty('textContent');
    expect(text).toEqual('Please provide a valid survey key');

    // Check for retry button
    const retryButton = await page.find('sf-sensequery >>> button[part="button retry-button"]');
    expect(retryButton).not.toBeNull();
    const buttonText = await retryButton.getProperty('textContent');
    expect(buttonText).toEqual('Try again');
  });

  it('renders with a valid survey key', async () => {
    // Create a new page
    const page = await newE2EPage();

    // Mock the fetch API before setting content
    await page.evaluateOnNewDocument(() => {
      // Use a more compatible mock that matches the fetch signature
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      window.fetch = function (_input: RequestInfo, _init?: RequestInit) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              success: true,
              payload: {
                config: {
                  question: 'Test Question',
                  categories: [
                    { label: 'Option 1', value: 'option1' },
                    { label: 'Option 2', value: 'option2' },
                  ],
                  thankYouMessage: 'Thank you for your response!',
                },
                respondentDetails: [],
              },
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            },
          ),
        );
      };
    });

    await page.setContent('<sf-sensequery survey-key="test-key"></sf-sensequery>');

    // Wait for the component to load data
    await page.waitForChanges();

    const questionElement = await page.find('sf-sensequery >>> [part="question-heading"]');
    expect(questionElement).not.toBeNull();
    const text = await questionElement.getProperty('textContent');
    expect(text).toEqual('Test Question');
  });

  it('retry button reloads the survey data', async () => {
    const page = await newE2EPage();

    // Set up a mock that fails first, then succeeds on retry
    await page.evaluateOnNewDocument(() => {
      // Create a variable to track fetch calls
      (window as any).fetchCount = 0;

      // Mock the fetch function
      window.fetch = function (_input: RequestInfo) {
        (window as any).fetchCount++;

        if ((window as any).fetchCount === 1) {
          // First call fails
          return Promise.resolve(
            new Response(
              JSON.stringify({
                success: false,
                message: 'API Error',
              }),
              {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              },
            ),
          );
        } else {
          // Second call succeeds
          return Promise.resolve(
            new Response(
              JSON.stringify({
                success: true,
                payload: {
                  config: {
                    question: 'Retry Successful',
                    thankYouMessage: 'Thank you!',
                  },
                  respondentDetails: [],
                },
              }),
              {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              },
            ),
          );
        }
      };
    });

    await page.setContent('<sf-sensequery survey-key="test-key"></sf-sensequery>');
    await page.waitForChanges();

    // Verify error is shown
    const errorMessage = await page.find('sf-sensequery >>> p[part="message error-message"]');
    expect(errorMessage).not.toBeNull();

    // Click the retry button
    const retryButton = await page.find('sf-sensequery >>> button[part="button retry-button"]');
    await retryButton.click();
    await page.waitForChanges();

    // Verify the question is now shown
    const questionHeading = await page.find('sf-sensequery >>> [part="question-heading"]');
    expect(questionHeading).not.toBeNull();
    const text = await questionHeading.getProperty('textContent');
    expect(text).toEqual('Retry Successful');
  });
});
