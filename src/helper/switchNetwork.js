import { toast } from "react-toastify";
import constantsValues from "../constants/ConstantsValues";

export const requestSwitchNetwork = async (metamaskProvider, chainId) => {
  try {
    await metamaskProvider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainId }],
    });
  } catch (err) {
    console.log("Error in request switch network: ", err);

    if (err.code === 4902) {
      toast.error(`Please Add  ${constantsValues[chainId].ChainName}\n`);

      try {
        if (chainId === "0x13881") {
          await metamaskProvider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x13881",
                chainName: "Mumbai Testnet",
                nativeCurrency: {
                  name: "MATIC",
                  symbol: "MATIC",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://mumbai.polygonscan.com"],
                rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
              },
            ],
          });
        } else if (chainId === "0x89") {
          await metamaskProvider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x89",
                chainName: "Polygon Mainnet",
                nativeCurrency: {
                  name: "MATIC",
                  symbol: "MATIC",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://polygonscan.com/"],
                rpcUrls: ["https://polygon-rpc.com/"],
              },
            ],
          });
        } else if (chainId === "0x51") {
          await metamaskProvider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x51",
                chainName: "Shibuya Testnet",
                nativeCurrency: {
                  name: "SBY",
                  symbol: "SBY",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://blockscout.com/shibuya"],
                rpcUrls: ["https://evm.shibuya.astar.network"],
              },
            ],
          });
        }

        window.location.reload();
        return;
      } catch (err) {
        console.log("Error in adding chain: ", err);

        let errorData = err.data
          ? err.data.message.split(":")[1]
          : err.message.split(":")[1];

        console.log("Error data:", errorData);
        return;
      }
    }

    throw err;
  }
};
