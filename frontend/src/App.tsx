import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { GiTreasureMap, GiPirateCannon, GiGoldBar } from 'react-icons/gi';

// ====================
//     STYLED BASE
// ====================
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(45deg, #0a0c15, #1a1d2b);
  color: #fff;
  font-family: 'Pirata One', 'Helvetica Neue', sans-serif;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;

  /* Some padding at top/bottom to breathe */
  padding: 2rem 1rem;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
`;

/** 
 * Add small margin around HologramDisplay to keep from hugging edges 
 */
const HologramDisplay = styled(motion.div)`
  margin: 0.5rem 0; 
  background: rgba(0, 255, 247, 0.05);
  border: 1px solid rgba(0, 255, 247, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(0, 255, 247, 0.08),
      transparent
    );
    animation: hologramScan 3s infinite;
  }

  @keyframes hologramScan {
    0% {
      left: -100%;
    }
    100% {
      left: 200%;
    }
  }
`;

const CyberPirateHeader = styled(motion.div)`
  text-align: center;
  padding: 3rem 0;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 180px;
    height: 3px;
    background: linear-gradient(90deg, transparent 0%, #00f3ff 50%, transparent 100%);
  }
`;

const CyberButton = styled(motion.button)`
  background: linear-gradient(45deg, #00f3ff, #0066ff);
  border: none;
  padding: 0.9rem 1.8rem;
  color: #000;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: 0.3s all;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(0, 243, 255, 0.3);

    &::after {
      opacity: 1;
    }
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    opacity: 0;
    transition: 0.3s all;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const PirateCardContainer = styled.div`
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #00f3ff;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

// A softer neon shadow function for quick re-use
const neonShadow = (color: string) => ({
  textShadow: `0 0 3px ${color}, 0 0 6px ${color}`,
  color: color,
});

// ====================
//     COMPONENTS
// ====================
const CyberInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
}) => {
  // For preventing negatives, clamp the value to 0 or higher
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 0) {
      val = 0;
    }
    onChange(val);
  };

  return (
    <div
      style={{
        position: 'relative',
        marginBottom: '1.5rem',
        padding: '1.5rem 1rem',
        textAlign: 'center',
        maxWidth: '400px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      <label
        style={{
          ...neonShadow('#7a9fff'),
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.95rem',
        }}
      >
        {label}
      </label>
      <input
        type="number"
        min="0"
        value={value}
        onChange={handleChange}
        style={{
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid #00f3ff',
          color: '#fff',
          padding: '0.8rem',
          width: '100%',
          fontSize: '1rem',
          borderRadius: '4px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, #00f3ff, transparent)',
          opacity: 0.4,
        }}
      />
    </div>
  );
};

const CyberPirateCard = ({
  pirate,
  onUpdate,
  onDelete,
}: {
  pirate: { name: string; priority: number };
  onUpdate: (p: { name: string; priority: number }) => void;
  onDelete: () => void;
}) => {
  const updatePriority = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 0) val = 0;
    onUpdate({ ...pirate, priority: val });
  };

  return (
    <PirateCardContainer>
      <label style={{ ...neonShadow('#00f3ff') }}>Pirate Name</label>
      <input
        value={pirate.name}
        onChange={(e) => onUpdate({ ...pirate, name: e.target.value })}
        placeholder="Pirate Name"
        style={{
          background: 'transparent',
          border: 'none',
          borderBottom: '1px solid #00f3ff',
          color: '#fff',
          fontSize: '1.1rem',
          marginBottom: '0.5rem',
          padding: '2px 0',
        }}
      />
      <label style={{ ...neonShadow('#ffbf00') }}>Pirate Priority</label>
      <input
        type="number"
        min="0"
        value={pirate.priority}
        onChange={updatePriority}
        style={{
          background: 'transparent',
          border: '1px solid #00f3ff',
          color: '#fff',
          width: '80px',
          padding: '0.2rem 0.5rem',
        }}
      />
      <motion.button
        onClick={onDelete}
        whileHover={{ scale: 1.05 }}
        style={{
          marginTop: '0.5rem',
          padding: '0.5rem 1rem',
          background: 'rgba(255, 0, 0, 0.7)',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Delete
      </motion.button>
    </PirateCardContainer>
  );
};


const LoadingPulse = () => (
  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
    {[0, 0.2, 0.4].map((delay) => (
      <motion.div
        key={delay}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity, delay }}
        style={{
          width: '10px',
          height: '10px',
          background: '#00f3ff',
          borderRadius: '50%',
        }}
      />
    ))}
    <span style={{ ...neonShadow('#00f3ff') }}>Dividing Treasure...</span>
  </div>
);

const CyberPirateResult = ({
  result,
}: {
  result: {
    pirateName: string;
    gemsReceived: number;
    goldReceived: number;
    diamondsReceived: number;
  };
}) => (
  <div
    style={{
      background: 'rgba(0, 0, 0, 0.3)',
      padding: '1rem',
      borderRadius: '8px',
      border: '1px solid #00f3ff',
    }}
  >
    <h3 style={{ ...neonShadow('#ffbf00') }}>{result.pirateName}</h3>
    <div style={{ marginTop: '0.5rem' }}>
      💎 Gems: {result.gemsReceived}
    </div>
    <div>💰 Gold: {result.goldReceived}</div>
    <div>🔹 Diamonds: {result.diamondsReceived}</div>
  </div>
);

// ====================
//      MAIN APP
// ====================
function App() {
  const [treasure, setTreasure] = useState({ gems: 0, gold: 0, diamonds: 0 });
  const [pirates, setPirates] = useState<Array<{ name: string; priority: number }>>(
    []
  );
  const [results, setResults] = useState<
    Array<{
      pirateName: string;
      gemsReceived: number;
      goldReceived: number;
      diamondsReceived: number;
    }>
  >([]);
  const [isDividing, setIsDividing] = useState(false);

  // Particles
  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine);
  }, []);

  /**
   * Division Logic: 
   *   - "Priority #1" gets the most, "Priority #2" gets less, etc.
   *   - We'll invert the usual approach by treating "weight = 1 / priority".
   *   - So if a pirate has priority=1 => weight=1, priority=2 => weight=1/2, etc.
   *   - Then each pirate's fraction = (theirWeight) / (sum of all weights).
   */
  const divideTreasure = async () => {
    setIsDividing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Avoid dividing by zero if no pirates or all priorities = 0
    const validPirates = pirates.filter((p) => p.priority > 0);
    if (validPirates.length === 0) {
      setResults([]);
      setIsDividing(false);
      return;
    }

    const sumWeights = validPirates.reduce((acc, p) => acc + 1 / p.priority, 0);

    const distribution = pirates.map((p) => {
      // If priority is 0, or not in "validPirates", they get 0
      if (p.priority <= 0) {
        return {
          pirateName: p.name,
          gemsReceived: 0,
          goldReceived: 0,
          diamondsReceived: 0,
        };
      }

      // fraction = (1 / p.priority) / sumWeights
      const fraction = (1 / p.priority) / sumWeights;

      return {
        pirateName: p.name,
        gemsReceived: Math.round(treasure.gems * fraction),
        goldReceived: Math.round(treasure.gold * fraction),
        diamondsReceived: Math.round(treasure.diamonds * fraction),
      };
    });

    setResults(distribution);
    setIsDividing(false);
  };

  return (
    <Container>
      {/* Background Particles */}
      <Particles
        init={particlesInit}
        options={{
          background: { color: { value: '' } },
          particles: {
            number: { value: 50 },
            color: { value: '#00f3ff' },
            opacity: { value: 0.5 },
            size: { value: 2 },
            move: { enable: true, speed: 1 },
          },
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
          width: '100%',
          height: '100%',
        }}
      />

      <ContentWrapper>
        {/* Header */}
        <CyberPirateHeader
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            <GiTreasureMap
              style={{ filter: 'drop-shadow(0 0 8px #00f3ff)', fontSize: '2.5rem' }}
            />
            <span
              style={{
                ...neonShadow('#00f3ff'),
                margin: '0 0.7rem',
                fontSize: '1.2em',
              }}
            >
              CYBER
            </span>
            <span
              style={{
                ...neonShadow('#ffbf00'),
                fontSize: '1.2em',
              }}
            >
              BOOTY
            </span>
          </h1>
          <p
            style={{
              ...neonShadow('#00f3ff'),
              fontSize: '1.2rem',
              marginTop: '0.5rem',
            }}
          >
            Next-Gen Treasure Division Protocol
          </p>
        </CyberPirateHeader>

        {/* Main Panels */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            padding: '1rem 0 3rem',
          }}
        >
          {/* Treasure Vault */}
          <HologramDisplay
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            style={{ zIndex: 1 }}
          >
            <h2
              style={{
                ...neonShadow('#00f3ff'),
                fontSize: '1.8rem',
                marginBottom: '1rem',
              }}
            >
              TREASURE VAULT
            </h2>
            <CyberInput
              label="💎 Gems"
              value={treasure.gems}
              onChange={(v) => setTreasure((t) => ({ ...t, gems: v }))}
            />
            <CyberInput
              label="💰 Gold"
              value={treasure.gold}
              onChange={(v) => setTreasure((t) => ({ ...t, gold: v }))}
            />
            <CyberInput
              label="🔹 Diamonds"
              value={treasure.diamonds}
              onChange={(v) => setTreasure((t) => ({ ...t, diamonds: v }))}
            />
          </HologramDisplay>

          {/* Crew Management */}
          <HologramDisplay
  initial={{ scale: 0.9 }}
  animate={{ scale: 1 }}
  transition={{ delay: 0.4 }}
  style={{ zIndex: 1 }}
>
  <h2
    style={{
      ...neonShadow('#ffbf00'),
      fontSize: '1.8rem',
      marginBottom: '1rem',
    }}
  >
    CREW NETWORK
  </h2>
  <div style={{ display: 'grid', gap: '1rem' }}>
    {pirates.map((pirate, index) => (
      <CyberPirateCard
        key={index}
        pirate={pirate}
        onUpdate={(newPirate) => {
          const updated = [...pirates];
          updated[index] = newPirate;
          setPirates(updated);
        }}
        onDelete={() => {
          const updated = pirates.filter((_, i) => i !== index);
          setPirates(updated);
        }}
      />
    ))}
    <CyberButton
      whileHover={{ scale: 1.05 }}
      onClick={() =>
        setPirates([...pirates, { name: `Pirate-${Date.now()}`, priority: 1 }])
      }
    >
      <GiPirateCannon style={{ marginRight: '0.5rem' }} />
      Initialize Crewmember
    </CyberButton>
  </div>
</HologramDisplay>

        </div>

        {/* Division Button */}
        <div style={{ textAlign: 'center', margin: '2rem 0', zIndex: 1 }}>
          <CyberButton
            whileHover={{ scale: 1.05 }}
            onClick={divideTreasure}
            disabled={isDividing}
            style={{ fontSize: '1.2rem', padding: '1rem 2.5rem' }}
          >
            {isDividing ? (
              <LoadingPulse />
            ) : (
              <>
                <GiGoldBar style={{ marginRight: '0.5rem', fontSize: '1.3rem' }} />
                Execute Division Protocol
              </>
            )}
          </CyberButton>
        </div>

        {/* Results */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ zIndex: 1, marginBottom: '2rem' }}
            >
              <HologramDisplay style={{ margin: '1rem 0' }}>
                <h2
                  style={{
                    ...neonShadow('#00f3ff'),
                    fontSize: '1.8rem',
                    marginBottom: '1rem',
                  }}
                >
                  DISTRIBUTION MATRIX
                </h2>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '2rem',
                  }}
                >
                  {results.map((result, index) => (
                    <CyberPirateResult key={index} result={result} />
                  ))}
                </div>
              </HologramDisplay>
            </motion.div>
          )}
        </AnimatePresence>
      </ContentWrapper>
    </Container>
  );
}

export default App;
