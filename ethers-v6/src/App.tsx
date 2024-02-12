import { useState } from 'react';
import Capsule, { Button, Environment, OAuthMethod, CapsuleEthersSigner } from '@usecapsule/web-sdk';
import './App.css';

// not sensitive
const BETA_KEY = 'd0b61c2c8865aaa2fb12886651627271';
const MESSAGE_TO_SIGN = 'Hello, world!';

function App() {
  const [walletAddress, setWalletAddress] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [messageSignature, setMessageSignature] = useState<string | undefined>(undefined);
  const capsule = new Capsule(Environment.DEVELOPMENT, BETA_KEY);

  async function signMessage(): Promise<void> {
    if (!(await capsule.isFullyLoggedIn())) {
      setErrorMessage('User is not logged in');
      return;
    }

    setErrorMessage(undefined);
    const ethersSigner = new CapsuleEthersSigner(capsule);
    setMessageSignature(await ethersSigner.signMessage(MESSAGE_TO_SIGN));
  }

  async function checkIfLoggedIn(): Promise<void> {
    if (await capsule.isFullyLoggedIn()) {
      setWalletAddress(Object.values(capsule.getWallets())[0]?.address);
      setErrorMessage(undefined);
    } else {
      setWalletAddress(undefined);
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
        {walletAddress ? <h2>User is logged in!</h2> : <h2>User is not logged in.</h2> }
        {walletAddress &&
          <button
            onClick={signMessage}
          >Sign Message</button>
        }
        <br />
        {walletAddress && <h3>Wallet Address: {walletAddress}</h3>}
        <br />
        {messageSignature && <h3>Message Signature for "{MESSAGE_TO_SIGN}": {messageSignature}</h3>}
        {errorMessage && <h3 style={{
          color: 'red',
        }}>Error: {errorMessage}</h3>}
      </div>
    </>
  );
}

export default App;
