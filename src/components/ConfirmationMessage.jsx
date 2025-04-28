function ConfirmationMessage({ message }) {
  if (!message) return null;

  return (
    <div className="card" style={{ backgroundColor: '#d4edda', color: '#155724', marginTop: '1rem' }}>
      {message}
    </div>
  );
}

export default ConfirmationMessage;
