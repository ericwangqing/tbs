import { BigNumber, utils } from 'ethers'
export default function useTransaction() {
  function getGasUsed(transactionReceipt) {
    return BigNumber.from(transactionReceipt.gasUsed).toString()
  }

  function getFee(transactionReceipt, unit = 'ether') {
    return utils.formatUnits(
      BigNumber.from(transactionReceipt.effectiveGasPrice).mul(
        BigNumber.from(transactionReceipt.gasUsed)
      ),
      unit
    )
  }

  function getGasLimit(transactionReceipt) {
    return transactionReceipt.gasLimit.toString()
  }

  return {
    getGasUsed,
    getFee,
    getGasLimit,
  }
}
