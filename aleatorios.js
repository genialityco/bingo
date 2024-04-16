
// metodo que genera un numero aleatio entre el 0-1 siendo el cero incluvo y el uno exclusivo.

let random= Math.random();
console.log(random)


//existes tres metodos para redondear:
//.floor()-> redondea a la base eje: 4,6 =4
//.ceil()-> redondea hacia arriba, al techo eje: 4,2=5
//round()->redondea al mas cercano eje: 4,2 = 4 o 4,6 =5

//usamos el floor para redondear a la base, pero como nunca llega al numero del ultimo rango debo sumarle 1 


//Para generar un rango especifico se usa esta formula:
// Math.floor(Math.random()* (MAX-MIN +1) +MIN)
//en el MAX y el MIN se especifica el rango: 1-6
//cfgfgfhjhuidsawwetu
let random2= Math.floor(Math.random()* (6-1 +1) +1)
console.log(random2)




