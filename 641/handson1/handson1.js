var filename = "handson.js";
console.log(filename + " was included in this web page.");

function sayHello(from_name){

    let message = 'Hey from  ';
    console.log(message + from_name);

}


sayHello('qweqw')

// Object
let gotz ={};
gotz.name = 'gotz';
gotz.title = 'AP';
gotz.building = 'manning';
let mostafa = {
    name: 'mostafa',
    title: 'professor',
    building: 'manning'
};
let third = {
    name: 'third',
    title: 'professor',
    building: 'xx'
};


// Array
let professors = [gotz, mostafa, third]

for(let i =0; i <professors.length; i++){
    console.log(professors[i].name)
}

console.log('-------------')
// Filter
let manning_professor = professors.filter(function (d){
    return d.building == "manning";
});

for(let i =0; i <manning_professor.length; i++){
    console.log(manning_professor[i])
}


console.log('-------------')
// map
let prof_description = professors.map(function (d){
    let desc =  d.name + 'is in ' + d.building
    d.desc = desc
    return desc
})
for(let i =0; i <prof_description.length; i++){
    console.log(prof_description[i])
}



function toggleColor(){ 
    // get circle object
    let circle = document.getElementById('togglecirle');
    if (circle.clicked == true){
        circle.clicked = false;
        circle.setAttribute('fill', 'purple')
    }
    else {
        circle.clicked = true
        circle.setAttribute('fill', 'red')
    }
}

function move_Square(){
    // get square
    let square = document.getElementById('random_square');
    console.log(square)

    // calculate a new position
    let random_x = Math.floor(Math.random() * 550);
    let random_y = Math.floor(Math.random() * 350);

    // move square
    square.setAttribute('x', random_x);
    square.setAttribute('y', random_y);
}




