// REACT COMPONENTS
import React from 'react';
import cloneDeep from 'lodash/cloneDeep';

// PROJECT COMPONENTS
import { FormPartsContainer } from './FormPartsContainer';
import { ControlledRadioYesNo } from './inputs';
import { allBenefitOrders } from '../programs/allBenefitOrders';


/** Asks which benefits the user is currently receiving
 *
 * @todo Add 'vertical list of options' creator that will create a list of fields using the `.field-aligner` class
 *
 * @function
 * @param {object} props
 * @property {object} props.current Client current info.
 * @property {function} props.updateClientValue Updates state upstream.
 * @property {function} props.translations Uses user chosen language-specific
 *    translations.
 *
 * @returns {object} Component
 */
class CurrentBenefitsContent extends React.Component {
  handleRadioChange = (event, inputProps) => {
    const benefitName = inputProps.name;

    const route = 'benefits';

    const value = cloneDeep(this.props.current.benefits);

    if (inputProps.value) {
      value.push(benefitName);
      value.sort(
        // Make sure benefits are in the correct order
        (a, b) => {
          const aIndex = this.props.benefits.indexOf(a);
          const bIndex = this.props.benefits.indexOf(b);

          return aIndex - bIndex;
        }
      );
    }
    else {
      const index = value.indexOf(benefitName);

      if (index >= 0) {
        value.splice(index, 1);
      }
    }

    this.props.updateClientValue(event, { route, value, time: 'current' });
  };

  render() {
    const { current, translations, benefits } = this.props;

    const components = [];
  
    for (let benefitIndex = 0; benefitIndex < benefits.length; benefitIndex++) {
      const benefit = benefits[ benefitIndex ];

      const translationKey = `i_has_${benefit}_label`;

      if (!(translationKey in translations)) {
        throw new Error(`No translation found as label for benefit radio buttons; expected key "${translationKey}"`);
      }

      const labelText = translations[ translationKey ];
  
      components.push(
        <ControlledRadioYesNo
          key={ benefit }
          translations={ translations }
          labelText={ labelText }
          onChange={ this.handleRadioChange }
          checked = { current.benefits.includes(benefit) }
          name    = { benefit } />
      );
    }

    return (
      <div>
        {components}
      </div>
    );
  }
}  // End CurrentBenefitsContent()

/**
 * @todo Combine with related components?
 *
 * @function
 * @param {object} props
 * @property {function} props.updateClientValue Updates state upstream.
 * @property {object} props.navData Bottom row buttons
 * @property {object} props.client JSON object with future and current values.
 * @property {function} props.translations Uses user chosen language-specific
 *    translations.
 *
 * @returns {object} Component
 */
const CurrentBenefitsStep = ({ updateClientValue, navData, client, translations }) => {

  return (
    <FormPartsContainer
      title     = { translations.i_currentBenefits }
      clarifier = { translations.i_selectBenefits }
      navData   = { navData }
      formClass = { `benefits` }
      formSize  = { `massive` }>
      <CurrentBenefitsContent
        updateClientValue = { updateClientValue }
        current      = { client.current }
        translations = { translations }
        benefits     = { allBenefitOrders[ client.USState ] } />
    </FormPartsContainer>
  );

};  // End CurrentBenefitsStep()

export { CurrentBenefitsStep };
