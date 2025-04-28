import { useNavigate } from 'react-router-dom';

function RestaurantCard({ restaurant }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/vote/${restaurant.id}`);
  };

  return (
    <div className="card" onClick={handleClick} style={{ cursor: 'pointer', marginBottom: '1rem' }}>
      <h2>{restaurant.nombre}</h2>
      <p>Fecha: {new Date(restaurant.fecha).toLocaleDateString()}</p>
      <p>Asistentes: {restaurant.asistentes?.length || 0}</p>
    </div>
  );
}

export default RestaurantCard;
