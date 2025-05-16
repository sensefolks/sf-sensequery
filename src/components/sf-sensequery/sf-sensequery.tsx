import { Component, Host, h, Prop, State } from '@stencil/core';
import { isValidKey, formatErrorMessage } from '../../utils/utils';

// Define the possible steps in the survey wizard
enum SurveyStep {
  QUESTION = 0,
  CATEGORY = 1,
  RESPONDENT_DETAILS = 2,
  THANK_YOU = 3,
}

// Define the structure for categories
interface Category {
  label: string;
  value: string;
}

// Define the respondent detail field
interface RespondentDetail {
  label: string;
  value: string;
}

// Define the survey configuration
interface SurveyConfig {
  question: string;
  categories?: Category[];
  thankYouMessage: string;
}

// Define the payload structure
interface SurveyPayload {
  config: SurveyConfig;
  respondentDetails: RespondentDetail[];
}

// Define the API response structure
interface ApiResponse {
  success: boolean;
  message: string;
  payload: SurveyPayload;
}

@Component({
  tag: 'sf-sensequery',
  styleUrl: 'sf-sensequery.css',
  shadow: true,
})
export class SfSensequery {
  /**
   * The unique key for the survey to display
   */
  @Prop() surveyKey: string;

  /**
   * Store the survey configuration
   */
  @State() config: SurveyConfig | null = null;

  /**
   * Store the respondent details configuration
   */
  @State() respondentDetails: RespondentDetail[] = [];

  /**
   * Track loading state
   */
  @State() loading: boolean = false;

  /**
   * Track error state
   */
  @State() error: string | null = null;

  /**
   * Current step in the wizard
   */
  @State() currentStep: SurveyStep = SurveyStep.QUESTION;

  /**
   * User's question input
   */
  @State() questionInput: string = '';

  /**
   * Selected category
   */
  @State() selectedCategory: string | null = null;

  /**
   * User's respondent details
   */
  @State() userRespondentDetails: { [key: string]: string } = {};

  /**
   * Track if the survey has been submitted
   */
  @State() submitted: boolean = false;

  /**
   * Component lifecycle method that is called once before the component is first connected to the DOM
   */
  componentWillLoad() {
    if (isValidKey(this.surveyKey)) {
      return this.fetchSurveyData();
    }
    return Promise.resolve();
  }

