import { BigNumber, utils } from 'ethers'
export default function useTime() {
  function getGasUsed(block) {
    return BigNumber.from(block.gasUsed).toString()
  }
  function getGasLimit(block) {
    return BigNumber.from(block.gasLimit).toString()
  }
  function getGasUsePecent({ gasUsed, gasLimit }) {
    return (
      BigNumber.from(gasUsed)
        .mul(10000)
        .div(BigNumber.from(gasLimit))
        .toNumber() / 100
    )
  }
  function getBaseFeePerGas(block, unit = 'eth') {
    return utils
      .formatUnits(
        BigNumber.from(block.baseFeePerGas).mul(BigNumber.from(block.gasUsed)),
        unit
      )
      .toString()
  }
  return {
    getGasUsed,
    getGasLimit,
    getGasUsePecent,
    getBaseFeePerGas,
  }
}
