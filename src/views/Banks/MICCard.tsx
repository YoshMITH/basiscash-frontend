import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';

import { Bank } from '../../basis-cash';
import useCashStats from '../../hooks/useCashStats';
import useShareStats from '../../hooks/useShareStats';
import { TokenStat } from '../../basis-cash/types';
import { getDisplayBalance } from '../../utils/formatBalance';
import useEarnings from '../../hooks/useEarnings';
import useHarvest from '../../hooks/useHarvest';
import useStakedBalance from '../../hooks/useStakedBalance';
import useModal from '../../hooks/useModal';
import DepositModal from '../Bank/components/DepositModal';
import WithdrawModal from '../Bank/components/WithdrawModal';
import useTokenBalance from '../../hooks/useTokenBalance';
import useStake from '../../hooks/useStake';
import useWithdraw from '../../hooks/useWithdraw';
import useApprove, { ApprovalState } from '../../hooks/useApprove';
import lock from '../../assets/img/lock.png';
import unlock from '../../assets/img/unlock.png';
import gift from '../../assets/img/gift.png';
import MIC_green from '../../assets/img/MIC_green.png';

interface MICCardProps {
  bank: Bank;
}

const MICCard: React.FC<MICCardProps> = ({ bank }) => {
  const [approveStatus, approve] = useApprove(bank.depositToken, bank.address);

  const earnings = useEarnings(bank.contract);
  const { onReward } = useHarvest(bank);

  const cashStats = useCashStats();
  const shareStats = useShareStats();

  const tokenBalance = useTokenBalance(bank.depositToken);
  const stakedBalance = useStakedBalance(bank.contract);

  const { onStake } = useStake(bank);
  const { onWithdraw } = useWithdraw(bank);

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      decimals={bank.depositToken.decimal}
      onConfirm={(amount) => {
        onStake(amount);
        onDismissDeposit();
      }}
      tokenName={bank.depositTokenName}
    />,
  );

  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      decimals={bank.depositToken.decimal}
      onConfirm={(amount) => {
        onWithdraw(amount);
        onDismissWithdraw();
      }}
      tokenName={bank.depositTokenName}
    />,
  );

  let currency = '';
  let currencyStats: TokenStat;
  let purchaseLink = '';
  if (bank.depositTokenName.includes('MIS')) {
    currency = 'MIS';
    currencyStats = shareStats;
    purchaseLink = 'https://sushiswap.fi/pair/0x066F3A3B7C8Fa077c71B9184d862ed0A4D5cF3e0';
  } else if (bank.depositTokenName.includes('MIC')) {
    currency = 'MIC';
    currencyStats = cashStats;
    purchaseLink = 'https://sushiswap.fi/pair/0xC9cB53B48A2f3A9e75982685644c1870F1405CCb';
  }

  return (
    <StyledWrapper>
      <StyledContent>
        <StyledType>Curve Stableswap</StyledType>
        <StyledTitle>{bank.name}</StyledTitle>
        <StyledSubtitle>Earn {bank.earnTokenName}</StyledSubtitle>
        <StyledReward>
          <StyledRewardValue>{getDisplayBalance(earnings)}</StyledRewardValue>
          &nbsp;
          <StyledRewardToken>{bank.earnTokenName}</StyledRewardToken>
        </StyledReward>
        <CardButton text="Claim MIS" onClick={onReward} disabled={earnings.eq(0)} icon={gift} backgroundColor="#43423F" colorHover="#DBC087" backgroundColorHover="#43423F" color="#DBC087" />
      </StyledContent>
      <StyledStat>
        <StyledFootTitle>Current {currency} Price</StyledFootTitle>
        <StyledFootValue>{
          currencyStats ? (
            `$${currencyStats.priceInUSDT}`
          ) : (
              `-`
            )}</StyledFootValue>
        <CardButton text={`Buy ${currency} with USDT`} to={purchaseLink} width='auto' icon={MIC_green} backgroundColor="#4D6756" colorHover="#A1C7AE" backgroundColorHover="#4D6756" color="#A1C7AE" />
      </StyledStat>
      <StyledFoot>
        <StyledLeftFoot>
          <StyledFootTitle><HeaderImg src={lock} />Your staked LP Balance</StyledFootTitle>
          <StyledFootValue>{
            currencyStats ? (
              `$${currencyStats.priceInUSDT}`
            ) : (
                `-`
              )}</StyledFootValue>
          <CardButton text={`Withdraw`} to={purchaseLink} />
        </StyledLeftFoot>
        <StyledRightFoot>
          <StyledFootTitle><HeaderImg src={unlock} />Your staked LP Balance</StyledFootTitle>
          <StyledFootValue>{getDisplayBalance(stakedBalance, bank.depositToken.decimal, 6)}</StyledFootValue>
          <StyledButtonGroup>
            <CardButton size='sm' text={`Deposit`} to={purchaseLink}  />
            <CardButton size='sm' text={`Withdraw`} to={purchaseLink} />
          </StyledButtonGroup>
        </StyledRightFoot>
      </StyledFoot>
    </StyledWrapper>
  )
}

