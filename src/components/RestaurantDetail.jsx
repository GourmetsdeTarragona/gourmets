function RestaurantDetail({ restaurant }) {
  if (!restaurant) return null;

  return (
    <div className="container">
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2>{restaurant.nombre}</h2>
        <p>Fecha de la cena: {new Date(restaurant.fecha).toLocaleDateString()}</p>
        <p>Asistentes confirmados: {restaurant.asistentes?.length || 0}</p>
        {restaurant.fotos && restaurant.fotos.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <h3>Fotos:</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              {restaurant.fotos.map((fotoUrl, index) => (
                <img
                  key={index}
                  src={fotoUrl}
                  alt={`Foto ${index + 1}`}
                  style={{ width: '150px', height: 'auto', borderRadius: '0.5rem' }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RestaurantDetail;
