import { useState, useEffect, useCallback } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import logo from './assets/logo.svg';
import { ConnectWalletButton } from './components/ConnectWalletButton';
import { GetLastPhraseButton } from './components/GetLastPhraseButton';
import { AddPhraseButton } from './components/AddPhraseButton';
import { MessageChain } from './components/MessageChain';

// Main application component
function App() {
  const [provider, setProvider] = useState(null); // State to store the blockchain provider
  const [particlesInit, setParticlesInit] = useState(false); // State to track particles initialization
  const [lastPhrase, setLastPhrase] = useState(null); // State to store the last fetched phrase
  const [addedPhrase, setAddedPhrase] = useState(null); // State to store the last added phrase
  const [refreshMessages, setRefreshMessages] = useState(false); // State to trigger message chain refresh
  const [account, setAccount] = useState(null); // State to store the connected account

  // Callback to update the provider state
  const handleProviderUpdate = useCallback((newProvider) => {
    console.log('Provider updated:', newProvider);
    setProvider(newProvider);
  }, []);

  // Callback to update the account state
  const handleAccountUpdate = useCallback((newAccount) => {
    console.log('Account updated:', newAccount);
    setAccount(newAccount);
  }, []);

  // Effect to log synchronization between provider and account
  useEffect(() => {
    if (provider && account) {
      console.log('Account and provider are synchronized:', account, provider);
    } else {
      console.log('Provider or account is null, showing initial card');
    }
  }, [provider, account]);

  // Effect to initialize particles animation
  useEffect(() => {
    const initParticles = async () => {
      try {
        await loadSlim(window.tsParticles); // Load slim version of tsparticles
        setParticlesInit(true); // Mark particles as initialized
      } catch (error) {
        console.error('Error initializing tsparticles:', error);
      }
    };
    initParticles();
  }, []);

  // Configuration for particles animation
  const particlesOptions = {
    background: {
      color: { value: '#0d1117' },
    },
    fpsLimit: 60,
    particles: {
      color: { value: '#38bdf8' },
      links: { color: '#38bdf8', distance: 150, enable: true, opacity: 0.5, width: 1 },
      move: { enable: true, speed: 2, direction: 'none', outModes: { default: 'bounce' } },
      number: { value: 80, density: { enable: true, area: 800 } },
      opacity: { value: 0.6 },
      shape: { type: 'circle' },
      size: { value: { min: 2, max: 6 } },
    },
    detectRetina: true,
  };

  // Render the application UI
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {particlesInit && (
        <Particles
          id="tsparticles"
          options={particlesOptions} // Apply particles configuration
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
          }}
        />
      )}
      {!provider || !account ? (
        // Render initial card if wallet is not connected
        <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-3xl shadow-2xl text-center animate-fadeIn border border-gray-700 relative z-10 space-y-6">
          <header className="flex justify-center mb-6">
            <img
              src={logo}
              className="h-16 hover:drop-shadow-[0_0_15px_rgba(14,165,233,0.8)] animate-pulse"
              alt="KeywordChain logo"
            />
          </header>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400 animate-slideUp">
            Welcome to KeywordChain
          </h1>
          <p className="text-gray-300 text-lg animate-fadeIn">
            Please connect your wallet to interact with the blockchain-based message chain.
          </p>
          <div className="flex justify-center">
            <ConnectWalletButton
              account={account}
              provider={provider}
              onProviderUpdate={handleProviderUpdate}
              onAccountUpdate={handleAccountUpdate}
            />
          </div>
        </div>
      ) : (
        // Render main application UI if wallet is connected
        <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-3xl shadow-2xl text-center animate-fadeIn border border-gray-700 relative z-10 transform transition-transform hover:scale-105 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <header className="flex justify-between items-center mb-8">
            <a href="/" target="_self" rel="noopener noreferrer">
              <img
                src={logo}
                className="h-16 hover:drop-shadow-[0_0_15px_rgba(14,165,233,0.8)] animate-pulse"
                alt="KeywordChain logo"
              />
            </a>
            <ConnectWalletButton
              account={account}
              provider={provider}
              onProviderUpdate={handleProviderUpdate}
              onAccountUpdate={handleAccountUpdate}
            />
          </header>
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400 mb-6 animate-slideUp">
            KeywordChain
          </h1>
          <p className="text-gray-300 text-lg mb-10 animate-fadeIn">
            Interact with the blockchain-based message chain.
          </p>
          <div className="space-y-8">
            <GetLastPhraseButton provider={provider} onFetchLastPhrase={setLastPhrase} />
            {lastPhrase && (
              <div className="mt-4 p-4 bg-gray-800 text-blue-400 font-bold text-lg rounded-lg shadow-md animate-slideUp">
                Last Keyword: <span className="text-teal-400">{lastPhrase}</span>
              </div>
            )}
            <AddPhraseButton
              provider={provider}
              onPhraseAdded={(phrase, newKeyword) => {
                setAddedPhrase(phrase);
                setLastPhrase(newKeyword);
                setRefreshMessages((prev) => !prev);
              }}
            />
            {addedPhrase && (
              <div className="mt-4 p-4 bg-gray-800 text-green-400 font-bold text-lg rounded-lg shadow-md animate-slideUp">
                Added Phrase: <span className="text-teal-400">{addedPhrase}</span>
              </div>
            )}
            <MessageChain provider={provider} refresh={refreshMessages} />
          </div>
          <footer className="mt-12 text-gray-500 text-sm">
            © 2025 KeywordChain. All rights reserved.
          </footer>
        </div>
      )}
    </div>
  );
}

export default App;