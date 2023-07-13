// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ContractError, SmartWeaveGlobal } from 'warp-contracts';

declare global {
  const SmartWeave: SmartWeaveGlobal;
  const ContractError: typeof ContractError;
  const ContractAssert: (condition: boolean, message: string) => void;
}
