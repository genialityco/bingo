//no permite ingresar una cadena larga como una URL
const notUrlRegex = /^[A-Za-zÀ-ÿ0-9\s]+$/;


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

  


