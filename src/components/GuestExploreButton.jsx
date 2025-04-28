import { useNavigate } from 'react-router-dom';

function GuestExploreButton() {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate('/restaurants');
  };

  return (
    <button className="button-primary" onClick={handleExplore}>
      Explorar como invitado
    </button>
  );
}

export default GuestExploreButton;
