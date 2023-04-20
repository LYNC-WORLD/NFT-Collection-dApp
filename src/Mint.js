import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Biconomy } from "@biconomy/mexa";
import { ethers } from "ethers";
import web3 from "web3";

import Confetti from "react-confetti";
import { CgSpinnerAlt } from "react-icons/cg";
import { toast } from "react-toastify";

import constantsValues, {
  chainName,
  contractAddress,
} from "./constants/ConstantsValues";
import { useMintContext } from "./context/MintPageContext";
import { requestSwitchNetwork } from "./helper/switchNetwork";
import { fetchABIByType } from "./hooks/GetABI";

import { ChakraSVG } from "./components/ChakraSVG";
import { Loader } from "./components/Loader";

const Mint = () => {
  const { walletAddress, provider, claimerDetails, setWalletAddress } =
    useMintContext();
  const navigate = useNavigate();
  const [isDisable, setDisable] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);

  const [apiKey, setApiKey] = useState("");
  const [abi, SetABI] = useState("");
  const [count, setCount] = useState(1);

  const [mintDetails, setMintDetails] = useState({
    maxSupply: "",
    totalSupply: "",
    maxMintPerUser: "",
    balanceOf: "",
    cost: "",
  });

  const fetchData = async () => {
    if (claimerDetails.contractType === "biconomy") {
      await fetchBiconomyData();
    }

    if (provider && walletAddress) {
      await fetchMintDetails(claimerDetails.contractType);
    }

    setLoading(false);
  };

  const fetchBiconomyData = async () => {
    const requestOptions = {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },

      body: JSON.stringify({
        contractAddress: contractAddress.toLowerCase(),
        networkType: chainName,
      }),
    };

    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}get-biconomy-contracts`,
        requestOptions
      );

      if (!res.ok) throw res;

      const { data } = await res.json();
      console.log("Biconomy response data: ", data);

      if (!data[0]?.biconomyKey) return navigate("/");
      setApiKey(data[0]?.biconomyKey);
    } catch (err) {
      console.log("Error in fetching biconomy key data: ", err);
      toast.error(
        "Something went wrong! Please check browser console for more info."
      );
    }
  };

  const fetchMintDetails = async (typeOfContract) => {
    let abiByType = abi;

    if (!abi) {
      abiByType = await fetchABIByType(typeOfContract);
      SetABI(abiByType);
    }

    const userProvider = new ethers.providers.Web3Provider(provider);
    const nftContract = new ethers.Contract(
      contractAddress,
      abiByType,
      userProvider.getSigner()
    );

    let maxSupply, totalSupply, maxMintPerUser, balanceOf, cost;

    maxSupply = await nftContract.maxSupply();
    maxMintPerUser = await nftContract.maxMintPerUser();

    let oldCost = await nftContract.cost();
    cost = web3.utils.fromWei(oldCost.toString(), "ether");

    if (typeOfContract === "ERC1155Collection") {
      totalSupply = await nftContract.totalSupply("1");
      if (walletAddress) {
        balanceOf = await nftContract.balanceOf(walletAddress, "1");
      }
    } else {
      totalSupply = await nftContract.totalSupply();
      if (walletAddress) {
        balanceOf = await nftContract.balanceOf(walletAddress);
      }
    }

    setMintDetails({
      maxSupply: parseInt(maxSupply?.toString()),
      totalSupply: parseInt(totalSupply?.toString()),
      maxMintPerUser: parseInt(maxMintPerUser?.toString()),
      balanceOf: parseInt(balanceOf?.toString()),
      cost: cost?.toString(),
    });
  };

  useEffect(() => {
    const runFetchData = async () => {
      await fetchData();
    };

    runFetchData();
  }, [provider, walletAddress]);

  /** ----- Wallet Connect Methods ----- */
  const requestWalletConnect = async () => {
    let chainId = await provider.request({ method: "eth_chainId" });
    if (chainId !== claimerDetails.chainId) {
      toast.error(
        `You are not connected to  ${
          constantsValues[claimerDetails.chainId].ChainName
        }\n`
      );

      try {
        await requestSwitchNetwork(provider, claimerDetails.chainId);
        connectWallet();
      } catch (error) {
        toast.error("Please switch your chain first!");
        return;
      }
    } else if (chainId == claimerDetails.chainId) {
      connectWallet();
    }
  };

  const connectWallet = async () => {
    let accounts;
    let currentAccount = "";

    try {
      accounts = await provider.request({
        method: "eth_requestAccounts",
      });
    } catch (err) {
      console.log("Error in wallet connect: ", err);
      toast.error(
        "Something went wrong! Please check browser console for more info."
      );

      return;
    }

    currentAccount = accounts[0];
    setWalletAddress(currentAccount);

    toast.success("Wallet connected successfully \n");
    return currentAccount;
  };

  /** --- Minting function for Biconomy type --- */
  const gaslessTxn = async () => {
    if (!walletAddress) {
      toast.error("Connect your wallet first!");
      return;
    }

    if (!provider) {
      console.log("Ethereum not found!");
      toast.error(
        "Something went wrong! Please check browser console for more details."
      );

      return;
    }

    /** --- Gasless Txn --- */
    setDisable(true);
    const signingAccount = new ethers.Wallet(process.env.REACT_APP_PRIVATE_KEY);
    let hash = ethers.utils.id(
      String(walletAddress) + String(Math.round(new Date().getTime() / 1000))
    );
    let messageBytes = ethers.utils.arrayify(hash);
    let signature = await signingAccount.signMessage(messageBytes);

    const biconomy = new Biconomy(provider, {
      walletProvider: provider,
      apiKey: apiKey,
      debug: true,
      contractAddresses: [contractAddress],
    });

    console.log("Biconomy data: ", biconomy);

    biconomy
      .onEvent(biconomy.READY, async () => {
        toast.loading("Your NFT is being minted, please wait...");

        const contractInstance = new ethers.Contract(
          contractAddress,
          abi,
          biconomy.getSignerByAddress(walletAddress)
        );

        const { data } = await contractInstance.populateTransaction.mintNewNFT(
          1,
          hash,
          signature
        );

        let txnn = {
          data: data,
          to: contractAddress,
          from: walletAddress,
          signatureType: "EIP712_SIGN",
          gasPrice: ethers.utils.parseUnits("200", "gwei"),
          gasLimit: 2000000,
        };

        try {
          let ethersProvider = biconomy.getEthersProvider();

          let txhash = await ethersProvider.send("eth_sendTransaction", [txnn]);

          let receipt = await ethersProvider.waitForTransaction(txhash);

          toast.dismiss();
          toast.success("Your NFT is minted! 🥳");
          console.log("Biconomy mint receipt", receipt);

          setShowConfetti(true);
          setShowClaimModal(true);

          return txhash;
        } catch (err) {
          if (err.returnedHash && err.expectedHash) {
            console.log("Transaction hash : ", err.returnedHash);
          } else {
            console.log("Error in biconomy mint: ", err);
          }

          toast.dismiss();
          toast.error("NFT Minting Failed!");
        } finally {
          setDisable(false);
        }
      })
      .onEvent(biconomy.ERROR, (error, message) => {
        console.log("Biconomy Error Message: ", message);
        console.log("Biconomy Error: ", error);

        setDisable(true);
      });
  };

  /** --- Minting function for ERC721A & ERC1155 type --- */

  const mintNFT = async () => {
    if (!walletAddress) {
      toast.error("Connect your wallet first!");
      return;
    }

    if (!provider) {
      console.log("Ethereum not found!");
      toast.error(
        "Something went wrong! Please check browser console for more details."
      );

      return;
    }
    if (mintDetails.balanceOf >= mintDetails.maxMintPerUser) {
      toast.error("You have exceeded your NFTs available to mint!!");
      return;
    }

    setDisable(true);

    const signingAccount = new ethers.Wallet(process.env.REACT_APP_PRIVATE_KEY);
    let hash = ethers.utils.id(
      String(walletAddress) + String(Math.round(new Date().getTime() / 1000))
    );

    let messageBytes = ethers.utils.arrayify(hash);
    let signature = await signingAccount.signMessage(messageBytes);
    let newProvider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = newProvider.getSigner();
    const nftContract = new ethers.Contract(contractAddress, abi, signer);
    let cost = Number(mintDetails.cost) * count;

    let nftTxn;

    try {
      switch (claimerDetails.contractType) {
        case "ERC721ACollection": {
          nftTxn = await nftContract.mintNFT(
            walletAddress,
            count,
            hash,
            signature,
            {
              value: ethers.utils.parseEther(String(cost)),
            }
          );

          break;
        }

        case "ERC1155Collection": {
          nftTxn = await nftContract.mintNFT(
            walletAddress,
            count,
            0,
            hash,
            signature,
            {
              value: ethers.utils.parseEther(String(cost)),
            }
          );

          break;
        }

        default: {
          return;
        }
      }

      console.log("Mint txn hash: ", nftTxn);

      toast.loading("Your NFT is being minted, please wait...");
      await nftTxn.wait();
      toast.dismiss();
      toast.success("Your NFT is minted! 🥳");
      setCount(1);
      setShowConfetti(true);
      setShowClaimModal(true);

      await fetchMintDetails(claimerDetails.contractType);
    } catch (err) {
      console.log("Error in minting: ", err);
      toast.error("Something went wrong! Please try again later");
    } finally {
      setDisable(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="loader-position">
          <Loader />
        </div>
      ) : (
        <>
          {showConfetti ? (
            <Confetti
              width={window.innerWidth || 300}
              height={window.innerHeight || 200}
            />
          ) : null}
          <main className="claimer-page">
            <aside className="content">
              <header className="heading-container">
                <h4 className="content-heading">{claimerDetails.title}</h4>
                <div className="wallet-address-display">
                  <ChakraSVG />
                  <div>
                    <p className="address">{`${contractAddress.substring(
                      0,
                      5
                    )}....${contractAddress.substring(
                      contractAddress.length - 5
                    )}`}</p>
                    <a
                      /**
                       * @todo @arpit29joshi
                       * href={`${
                       *    constantsValues[
                       *        claimerDetails?.chainId
                       *    ].blockExplorer
                       * }${contractAddress}`}
                       */
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <p className="text">Contract Details</p>
                    </a>
                  </div>
                </div>
              </header>
              {claimerDetails.description}

              <div className="claimer-description-container">
                <h2 className="claimer-heading">Open Edition</h2>
                <div className="claimer-description">
                  <div className="claimer-description-group">
                    <p className="label">Price</p>
                    <p className="value">{mintDetails.cost}</p>
                  </div>
                  <div className="claimer-description-group">
                    <p className="label">NFTs Minted</p>
                    <p className="value">
                      {mintDetails.totalSupply}/{mintDetails.maxSupply}
                    </p>
                  </div>
                </div>
              </div>

              <div className="count-container">
                <div className="count-input">
                  <button
                    disabled={count <= 1}
                    onClick={() => {
                      setCount(count - 1);
                    }}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="count"
                    name="count"
                    step="0"
                    min="0"
                    value={count}
                    readOnly={true}
                  ></input>
                  <button
                    onClick={() => {
                      if (
                        count <=
                        mintDetails.maxMintPerUser - mintDetails?.balanceOf - 1
                      ) {
                        setCount(Number(count) + 1);
                      }
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              {claimerDetails?.category === "biconomy" ? (
                <button
                  onClick={() => {
                    gaslessTxn();
                  }}
                  className="claim-nft-btn"
                  disabled={isDisable}
                >
                  {isDisable ? (
                    <span className="state-symbol">
                      <CgSpinnerAlt className="spinner" />
                    </span>
                  ) : (
                    "Claim NFT"
                  )}
                </button>
              ) : (
                <button
                  onClick={() => {
                    mintNFT();
                  }}
                  className="claim-nft-btn"
                  disabled={isDisable}
                >
                  {isDisable ? (
                    <span className="state-symbol">
                      <CgSpinnerAlt className="spinner" />
                    </span>
                  ) : (
                    "Mint NFT"
                  )}
                </button>
              )}
            </aside>
            <div className="display">
              {!walletAddress ? (
                <button
                  onClick={() => requestWalletConnect()}
                  className="connect-wallet-btn"
                >
                  Connect Wallet
                </button>
              ) : (
                <button className="connect-wallet-btn">Connected</button>
              )}
              <span className="display-image-container">
                <img
                  src={`https://ipfs.io/ipfs/${claimerDetails.image}`}
                  alt="claimer-img"
                  className="display-img"
                />
              </span>
            </div>
          </main>
          {showClaimModal ? (
            <div className="modal-body">
              <div className="modal">
                <button
                  className="close"
                  onClick={() => {
                    setShowConfetti(false);
                    setShowClaimModal(false);
                  }}
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line
                      x1="1.50578"
                      y1="15.7116"
                      x2="15.9245"
                      y2="1.29292"
                      stroke="white"
                      stroke-width="2"
                    />
                    <line
                      x1="1.70711"
                      y1="1.40971"
                      x2="16.1258"
                      y2="15.8284"
                      stroke="white"
                      stroke-width="2"
                    />
                  </svg>
                </button>
                <div className="content-container">
                  <h1 className="heading">
                    You Successfully Minted {claimerDetails.title}
                  </h1>
                  <p className="congratulations-msg">
                    Congratulation! You have successfully minted{" "}
                    {claimerDetails.title}, Check what you have got!!
                  </p>
                </div>
                <div className="content-container">
                  <a
                    class="twitter-share-button"
                    href="https://twitter.com/intent/tweet?text=I've minted my NFT via @lyncworld claimer! Looking forward to unlocking endless possibilities via LYNC!!"
                    target="_blank"
                    rel="noreferrer"
                    data-size="large"
                  >
                    <button className="tweet-btn">
                      Let&apos;s tweet about it
                      <svg
                        width="27"
                        height="22"
                        viewBox="0 0 27 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M26.5831 2.75988C25.6089 3.19155 24.5624 3.48322 23.4623 3.61505C24.5974 2.93581 25.4467 1.86676 25.8516 0.607383C24.7851 1.24087 23.6178 1.68678 22.4006 1.92572C21.5821 1.05173 20.4978 0.47243 19.3163 0.277769C18.1348 0.0831079 16.9221 0.283973 15.8664 0.849177C14.8107 1.41438 13.9712 2.3123 13.4781 3.40354C12.9851 4.49477 12.8661 5.71826 13.1396 6.88405C10.9786 6.77555 8.86451 6.21386 6.9346 5.23544C5.0047 4.25702 3.30209 2.88374 1.93727 1.20472C1.47061 2.00972 1.20227 2.94305 1.20227 3.93705C1.20175 4.83188 1.42211 5.713 1.8438 6.50224C2.26549 7.29148 2.87546 7.96443 3.61961 8.46138C2.7566 8.43392 1.91263 8.20073 1.15794 7.78122V7.85122C1.15785 9.10625 1.59198 10.3227 2.38665 11.294C3.18133 12.2654 4.28761 12.932 5.51777 13.1806C4.71719 13.3972 3.87783 13.4291 3.06311 13.2739C3.41019 14.3538 4.08627 15.2981 4.9967 15.9746C5.90714 16.6512 7.00634 17.0261 8.14044 17.0469C6.21525 18.5582 3.83764 19.378 1.39011 19.3744C0.956551 19.3745 0.523362 19.3492 0.0927734 19.2986C2.57716 20.8959 5.46917 21.7437 8.42277 21.7404C18.4211 21.7404 23.8869 13.4594 23.8869 6.27738C23.8869 6.04405 23.8811 5.80838 23.8706 5.57505C24.9338 4.80619 25.8515 3.85409 26.5808 2.76338L26.5831 2.75988V2.75988Z"
                          fill="black"
                        />
                      </svg>
                    </button>
                  </a>

                  <a
                    className="view-nft-link"
                    /**
                     * @todo @arpit29joshi
                     * href={`${
                     *    constantsValues[
                     *        claimerDetails?.chainId
                     *    ].openSeaNFTDetails
                     * }${contractAddress}/${
                     *    mintDetails.totalSupply
                     * }`}
                     */
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View your NFT
                  </a>
                </div>
              </div>
            </div>
          ) : null}
        </>
      )}
    </>
  );
};

export default Mint;
