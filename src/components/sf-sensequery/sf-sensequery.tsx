import { Component, Host, h, Prop, State } from '@stencil/core';
import { isValidKey, formatErrorMessage } from '../../utils/utils';

// const SURVEY_API_ENDPOINT = 'https://api.sensefolks.com/v1/public-surveys';
const SURVEY_API_ENDPOINT = 'http://localhost:4455/v1/public-surveys';

// const RESPONSE_API_ENDPOINT = 'https://api.sensefolks.com/v1/responses';
const RESPONSE_API_ENDPOINT = 'http://localhost:4466/v1/responses';

enum SurveyStep {
  QUESTION = 0,
  CATEGORY = 1,
  RESPONDENT_DETAILS = 2,
  THANK_YOU = 3,
}

interface Category {
  label: string;
  value: string;
}

interface RespondentDetail {
  label: string;
  value: string;
}

interface SurveyConfig {
  question: string;
  categories?: Category[];
  thankYouMessage: string;
}

interface SurveyPayload {
  config: SurveyConfig;
  respondentDetails: RespondentDetail[];
}

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
  @Prop() surveyKey: string;

  @State() config: SurveyConfig | null = null;

  @State() respondentDetails: RespondentDetail[] = [];

  @State() loading: boolean = false;

  @State() error: string | null = null;

  @State() currentStep: SurveyStep = SurveyStep.QUESTION;

  @State() questionInput: string = '';

  @State() selectedCategory: string | null = null;

  @State() userRespondentDetails: { [key: string]: string } = {};

  @State() submitted: boolean = false;

  private surveyStartTime: number = 0;

  componentWillLoad() {
    if (isValidKey(this.surveyKey)) {
      return this.fetchSurveyData();
    }
    return Promise.resolve();
  }

  private async fetchSurveyData() {
    this.loading = true;
    this.error = null;

    const endpoint: string = `${SURVEY_API_ENDPOINT}/${this.surveyKey}`;

    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Failed to fetch survey data: ${response.statusText}`);
      }

      const apiResponse: ApiResponse = await response.json();

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'API returned an error');
      }

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

  private handleQuestionChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.questionInput = input.value;
  }

  private handleCategorySelect(value: string) {
    this.selectedCategory = value;
  }

  private handleRespondentDetailChange(fieldId: string, event: Event) {
    const input = event.target as HTMLInputElement | HTMLSelectElement;
    this.userRespondentDetails = {
      ...this.userRespondentDetails,
      [fieldId]: input.value,
    };
  }

  private isCurrentStepValid(): boolean {
    if (this.currentStep === SurveyStep.QUESTION) {
      return this.questionInput.trim().length > 0;
    }

    if (this.currentStep === SurveyStep.CATEGORY) {
      if (this.config?.categories?.length) {
        return this.selectedCategory !== null;
      }
    }

    return true;
  }

  private hasCategoriesStep(): boolean {
    return this.config?.categories?.length > 0;
  }

  private hasRespondentDetailsStep(): boolean {
    return this.respondentDetails && this.respondentDetails.length > 0;
  }

  private nextStep() {
    if (!this.isCurrentStepValid()) {
      return;
    }
    switch (this.currentStep) {
      case SurveyStep.QUESTION:
        if (!this.hasCategoriesStep() && !this.hasRespondentDetailsStep()) {
          this.submitSurvey();
        } else if (!this.hasCategoriesStep()) {
          this.currentStep = SurveyStep.RESPONDENT_DETAILS;
        } else {
          this.currentStep = SurveyStep.CATEGORY;
        }
        break;

      case SurveyStep.CATEGORY:
        if (!this.hasRespondentDetailsStep()) {
          this.submitSurvey();
        } else {
          this.currentStep = SurveyStep.RESPONDENT_DETAILS;
        }
        break;

      case SurveyStep.RESPONDENT_DETAILS:
        this.submitSurvey();
        break;
    }
  }

  private prevStep() {
    switch (this.currentStep) {
      case SurveyStep.CATEGORY:
        this.currentStep = SurveyStep.QUESTION;
        break;

      case SurveyStep.RESPONDENT_DETAILS:
        if (!this.hasCategoriesStep()) {
          this.currentStep = SurveyStep.QUESTION;
        } else {
          this.currentStep = SurveyStep.CATEGORY;
        }
        break;
    }
  }

  private async submitSurvey() {
    if (!this.questionInput.trim()) {
      return;
    }

    this.loading = true;

    try {
      const completionTimeSeconds = this.surveyStartTime > 0 ? Math.round((Date.now() - this.surveyStartTime) / 1000) : 0;
      const userAgentInfo = this.getUserAgentInfo();

      const submissionData = {
        surveyPublicKey: this.surveyKey,
        responseData: {
          query: this.questionInput,
          category: this.selectedCategory,
        },
        respondentDetails: this.userRespondentDetails,
        userAgent: userAgentInfo,
        completionTime: completionTimeSeconds,
      };

      const response = await fetch(`${RESPONSE_API_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit response: ${response.statusText}`);
      }

      this.currentStep = SurveyStep.THANK_YOU;
      this.submitted = true;
    } catch (err) {
      this.error = formatErrorMessage(err) || 'Failed to submit response';
      console.error('Error submitting response:', err);
    } finally {
      this.loading = false;
    }
  }

  private handleTextareaFocus() {
    if (this.surveyStartTime === 0) {
      this.surveyStartTime = Date.now();
    }
  }

  private handleTextareaBlur() {
    if (this.questionInput.trim() === '') {
      this.surveyStartTime = 0;
    }
  }

  private getUserAgentInfo() {
    let browser = 'Unknown';
    let operatingSystem = 'Unknown';
    let deviceType = 'Desktop';

    if ('userAgentData' in navigator && navigator.userAgentData) {
      const userAgentData = navigator.userAgentData as any;

      if (userAgentData.brands && userAgentData.brands.length > 0) {
        const brandInfo = userAgentData.brands.find((brand: any) => !['Chromium', 'Not-A.Brand'].includes(brand.brand));
        if (brandInfo) {
          browser = brandInfo.brand;
        } else if (userAgentData.brands[0]) {
          browser = userAgentData.brands[0].brand;
        }
      }

      if (userAgentData.platform) {
        operatingSystem = userAgentData.platform;
      }

      if (userAgentData.mobile) {
        deviceType = 'Mobile';
      }
    } else {
      const userAgent = navigator.userAgent;

      if (userAgent.indexOf('Firefox') > -1) {
        browser = 'Firefox';
      } else if (userAgent.indexOf('SamsungBrowser') > -1) {
        browser = 'Samsung Browser';
      } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
        browser = 'Opera';
      } else if (userAgent.indexOf('Trident') > -1) {
        browser = 'Internet Explorer';
      } else if (userAgent.indexOf('Edge') > -1) {
        browser = 'Edge';
      } else if (userAgent.indexOf('Chrome') > -1) {
        browser = 'Chrome';
      } else if (userAgent.indexOf('Safari') > -1) {
        browser = 'Safari';
      }

      if (userAgent.indexOf('Windows') > -1) {
        operatingSystem = 'Windows';
      } else if (userAgent.indexOf('Mac') > -1) {
        operatingSystem = 'MacOS';
      } else if (userAgent.indexOf('Linux') > -1) {
        operatingSystem = 'Linux';
      } else if (userAgent.indexOf('Android') > -1) {
        operatingSystem = 'Android';
        deviceType = 'Mobile';
      } else if (userAgent.indexOf('like Mac') > -1) {
        operatingSystem = 'iOS';
        deviceType = 'Mobile';
      }

      if (userAgent.indexOf('Mobile') > -1) {
        deviceType = 'Mobile';
      } else if (userAgent.indexOf('Tablet') > -1 || userAgent.indexOf('iPad') > -1) {
        deviceType = 'Tablet';
      }
    }

    return {
      browser,
      operatingSystem,
      deviceType,
      locale: navigator.language || 'en-US',
    };
  }

  private renderQuestionStep() {
    const isFinalStep = !this.hasCategoriesStep() && !this.hasRespondentDetailsStep();

    return (
      <div part="step question-step">
        <h2 part="heading question-heading">{this.config?.question || 'What is your question?'}</h2>
        <textarea
          part="input textarea"
          value={this.questionInput}
          onInput={e => this.handleQuestionChange(e)}
          onFocus={() => this.handleTextareaFocus()}
          onBlur={() => this.handleTextareaBlur()}
          placeholder="Type your question here..."
          rows={4}
        ></textarea>
        <div part="button-container">
          <button part="button next-button" onClick={() => this.nextStep()} disabled={!this.questionInput.trim()}>
            {isFinalStep ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    );
  }

  private renderCategoryStep() {
    const isFinalStep = !this.hasRespondentDetailsStep();

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
            {isFinalStep ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    );
  }

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

  private retryOperation() {
    this.error = null;

    return this.fetchSurveyData();
  }

  private renderThankYouStep() {
    return (
      <div part="step thank-you-step">
        <h2 part="heading thank-you-heading">{this.config?.thankYouMessage || 'Thank you for your submission!'}</h2>
      </div>
    );
  }

  private renderCurrentStep() {
    const stepRenderers = {
      [SurveyStep.QUESTION]: this.renderQuestionStep.bind(this),
      [SurveyStep.CATEGORY]: this.renderCategoryStep.bind(this),
      [SurveyStep.RESPONDENT_DETAILS]: this.renderRespondentDetailsStep.bind(this),
      [SurveyStep.THANK_YOU]: this.renderThankYouStep.bind(this),
    };

    const renderer = stepRenderers[this.currentStep] || stepRenderers[SurveyStep.QUESTION];

    return renderer();
  }

  render() {
    if (!isValidKey(this.surveyKey)) {
      return (
        <Host>
          <p part="message error-message">Please provide a valid survey key</p>
        </Host>
      );
    }

    if (this.loading) {
      return (
        <Host>
          <p part="message loading-message">Loading survey...</p>
        </Host>
      );
    }

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

    return <Host part="container">{this.renderCurrentStep()}</Host>;
  }
}
