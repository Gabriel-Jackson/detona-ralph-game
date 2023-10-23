function openModal(modalId){
  let modal = document.querySelector(`#${modalId}`);

  modal.classList.add("showing");
}

function closeModal(modalId){
  let modal = document.querySelector(`#${modalId}`);

  modal.classList.remove("showing");
}