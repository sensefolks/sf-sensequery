import { Component, Host, h, Prop } from '@stencil/core';
import { isValidKey } from '../../utils/utils';

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

  render() {
    return (
      <Host>
        <div class="sf-sensequery-container">
          {isValidKey(this.surveyKey) ? (
            <div class="sf-sensequery-content">
              <p>Survey with key: {this.surveyKey}</p>
            </div>
          ) : (
            <div class="sf-sensequery-error">
              <p>Please provide a valid survey key</p>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
