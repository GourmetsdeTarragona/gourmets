import LoginButton from '../components/LoginButton';
import GuestExploreButton from '../components/GuestExploreButton';

function Home() {
  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>
      <img src="/logo.png" alt="Gourmets Tarragona" style={{ width: '150px', marginBottom: '2rem' }} />
      <h1>Bienvenido a Gourmets Tarragona</h1>
      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <LoginButton />
        <GuestExploreButton />
      </div>
    </div>
  );
}

export default Home;
