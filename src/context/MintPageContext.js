import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import {
    chainName,
    contractAddress,
} from "../constants/ConstantsValues";
import { requestSwitchNetwork } from "../helper/switchNetwork";

const MintContext = createContext();
export const useMintContext = () => useContext(MintContext);

export const MintContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [claimerDetails, setClaimerDetails] = useState({
    title: "",
    description: "",
    image: "",
    category: "",
    chainId: "",
  });

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    let metamaskProvider;

    if (!ethereum) {
      toast.error("Metamask not detected!");
      toast.error(
        "You must install Metamask into your browser: https://metamask.io/download.html"
      );
    }

    if (window.ethereum) {
      if (window.ethereum.providers === undefined) {
        metamaskProvider = window.ethereum;
      } else {
        metamaskProvider = window.ethereum.providers.find(
          (provider) => provider.isMetaMask
        );
      }

      setProvider(metamaskProvider);
    }

    const requestOptions = {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },

      body: JSON.stringify({
        contractAddress: String(contractAddress).toLowerCase(),
        networkType: chainName,
      }),
    };

    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}get-clamier-details`,
      requestOptions
    );

    if (!response.ok) {
      navigate("/404");
      throw response;
    }

    const { data } = await response.json();

    if (data.length > 0) {
      if (data[0].category !== "collection") {
        navigate("/404");
        return;
      }
      setClaimerDetails({
        category: data[0].category,
        contractType: data[0].contractType,
        title: data[0].title,
        description: data[0].description,
        image: data[0].image,
        chainId: data[0].chainId,
      });

      let chainId = await metamaskProvider.request({
        method: "eth_chainId",
      });

      ethereum.on("chainChanged", async (newChainId) => {
        if (newChainId !== data[0].chainId) {
          await requestSwitchNetwork(metamaskProvider, data[0].chainId);
        }
      });

      metamaskProvider.on("accountsChanged", async () => {
        window.location.reload();
      });

      const accounts = await metamaskProvider.request({
        method: "eth_accounts",
      });

      if (accounts && accounts.length > 0) {
        if (chainId !== data[0].chainId) {
          await requestSwitchNetwork(metamaskProvider, data[0].chainId);
        }
        setWalletAddress(accounts[0]);
      }
    }
  };

  useEffect(() => {
    const runCheckIfWalletIsConnected = async () => {
      await checkIfWalletIsConnected();
    };

    runCheckIfWalletIsConnected();
  }, []);

  return (
    <MintContext.Provider
      value={{
        provider,
        walletAddress,
        claimerDetails,
        setWalletAddress,
      }}
    >
      {children}
    </MintContext.Provider>
  );
};
