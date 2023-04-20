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
        } else if (chainId === "0x1") {
          await metamaskProvider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x1",
                chainName: "Ethereum mainnet",
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://etherscan.io"],
                rpcUrls: ["https://mainnet.infura.io/v3/"],
              },
            ],
          });
        } else if (chainId === "0x5") {
          await metamaskProvider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x5",
                chainName: "Goerli",
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://goerli.etherscan.io"],
                rpcUrls: ["https://rpc.ankr.com/eth_goerli"],
              },
            ],
          });
        } else if (chainId === "0x250") {
          await metamaskProvider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x250",
                chainName: "Astar",
                nativeCurrency: {
                  name: "ASTR",
                  symbol: "ASTR",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://astar.subscan.io"],
                rpcUrls: ["https://evm.astar.network"],
              },
            ],
          });
        } else if (chainId === "0x144") {
          await metamaskProvider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x144",
                chainName: "zkSync Era Mainnet",
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://explorer.zksync.io"],
                rpcUrls: ["https://mainnet.era.zksync.io"],
              },
            ],
          });
        } else if (chainId === "0x118") {
          await metamaskProvider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x118",
                chainName: "zkSync Era Testnet",
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://goerli.explorer.zksync.io"],
                rpcUrls: ["https://testnet.era.zksync.dev"],
              },
            ],
          });
        } else if (chainId === "0x1389") {
          await metamaskProvider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x1389",
                chainName: "Mantle Testnet",
                nativeCurrency: {
                  name: "BIT",
                  symbol: "BIT",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://explorer.testnet.mantle.xyz"],
                rpcUrls: ["https://rpc.testnet.mantle.xyz"],
              },
            ],
          });
        } else if (chainId === "0x1388") {
          await metamaskProvider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x1388",
                chainName: "Mantle",
                nativeCurrency: {
                  name: "BIT",
                  symbol: "BIT",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://explorer.mantle.xyz"],
                rpcUrls: ["https://rpc.mantle.xyz"],
              },
            ],
          });
        } else if (chainId === "0xA4B1") {
          await metamaskProvider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0xA4B1",
                chainName: "Arbitrum One",
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://explorer.arbitrum.io"],
                rpcUrls: ["https://arbitrum-mainnet.infura.io"],
              },
            ],
          });
        } else if (chainId === "0x66EED") {
          await metamaskProvider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x66EED",
                chainName: "Arbitrum Goerli Testnet",
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://goerli.arbiscan.io/"],
                rpcUrls: ["https://goerli-rollup.arbitrum.io/rpc"],
              },
            ],
          });
        } else if (chainId === "0x42") {
          await metamaskProvider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x42",
                chainName: "OKXChain Mainnet",
                nativeCurrency: {
                  name: "OKT",
                  symbol: "OKT",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://www.oklink.com/en/okc"],
                rpcUrls: ["https://exchainrpc.okex.org"],
              },
            ],
          });
        } else if (chainId === "0xA86A") {
          await metamaskProvider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0xA86A",
                chainName: "Avalanche C-Chain",
                nativeCurrency: {
                  name: "AVAX",
                  symbol: "AVAX",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://snowtrace.io"],
                rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
              },
            ],
          });
        } else if (chainId === "0xA869") {
          await metamaskProvider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0xA869",
                chainName: "Avalanche Fuji Testnet",
                nativeCurrency: {
                  name: "AVAX",
                  symbol: "AVAX",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://testnet.snowtrace.io"],
                rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
              },
            ],
          });
        } else if (chainId === "0x41") {
          await metamaskProvider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x41",
                chainName: "OKExChain Testnet",
                nativeCurrency: {
                  name: "OKT",
                  symbol: "OKT",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://www.oklink.com/okexchain-test"],
                rpcUrls: ["https://exchaintestrpc.okex.org"],
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