  /**
   * Fetch survey data from the API
   */
  private async fetchSurveyData() {
    this.loading = true;
    this.error = null;

    // API endpoint to fetch survey data
    // const endpoint: string = `https://api.sensefolks.com/sensequery/${this.surveyKey}`;
    const endpoint: string = `http://localhost:5555/v1/public-surveys/${this.surveyKey}`;

    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Failed to fetch survey data: ${response.statusText}`);
      }

      const apiResponse: ApiResponse = await response.json();

      console.log('API Response:', apiResponse);

      // Check if the API call was successful
      if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'API returned an error');
      }

      // Check if we have valid data
      if (!apiResponse.payload || !apiResponse.payload.config || !apiResponse.payload.config.question) {
        throw new Error('Invalid survey data received');
      }

      this.config = apiResponse.payload.config;
      this.respondentDetails = apiResponse.payload.respondentDetails || [];
    } catch (err) {
      this.error = formatErrorMessage(err) || 'Failed to fetch survey data';
      console.error('Error fetching survey data:', err);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Handle question input change
   */
  private handleQuestionChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.questionInput = input.value;
  }

  /**
   * Handle category selection
   */
  private handleCategorySelect(value: string) {
    this.selectedCategory = value;
  }

  /**
   * Handle respondent detail input change
   */
  private handleRespondentDetailChange(fieldId: string, event: Event) {
    const input = event.target as HTMLInputElement | HTMLSelectElement;
    this.userRespondentDetails = {
      ...this.userRespondentDetails,
      [fieldId]: input.value,
    };
  }

  /**
   * Check if the current step is valid and can proceed
   */
  private isCurrentStepValid(): boolean {
    // Question step validation
    if (this.currentStep === SurveyStep.QUESTION) {
      return this.questionInput.trim().length > 0;
    }

    // Category step validation
    if (this.currentStep === SurveyStep.CATEGORY) {
      // If we have categories, a selection is required
      if (this.config?.categories?.length) {
        return this.selectedCategory !== null;
      }
    }

    // Respondent details validation
    // For now, we're not validating required fields in respondent details

    return true;
  }

  /**
   * Check if categories are available
   */
  private hasCategoriesStep(): boolean {
    return this.config?.categories?.length > 0;
  }

  /**
   * Check if respondent details are available
   */
  private hasRespondentDetailsStep(): boolean {
    return this.respondentDetails && this.respondentDetails.length > 0;
  }

  /**
   * Move to the next step in the wizard
   */
  private nextStep() {
    // Don't proceed if current step is not valid
    if (!this.isCurrentStepValid()) {
      return;
    }

    // Handle each step transition
    switch (this.currentStep) {
      case SurveyStep.QUESTION:
        // If both categories and respondent details are not present, submit directly
        if (!this.hasCategoriesStep() && !this.hasRespondentDetailsStep()) {
          this.submitSurvey();
        }
        // If no categories, skip to respondent details
        else if (!this.hasCategoriesStep()) {
          this.currentStep = SurveyStep.RESPONDENT_DETAILS;
        } else {
          this.currentStep = SurveyStep.CATEGORY;
        }
        break;

      case SurveyStep.CATEGORY:
        // If no respondent details, submit the survey
        if (!this.hasRespondentDetailsStep()) {
          this.submitSurvey();
        } else {
          this.currentStep = SurveyStep.RESPONDENT_DETAILS;
        }
        break;

      case SurveyStep.RESPONDENT_DETAILS:
        // Submit the survey
        this.submitSurvey();
        break;
    }
  }

  /**
   * Go back to the previous step
   */
  private prevStep() {
    switch (this.currentStep) {
      case SurveyStep.CATEGORY:
        this.currentStep = SurveyStep.QUESTION;
        break;

      case SurveyStep.RESPONDENT_DETAILS:
        // If no categories, go back to question
        if (!this.hasCategoriesStep()) {
          this.currentStep = SurveyStep.QUESTION;
        } else {
          this.currentStep = SurveyStep.CATEGORY;
        }
        break;
    }
  }

  /**
   * Submit the survey data
   */
  private async submitSurvey() {
    if (!this.questionInput.trim()) {
      return; // Don't submit if question is empty
    }

    this.loading = true;

    try {
      // Prepare the submission data
      const submissionData = {
        feedback: this.questionInput,
        category: this.selectedCategory,
        respondentDetails: this.userRespondentDetails,
      };

      console.log('Submitting data:', submissionData);

      // Submit to the API
      const response = await fetch(`https://api.sensefolks.com/sensequery/${this.surveyKey}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit response: ${response.statusText}`);
      }

