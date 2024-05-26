import React, { useContext } from 'react';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import {
  getSendMaxModeState,
  isSendFormInvalid,
  toggleSendMaxMode,
} from '../../../../../../ducks/send';
import * as actions from '../../../../../../store/actions';
import {
  getSelectedStatus,
} from '../../../../../../selectors';
import { useI18nContext } from '../../../../../../hooks/useI18nContext';
import { MetaMetricsContext } from '../../../../../../contexts/metametrics';
import { MetaMetricsEventCategory } from '../../../../../../../shared/constants/metametrics';

export default function AmountMaxButton() {
  const isDraftTransactionInvalid = useSelector(isSendFormInvalid);
  const maxModeOn = useSelector(getSendMaxModeState);
  const dispatch = useDispatch();
  const trackEvent = useContext(MetaMetricsContext);
  const t = useI18nContext();
  const selectedStatus = useSelector(getSelectedStatus);
  const onMaxClick = () => {
    trackEvent({
      event: 'Clicked "Amount Max"',
      category: MetaMetricsEventCategory.Transactions,
      properties: {
        action: 'Edit Screen',
        legacy_event: true,
      },
    });
    console.log("SectedStatus:",selectedStatus);
    if(selectedStatus) dispatch(actions.toggleMaxMode());
    else dispatch(toggleSendMaxMode());
  };

  const disabled = isDraftTransactionInvalid;
  return (
    <button
      className="send-v2__amount-max"
      disabled={disabled}
      onClick={onMaxClick}
    >
      <input type="checkbox" checked={maxModeOn} readOnly />
      <div
        className={classnames('send-v2__amount-max__button', {
          'send-v2__amount-max__button__disabled': disabled,
        })}
      >
        {t('max')}
      </div>
    </button>
  );
}
