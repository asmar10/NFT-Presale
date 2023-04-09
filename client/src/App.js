import logo from './logo.svg';
import { React, useEffect, useState } from 'react';
import { abi, contractAddress } from "../src/constants/index.js"

import './App.css';
import { ethers, getDefaultProvider } from "ethers"
// const ethers = require("ethers")

function App() {
  const [currentAccount, setCurrentAccount] = useState(null)
  const [isOwner, setIsOwner] = useState(false)
  const [presaleStarted, setPresaleStarted] = useState(false)
  const [isTokenIdsMinted, setIsTokenIdsMinted] = useState(false)
  const [_currentMinted, setCurrentMinted] = useState(0)


  async function getSignerOrProvider(signer = false) {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    let contract;
    if (signer) {
      const signer = provider.getSigner()
      contract = new ethers.Contract(contractAddress, abi, signer)

      return contract
    }
    contract = new ethers.Contract(contractAddress, abi, provider)

    return contract;
  }

  const _isOwner = async () => {
    try {
      const contract = await getSignerOrProvider()
      const owner = await contract.owner()
      if (owner.toLowerCase() === currentAccount) {
        setIsOwner(true)
      }
      else {
        setIsOwner(false)
      }
    } catch (err) {
      console.error(err)
    }

  }

  const isPresaleStarted = async () => {
    try {
      const contract = await getSignerOrProvider();
      const res = await contract.presaleStarted()
      setPresaleStarted(res)
    } catch (err) {
      console.error(err)
    }
  }

  const isMaxTokenIdReached = async () => {
    try {
      const contract = await getSignerOrProvider()
      const max = await contract.maxTokenIds()
      const currentids = contract.tokenIds()
      if (currentids < max) {
        setIsTokenIdsMinted(false)
      }
      else {
        setIsTokenIdsMinted(true)
      }
    }
    catch (err) {
      throw new Error(err)
    }
  }

  const isWhitelisted = async () => {
    const contract = await getSignerOrProvider();
    const tmep = await contract.isWhite
  }

  const saleMint = async () => {
    try {
      const contract = await getSignerOrProvider(true)
      const mint = await contract.mint({
        value: ethers.utils.parseEther("0.01")
      })

      await mint.wait()

    } catch (err) {
      alert(err.message || "Default error mesg")
    }
  }

  const currentMinted = async () => {
    try {
      const contract = await getSignerOrProvider()
      const current = await contract.tokenIds();
      // current.wait() 
      setCurrentMinted(parseInt(current._hex))
      // console.log()
    } catch (err) {
      alert(err.message || "Default error mesg")(err.message || "Default error mesg")

    }
  }
  const preSaleMint = async () => {
    try {

      if (presaleStarted) {
        if (!isTokenIdsMinted) {
          throw new Error("All tokens minted")
        }
        else {
          const contract = await getSignerOrProvider(true)
          const mint = await contract.presaleMint({
            value: ethers.utils.parseEther("0.01")
          })
          await mint.wait()
        }
      }
      else {
        throw new Error("Presale not yet started")
      }
    } catch (err) {
      console.log(JSON(err.message))
      alert(err.message || "Default error mesg")(err.message || "Default error mesg")
    }
  }
  // console.log(presaleStarted  )
  const _endPresale = async () => {
    try {
      const contract = await getSignerOrProvider(true)
      console.log(contract)
      const res = await contract.endPresale()
      res.wait()
    }
    catch (err) {
      alert(err.message || "Default error mesg")(err)
    }
  }

  const startPresale = async () => {
    try {
      if (isOwner === true) {
        await isPresaleStarted()
        if (presaleStarted == false) {
          const contract = await getSignerOrProvider(true)
          const res = await contract.startPresale()
          res.wait()
          setPresaleStarted(true)
        }
        else {
          throw new Error("Presale Already Started")
        }
      }
      else {
        throw new Error("Not owner")
      }
    } catch (err) {
      console.log(err)
    }
  }

  async function connectWallet() {
    try {
      if (window.ethereum) {
        const temp = await window.ethereum.request({
          method: "eth_requestAccounts"
        })
        setCurrentAccount(temp[0])
      }
      else {
        throw new Error("Install metamask")
      }
    } catch (err) {
      console.log(err)
    }

  }

  async function isWalletDisconnectedOrConnected() {
    try {
      if (window.ethereum) {
        const temp = await window.ethereum.request({
          method: "eth_accounts"
        })

        if (temp.length == 0) {
          setCurrentAccount(null)
        }
        else {
          setCurrentAccount(temp[0])
        }
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  window.ethereum.on('accountsChanged', (account) => {
    setCurrentAccount(account)
  });

  window.ethereum.on('chainChanged', () => {
    window.location.reload()
  })
  useEffect(() => {
    isWalletDisconnectedOrConnected()
    _isOwner()
    isPresaleStarted()
    isMaxTokenIdReached()
    currentMinted()
    // _endPresale()


  }, [currentAccount])

  return (
    <div>

      {currentAccount ?? <button onClick={connectWallet}>Connect Wallet</button>}<br />
      {isOwner == true && !presaleStarted ? <button onClick={startPresale}>Start Presale</button> : ""}
      {isOwner == true && presaleStarted ? <button onClick={_endPresale}>End Presale</button> : ""}

      <div className="main">
        <div>
          <h1 className="title">Welcome to Crypto Devs!</h1>
          <div className="description">
            It's an NFT collection for developers in Crypto.
          </div>
          <div className="description">
            {_currentMinted}/20 have been minted
          </div>
          {presaleStarted ? <button onClick={preSaleMint}>Presale Mint</button> : ""}
          {!presaleStarted ? <button onClick={saleMint}>Sale Mint</button> : ""}
        </div>
        <div>
          <img className="image" src="./cryptodevs/0.svg" />
        </div>
      </div>

      <footer className="footer">
        Crypto Devs by Asmar
      </footer>
    </div>
  );
}

export default App;
