function AccessDenied() {
  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>
      <h1 style={{ fontSize: '2rem', color: '#d9534f' }}>Acceso denegado</h1>
      <p style={{ marginTop: '1rem' }}>
        No tienes permiso para acceder a esta página.
      </p>
    </div>
  );
}

export default AccessDenied;
