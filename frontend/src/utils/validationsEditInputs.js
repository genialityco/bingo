//expresión regular para valores numericos
const pattern = /^\d+$/;

//expresión regular para que no permita ingresar Url en el input de texto
const notUrlRegex = /^(?!https?:\/\/.*\.(?:jpe?g|gif|png)$)(?!https?:\/\/)[^\s]+$/i;


export const validationsEditInputsCarton = (input) => {
    let errors = {};
    
  
    if (input.text && !notUrlRegex.test(input.text)) {
        errors.text = "No puede ingresar una URL";
    }

   
    if (input.number && !notUrlRegex.test(input.number)) {
        errors.number = "No puede ingresar una URL";
    }

    return errors;
};

  
export const validationsEditInputsBallot = (input) => {
    let errors = {};

  
    if (input.text && !notUrlRegex.test(input.text)) {
        errors.text = "No puede ingresar una URL";
    }

   
    if (input.number && !notUrlRegex.test(input.number)) {
        errors.number = "No puede ingresar una URL";
    }

    return errors;
};

  


