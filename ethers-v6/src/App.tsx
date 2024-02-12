import { useState } from 'react'
import Capsule, { Button, Environment, OAuthMethod, CapsuleEthersSigner } from '@usecapsule/web-sdk'
import './App.css'

const MESSAGE_TO_SIGN = 'Hello, world!'

function App() {
  const [isFullyLoggedIn, setIsFullyLoggedIn] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | undefined>(undefined)
  const [messageSignature, setMessageSignature] = useState<string | undefined>(undefined)
  const capsule = new Capsule(Environment.BETA, 'd0b61c2c8865aaa2fb12886651627271')

  async function signMessage(): Promise<void> {
    const ethersSigner = new CapsuleEthersSigner(capsule)
    setMessageSignature(await ethersSigner.signMessage(MESSAGE_TO_SIGN))
  }

  async function checkIfLoggedIn(): Promise<void> {
    const isloggedIn = await capsule.isFullyLoggedIn()
    if (isloggedIn) {
      setWalletAddress(Object.values(capsule.getWallets())[0]?.address)
      setIsFullyLoggedIn(true)
    } else {
      setIsFullyLoggedIn(false)
    }
  }

  return (
    <>
      <div className="capsule-button">
        <Button capsule={capsule} appName="Vite Example" oAuthMethods={[OAuthMethod.GOOGLE]} />
      </div>
      <div className="body">
        <br />
        <button
          onClick={checkIfLoggedIn}
        >
          Check if logged in
        </button>
        {isFullyLoggedIn ? <h2>User is logged in!</h2> : <h2>User is not logged</h2> }
        <br />
        {isFullyLoggedIn &&
          <button
            onClick={signMessage}
          >Sign Message</button>
        }
        <br />
        <br />
        {walletAddress && <h3>Wallet Address: {walletAddress}</h3>}
        <br />
        {messageSignature && <h3>Message Signature for "{MESSAGE_TO_SIGN}": {messageSignature}</h3>}
      </div>
    </>
  )
}

export default App
