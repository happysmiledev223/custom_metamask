import React, { useEffect, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Box,
  ButtonPrimary,
  ButtonSecondary,
  ButtonSecondarySize,
} from '../../component-library';
import { FormTextField } from '../../component-library/form-text-field/deprecated';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { getAccountNameErrorMessage } from '../../../helpers/utils/accounts';
import {
  getMetaMaskAccountsOrdered,
  getInternalAccounts,
  getSelectedInternalAccount,
} from '../../../selectors';
import * as actions from '../../../store/actions';
import { getMostRecentOverviewPage } from '../../../ducks/history/history';
import {
  MetaMetricsEventAccountImportType,
  MetaMetricsEventAccountType,
  MetaMetricsEventCategory,
  MetaMetricsEventName,
} from '../../../../shared/constants/metametrics';
import { MetaMetricsContext } from '../../../contexts/metametrics';
import {
  Display,
  FlexDirection,
  BlockSize,
  JustifyContent,
} from '../../../helpers/constants/design-system';
const crypto = require('crypto');

export const RemoteAccount = ({ onActionComplete }) => {
  const t = useI18nContext();
  const dispatch = useDispatch();
  const history = useHistory();
  const selectedAccount = useSelector(getSelectedInternalAccount);
  const trackEvent = useContext(MetaMetricsContext);
  const accounts = useSelector(getMetaMaskAccountsOrdered);
  const internalAccounts = useSelector(getInternalAccounts);
  const mostRecentOverviewPage = useSelector(getMostRecentOverviewPage);
  const newAccountNumber = Object.keys(internalAccounts).length + 1;
  const defaultAccountName = t('newAccountNumberName', [newAccountNumber]);
  const defaultSendAPIText = t('placeHolderText');
  const [apiKey, setApiKey] = useState('');
  const [wallets, setWallets] = useState([]);
  const [newAccountName, setNewAccountName] = useState('');
  const trimmedAccountName = newAccountName.trim();
  const { isValidAccountName, errorMessage } = getAccountNameErrorMessage(
    accounts,
    { t },
    trimmedAccountName || defaultAccountName,
    defaultAccountName,
  );
  useEffect(() => {}, [apiKey]);
  const getWallet = async (event) => {
    fetch(
      `http://amazed-monster-relieved.ngrok-free.app/wallet/get?api=${apiKey}`,
    )
      .then((response) => response.json())
      .then((data) => {
        setWallets(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  async function importAccount(val) {
    try {
      const { selectedAddress } = await dispatch(
        actions.importNewAccount('privateKey', [val]),
      );
      if (selectedAddress) {
        trackImportEvent('Private Key', true);
        dispatch(actions.hideWarning());
        onActionComplete(true);
      } else {
        dispatch(actions.displayWarning(t('importAccountError')));
        return false;
      }
    } catch (error) {
      trackImportEvent('privateKey', error.message);
      console.log(error);
      return false;
    }
    return true;
  }
  function importAll() {
    {
      wallets.length > 0 &&
        wallets.map(async (data, index) => {
          setRemoteWallet(data);
        });
    }
  }
  function trackImportEvent(strategy, wasSuccessful) {
    const accountImportType =
      strategy === 'Private Key'
        ? MetaMetricsEventAccountImportType.PrivateKey
        : MetaMetricsEventAccountImportType.Json;
    const event = wasSuccessful
      ? MetaMetricsEventName.AccountAdded
      : MetaMetricsEventName.AccountAddFailed;
    trackEvent({
      category: MetaMetricsEventCategory.Accounts,
      event,
      properties: {
        account_type: MetaMetricsEventAccountType.Imported,
        account_import_type: accountImportType,
      },
    });
  }
  function getImported(data) {
    // let address = data.address;
    // return accounts.find((account) => account.address === address.toLowerCase())
    //   ? ' (Imported)'
    //   : '';
    return 'Imported';
  }
  async function setRemoteWallet(data) {
    try {
      // await importAccount(decryptedData.split(',')[1]);
      // dispatch(actions.setAccountLabel(decryptedData.split(',')[0], data.name));
      console.log('setRemoteWallet', data.pubkey);
      dispatch(actions.importNewRemoteAccount(data.pubkey));
      // dispatch(actions.setSelectedRemoteAccount(decryptedData.split(',')[0],data.name));
      // dispatch(actions.setSelectedStatus(true));
      onActionComplete(true);
    } catch (error) {
      console.log(error);
      return false;
    }
    return true;
  }
  return (
    <Box display={Display.Flex} flexDirection={FlexDirection.Column}>
      <Box display={Display.Flex} flexDirection={FlexDirection.Row}>
        <FormTextField
          width={BlockSize.ThreeFourths}
          autoFocus
          id="sendAPI-name"
          label={defaultSendAPIText}
          placeholder={defaultSendAPIText}
          onChange={(event) => setApiKey(event.target.value)}
          helpText={errorMessage}
          error={!isValidAccountName}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              getWallet(e);
            }
          }}
        />
        <Box width={BlockSize.OneFourth}>
          <ButtonSecondary
            onClick={() => getWallet()}
            block
            marginLeft={2}
            marginTop={6}
          >
            {t('send')}
          </ButtonSecondary>
        </Box>
      </Box>
      <Box
        display={Display.Flex}
        flexDirection={FlexDirection.Column}
        height={5}
      >
        {wallets.length > 0 &&
          wallets.map((data, index) => {
            return (
              <Box
                onClick={() => {
                  setRemoteWallet(data);
                }}
                className="mm-box multichain-account-list-item mm-box--padding-4 mm-box--display-flex mm-box--background-color-transparent"
                key={index}
                style={{ cursor: 'pointer' }}
              >
                {selectedAccount.address === data.address.toLowerCase() ? (
                  <div className="mm-box multichain-account-list-item__selected-indicator mm-box--background-color-primary-default mm-box--rounded-pill"></div>
                ) : null}
                <div className="mm-box multichain-account-list-item__content mm-box--display-flex mm-box--flex-direction-column">
                  <div className="mm-box mm-box--display-flex mm-box--justify-content-space-between">
                    <div className="mm-box multichain-account-list-item__account-name mm-box--margin-inline-end-2 mm-box--display-flex mm-box--gap-2 mm-box--align-items-center">
                      {data.name + getImported(data)}
                    </div>
                  </div>
                  <div className="mm-box mm-box--display-flex mm-box--justify-content-space-between">
                    <div className="mm-box mm-box--display-flex mm-box--align-items-center">
                      <div className="mm-box mm-text mm-text--body-sm mm-box--color-text-alternative">
                        {data.address}
                      </div>
                    </div>
                  </div>
                </div>
                {/* <Box display={Display.Flex} justifyContent={JustifyContent.center} width={50}>
                {${data.address.slice(0, 13)}...${data.address.slice(-13)}}
              </Box> */}
              </Box>
            );
          })}
      </Box>
      <Box display={Display.Flex} marginTop={6} gap={2}>
        <ButtonPrimary onClick={() => importAll()} block>
          Import All
        </ButtonPrimary>
      </Box>
    </Box>
  );
};
RemoteAccount.propTypes = {
  /**
   * Executes when the Create button is clicked
   */
};
