const Modal = ({children, open, toggleModal}) => {
  return (
    <>
    {open && (
    <div className="modal-container">
      <div className="overlay" onClick={toggleModal}>
        <div className="modal-elements" onClick={(e) => e.stopPropagation()}>
            {children}
            <button id='btn-closemodal' type="button" className="btn btn-danger" onClick={toggleModal}>X</button>
        </div>
      </div>
    </div>
    )}
    </>
  );
};

export default Modal;