const HeaderImg = styled.img`
  width: 24px;
  height: 24px;
`

const StyledWrapper = styled.div`
  border: 1px solid ${'#8DB5DA'};
  color: ${props => props.theme.color.grey[500]};
  background-color: ${props => props.theme.color.oblack};
  border-radius: 20px;
  background: #26272D;
  border: 1px solid #426687;
  box-sizing: border-box;
  box-shadow: 0px 0px 20px rgba(77, 103, 86, 0.25), 0px 10px 20px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  flex: 1;
  margin-right: 37px;
`

const StyledReward = styled.div`
  display: flex;
  align-items: baseline;
  margin: 20px 0;
`

const StyledRewardValue = styled.div`
  font-size: 40px;
  font-weight: 600;
  line-height: 51px;
  color: ${(props) => props.theme.color.white};
`

const StyledRewardToken = styled.div`
  color: #8D8F9B;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
`

const StyledType = styled.h4`
  border-radius: 20px;
  color: ${'#A1C7AE'};
  margin: ${(props) => props.theme.spacing[2]}px 0 0;
  position: absolute;
  left: 10px;
  top: 23px;
  padding: 7px 12px;
  font-size: 14px;
  background: #26272D;
  border: 1px solid #4D6756;
  box-sizing: border-box;
  box-shadow: 0px 0px 20px rgba(77, 103, 86, 0.25), 0px 10px 20px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
`;

const StyledTitle = styled.h4`
  color: ${'#A1C7AE'};
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  margin: ${(props) => props.theme.spacing[2]}px 0 0;
  // padding-left: 70px;
`;

const StyledSubtitle = styled.div`
  color: #8D8F9B;
  font-family: Lora;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
`;

const StyledContent = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  padding: ${props => props.theme.spacing[4]}px;
  border-bottom: ${props => props.theme.color.grey[800]} 1px solid;
  position: relative;
`;

const StyledStat = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  border-bottom: ${props => props.theme.color.grey[800]} 1px solid;
  padding: ${props => props.theme.spacing[4]}px;
`

const StyledFoot = styled.div`
  display: flex;
`;

const StyledFootTitle = styled.div`
  font-size: 14px;
  color: #8D8F9B;
  display:flex;
  align-items:center;
  justify-content:center;
`;

const StyledFootValue = styled.div`
  font-size: 40px;
  color: ${props => props.theme.color.white};
`

const StyledLeftFoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 1px solid #414244;
  padding: ${props => props.theme.spacing[4]}px;
  flex: 1;
`

const StyledRightFoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${props => props.theme.spacing[4]}px;
  flex: 1;
`

const StyledButtonGroup = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`

interface CardButtonProps {
  icon?: string;
  text: string;
  disabled?: boolean;
  onClick?: () => void;
  to?: string;
  size?: 'sm' | 'md',
  color?: string,
  width?: string,
  backgroundColor?: string,
  colorHover?: string,
  backgroundColorHover?: string
}

const CardButton: React.FC<CardButtonProps> = ({
  icon,
  text,
  disabled,
  onClick,
  to,
  size,
  color,
  width = '100%',
  backgroundColor,
  colorHover = '#43423F',
  backgroundColorHover
}) => {
  const { spacing } = useContext(ThemeContext)

  let buttonPadding: number;
  switch (size) {
    case 'sm':
      buttonPadding = spacing[3]
      break
    case 'md':
    default:
      buttonPadding = spacing[5]
  }

  return (
    <Button onClick={onClick} disabled={disabled} padding={buttonPadding} width={width} colorHover={colorHover} backgroundColor={backgroundColor} backgroundColorHover={backgroundColorHover} color={color} >
      {icon && <ButtonIcon src={icon}  />}
      {to ? (
        <StyledLink href={to}>{text}</StyledLink>
      ) : (
          <ButtonText color={color}>{text}</ButtonText>
        )}
    </Button>
  )
}

const ButtonIcon = styled.img`
  margin-right: ${props => props.theme.spacing[2]}px;
  height: 20px;
`

const ButtonText = styled.span`
  font-size: 14px;
  color: ${props => props.color};
`

const StyledLink = styled.a`
  color: inherit;
  text-decoration: none;
`

interface ButtonProps {
  padding: number;
  disabled?: boolean;
  width?: string;
  colorHover?: string;
  color?: string;
  backgroundColor?: any;
  backgroundColorHover?: string;
}

const Button = styled.button<ButtonProps>`
  background-color: ${props => props.backgroundColor || (!props.disabled ? '#43423F' : '#303030')};
  border-radius: 10px;
  border: 0;
  color: ${props => props.color || (!props.disabled ? props.theme.color.gold : '#4F4F4F')};
  display: flex;
  align-items: center;
  cursor: pointer;
  pointer-events: ${props => !props.disabled ? undefined : 'none'};
  font-weight: 700;
  padding: 9px 21px;
  width: ${props => props.width};
  text-align: center;
  justify-content:center;
  margin: 7px 5px 0 5px;

  &:hover {
    background-color: ${props => props.backgroundColorHover || props.theme.color.gold};
    color: ${props => props.colorHover};
  }
`

export default MICCard;