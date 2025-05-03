function RankingList({ restaurantes, titulo }) {
  return (
    <div style={{ marginBottom: '3rem' }}>
      <h2 style={{
        marginBottom: '1rem',
        fontSize: '1.5rem',
        borderBottom: '2px solid #ccc',
        paddingBottom: '0.5rem'
      }}>
        {titulo}
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {restaurantes.map((rest, index) => (
          <div
            key={rest.restaurante_id}
            className="card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderLeft: '5px solid #000',
              padding: '1.5rem'
            }}
          >
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              #{index + 1} – {rest.nombre}
            </h3>
            <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#007bff' }}>
              Nota media: <span style={{ fontSize: '1.2rem' }}>
  {rest.promedio ? parseFloat(rest.promedio).toFixed(2) : '—'}
</span>

            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RankingList;