      // Move to thank you step
      this.currentStep = SurveyStep.THANK_YOU;
      this.submitted = true;
    } catch (err) {
      this.error = formatErrorMessage(err) || 'Failed to submit response';
      console.error('Error submitting response:', err);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Render the question step
   */
  private renderQuestionStep() {
    // Determine if this is the final step (no categories and no respondent details)
    const isFinalStep = !this.hasCategoriesStep() && !this.hasRespondentDetailsStep();

    return (
      <div part="step question-step">
        <h2 part="heading question-heading">{this.config?.question || 'What is your question?'}</h2>
        <textarea part="input textarea" value={this.questionInput} onInput={e => this.handleQuestionChange(e)} placeholder="Type your question here..." rows={4}></textarea>
        <div part="button-container">
          <button part="button next-button" onClick={() => this.nextStep()} disabled={!this.questionInput.trim()}>
            {isFinalStep ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    );
  }

  /**
   * Render the category step
   */
  private renderCategoryStep() {
    return (
      <div part="step category-step">
        <h2 part="heading category-heading">Select a category for your question</h2>
        <div part="categories-container">
          {this.config?.categories?.map(category => (
            <label part="category-option">
              <input
                part="radio-input"
                type="radio"
                name="category"
                value={category.value}
                checked={this.selectedCategory === category.value}
                onChange={() => this.handleCategorySelect(category.value)}
              />
              <span part="category-label">{category.label}</span>
            </label>
          ))}
        </div>
        <div part="button-container">
          <button part="button back-button" onClick={() => this.prevStep()}>
            Back
          </button>
          <button part="button next-button" onClick={() => this.nextStep()} disabled={!this.selectedCategory}>
            Next
          </button>
        </div>
      </div>
    );
  }

  /**
   * Render the respondent details step
   */
  private renderRespondentDetailsStep() {
    return (
      <div part="step respondent-details-step">
        <h2 part="heading respondent-heading">Please provide some additional information</h2>
        <div part="respondent-fields-container">
          {this.respondentDetails.map(detail => (
            <div part="field">
              <label part="field-label" htmlFor={detail.value}>
                {detail.label}
              </label>
              <input
                part="input text-input"
                type={detail.value === 'email' ? 'email' : 'text'}
                id={detail.value}
                value={this.userRespondentDetails[detail.value] || ''}
                onInput={e => this.handleRespondentDetailChange(detail.value, e)}
                placeholder={`Enter your ${detail.label.toLowerCase()}`}
              />
            </div>
          ))}
          {this.respondentDetails.length === 0 && <p part="empty-message">No additional information is required.</p>}
        </div>
        <div part="button-container">
          <button part="button back-button" onClick={() => this.prevStep()}>
            Back
          </button>
          <button part="button submit-button" onClick={() => this.submitSurvey()}>
            Submit
          </button>
        </div>
      </div>
    );
  }

  /**
   * Retry operation after an error
   */
  private retryOperation() {
    // Clear error state
    this.error = null;

    // Retry fetching survey data
    return this.fetchSurveyData();
  }

  /**
   * Render the thank you step
   */
  private renderThankYouStep() {
    return (
      <div part="step thank-you-step">
        <h2 part="heading thank-you-heading">{this.config?.thankYouMessage || 'Thank you for your submission!'}</h2>
      </div>
    );
  }

  /**
   * Render the current step based on the wizard state
   */
  private renderCurrentStep() {
    const stepRenderers = {
      [SurveyStep.QUESTION]: this.renderQuestionStep.bind(this),
      [SurveyStep.CATEGORY]: this.renderCategoryStep.bind(this),
      [SurveyStep.RESPONDENT_DETAILS]: this.renderRespondentDetailsStep.bind(this),
      [SurveyStep.THANK_YOU]: this.renderThankYouStep.bind(this),
    };

    // Get the renderer for the current step or default to question step
    const renderer = stepRenderers[this.currentStep] || stepRenderers[SurveyStep.QUESTION];

    return renderer();
  }

  render() {
    // Invalid survey key
    if (!isValidKey(this.surveyKey)) {
      return (
        <Host>
          <p part="message error-message">Please provide a valid survey key</p>
        </Host>
      );
    }

    // Loading state
    if (this.loading) {
      return (
        <Host>
          <p part="message loading-message">Loading survey...</p>
        </Host>
      );
    }

    // Error state
    if (this.error) {
      return (
        <Host>
          <div part="error-container">
            <p part="message error-message">{this.error}</p>
            <button part="button retry-button" onClick={() => this.retryOperation()}>
              Try again
            </button>
          </div>
        </Host>
      );
    }

    // No configuration found
    if (!this.config) {
      return (
        <Host>
          <div part="error-container">
            <p part="message error-message">No survey configuration found</p>
            <button part="button retry-button" onClick={() => this.retryOperation()}>
              Try again
            </button>
          </div>
        </Host>
      );
    }

    // Survey wizard
    return <Host part="container">{this.renderCurrentStep()}</Host>;
  }
}
