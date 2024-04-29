//expresión regular para valores numericos
const pattern = /^\d+$/;

//expresión regular para que no permita ingresar Url en el input de texto
const notUrlRegex = /^(?!https?:\/\/.*\.(?:jpe?g|gif|png)$)(?!https?:\/\/)[^\s]+$/i;


export const validationsEditInputsCarton = (input) => {
    let errors = {};

  
    if (input.text && !notUrlRegex.test(input.text)) {
        errors.text = "No puede ingresar una URL";
    }

   
    if (input.number && !pattern.test(input.number)) {
        errors.number = "Solo puede ingresar valores numéricos";
    }

    return errors;
};

  
export const validationsEditInputsBallot = (input) => {
    let errors = {};

  
    if (input.text && !notUrlRegex.test(input.text)) {
        errors.text = "No puede ingresar una URL";
    }

   
    if (input.number && !pattern.test(input.number)) {
        errors.number = "Solo puede ingresar valores numéricos";
    }

    return errors;
};

  


