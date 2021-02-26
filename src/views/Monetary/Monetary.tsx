import React, { useMemo } from 'react';
import { useWallet } from 'use-wallet';
import { Switch } from 'react-router-dom';
import Page from '../../components/Page';

import Stat from './components/Stat';
import useCashPriceInEstimatedTWAP from '../../hooks/useCashPriceInEstimatedTWAP';
import { getDisplayBalance } from '../../utils/formatBalance';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import moment from 'moment';
import Button from '../../components/Button';
import styled from 'styled-components';
import Container from '../../components/Container';
import MonetaryBoardroomCard from './components/MonetaryBoardroomCard';
import { commify } from 'ethers/lib/utils';
import ProgressCountdown from '../Boardroom/components/ProgressCountdown';
import useBondOraclePriceInLastTWAP from '../../hooks/useBondOraclePriceInLastTWAP';
import useCashStats from '../../hooks/useCashStats';

const Monetary: React.FC = () => {
  const { account } = useWallet();

  const cashStat = useCashPriceInEstimatedTWAP();
  const cash1HrPrice = useBondOraclePriceInLastTWAP();

  const scalingFactor = useMemo(
    () => (cashStat ? Number(cashStat.priceInUSDT).toFixed(2) : null),
    [cashStat],
  );
  const { prevAllocation, nextAllocation } = useTreasuryAllocationTimes();

  const prevEpoch = useMemo(
    () =>
      nextAllocation.getTime() <= Date.now()
        ? moment().utc().startOf('day').toDate()
        : prevAllocation,
    [prevAllocation, nextAllocation],
  );
  const nextEpoch = useMemo(() => moment(prevEpoch).add(6, 'hours').toDate(), [prevEpoch]);

  return (
    <Switch>
      <Page>
        {!!account ? (
          <Container size='lg'>
            <StyledStats>
              <Stat
                title={cashStat ? commify(cashStat.totalSupply) : '-'}
                description="Circulating MIC2"
              />
              <StyledProgressCountdown>
                <ProgressCountdown
                  base={prevEpoch}
                  deadline={nextEpoch}
                  description="Next Epoch 02:00, 08:00, 14:00, 20:00 GMT Daily"
                />
              </StyledProgressCountdown>
              {/*<Stat*/}
              {/*  title={cashStat ? `${cashStat.priceInUSDT}` : '-'}*/}
              {/*  description="Expected MIC Received during seigniorage"*/}
              {/*/>*/}
            </StyledStats>
            <StyledStats>
              {/*<Stat*/}
              {/*  title={*/}
              {/*    cash1HrPrice*/}
              {/*      ? `$${getDisplayBalance(cash1HrPrice, 18, 3)}`*/}
              {/*      : '-'*/}
              {/*  }*/}
              {/*  description="MIC Price for Value Reallocation Calculation"*/}
              {/*/>*/}
              {/*<Stat*/}
              {/*  // title={cashStat ? `$${cashStat.priceInUSDT}` : '-'}*/}
              {/*  title="84.7%"*/}
              {/*  description="MIC Sell Value Reallocation Fee"*/}
              {/*/>*/}
              <Stat
                title={scalingFactor ? `x${scalingFactor}` : '-'}
                description="Scaling Factor"
              />
              <Stat
                title={cashStat ? `$${cashStat.priceInUSDT}` : '-'}
                description="6H TWAP Est. MIC2 Price"
              />
            </StyledStats>
            <StyledMonetary>
              <StyledCardsWrapper>
                <StyledCardWrapper>
                  <MonetaryBoardroomCard />
                </StyledCardWrapper>
              </StyledCardsWrapper>
            </StyledMonetary>
          </Container>
        ) : (
            <UnlockWallet />
          )}
      </Page>
    </Switch>
  );
};

const UnlockWallet = () => {
  const { connect } = useWallet();
  return (
    <Center>
      <Button onClick={() => connect('injected')} text="Unlock Wallet" />
    </Center>
  );
};

const StyledMonetary = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledStats = styled.div`
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing[5]}px;
  margin-left: -${(props) => props.theme.spacing[2]}px;
  margin-right: -${(props) => props.theme.spacing[2]}px;

  > * {
    flex: 1;
    height: 84px;
    margin: 0 ${(props) => props.theme.spacing[2]}px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const StyledProgressCountdown = styled.div`
  height: 100%;
  padding: ${(props) => props.theme.spacing[2]}px ${(props) => props.theme.spacing[4]}px;
  background: #26272D;
  border: 2px solid #DBC087;
  box-sizing: border-box;
  box-shadow: 0px 0px 20px rgba(219, 192, 135, 0.5), 0px 10px 20px rgba(0, 0, 0, 0.3);
  border-radius: 20px;
`;

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 100%;
  margin: 0 -${props => props.theme.spacing[2]}px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: ${props => props.theme.spacing[2]}px;
  min-width: 450px;
`;

const Center = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export default Monetary;
