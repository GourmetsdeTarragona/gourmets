import { useState } from 'react';

function VoteForm({ categorias, onSubmit }) {
  const [votos, setVotos] = useState({});

  const handleChange = (categoriaId, value) => {
    setVotos((prev) => ({
      ...prev,
      [categoriaId]: parseInt(value, 10),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(votos);
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>Votar</h2>
      {categorias.map((categoria) => (
        <div key={categoria.id} style={{ marginBottom: '1rem' }}>
          <label>{categoria.nombre_categoria || categoria.nombre_extra}</label>
          <input
            type="number"
            min="1"
            max="10"
            required
            value={votos[categoria.id] || ''}
            onChange={(e) => handleChange(categoria.id, e.target.value)}
            style={{ width: '60px', marginLeft: '1rem' }}
          />
        </div>
      ))}
      <button type="submit" className="button-primary">
        Enviar votos
      </button>
    </form>
  );
}

export default VoteForm;
