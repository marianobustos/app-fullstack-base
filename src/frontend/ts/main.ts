class Main implements EventListenerObject, HandlerPost{
    public myFramework: MyFramework;
    public main(): void {
        console.log("Se ejecuto el metodo main!!!");
        this.myFramework = new MyFramework();
        this.actualizarDispositivos();  // Actualizo la lista de dispositivos desde el servidor
    }
    public mostrarLista() {
        let listaUsr: Array<User> = new Array<User>();

        let usr1 = new User(1, "matias", "mramos@asda.com", true);
        let usr2 = new User(2, "Jose", "jose@asda.com", false);
        let usr3 = new User(3, "Pedro", "perdro@asda.com", false);
        
        usr1.setIsLogged(false);
        listaUsr.push(usr1);
        listaUsr.push(usr2);
        listaUsr.push(usr3);
        
        for (let obj in listaUsr) {
            listaUsr[obj].printInfo();
        }
    }

//PROCEDIMIENTO AJAX PARA MOSTRAR LOS DISPOSITIVOS EN EL DASHBOAR DE LA PAGINA
public actualizarDispositivos() {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                let listaDis = JSON.parse(xhr.responseText);
                let listaDisp = this.myFramework.getElementById("listaDisp");
                listaDisp.innerHTML = "";
                for (let disp of listaDis) {
                    //DEPENDIENDO DEL TIPO MUESTRO UN INNERHTML U OTRO.
                    if (disp.type == 1) {
                        //ESTEINNER ES PARA LOS DIMMERS
                        listaDisp.innerHTML += `<li class="collection-item avatar">
                        <img src="./static/images/persiana.png" alt="" class="circle">
                        <span id="nombre_${disp.id}" class="nombreDisp">${disp.name}</span>
                        <p id="descripcion_${disp.id}">${disp.description}
                        </p>
                        <a href="#!" class="secondary-content">
                            <div>
                                <div>
                                    <p class="range-field">
                                        <input type="range" name="range" id="rango_${disp.id}" min="0" max="100" value="${disp.state}"/>
                                    </p>
                                </div>
                            </div>
                        </a>
                        <input id="tipodispositivo_${disp.id}" type="text" value="${disp.type}" hidden>
                        <a class="btn-floating btn-large waves-effect waves-light grey"><i class="material-icons" id="edit_${disp.id}">edit</i>edit</a>
                        <a class="btn-floating btn-large waves-effect waves-light red"><i class="material-icons" id="delete_${disp.id}">delete</i>delete</a>
                      </li>`;
                    }
                    else {
                        let estado = "";
                        if (disp.state) {
                            estado = "checked";
                        }
                        //ESTE INNER ES PARA LOS DISPOSITIVOS TIPO ON/OFF
                        listaDisp.innerHTML += `<li class="collection-item avatar">
                        <img src="./static/images/lightbulb.png" alt="" class="circle">
                        <span id="nombre_${disp.id}" class="nombreDisp">${disp.name}</span>
                        <p id="descripcion_${disp.id}">${disp.description}
                        </p>
                        <a href="#!" class="secondary-content">
                            <div class="switch">
                                <label >
                                    Off
                                    <input id="check_${disp.id}" type="checkbox" ${estado} >
                                    <span class="lever"></span>
                                    On
                                </label>
                            </div>
                        </a>
                        <input id="tipodispositivo_${disp.id}" type="text" value="${disp.type}" hidden>
                        <a class="btn-floating btn-large waves-effect waves-light grey"><i class="material-icons" id="edit_${disp.id}">edit</i>edit</a>
                        <a class="btn-floating btn-large waves-effect waves-light red"><i class="material-icons" id="delete_${disp.id}">delete</i>delete</a>
                        </li>`;
                    }
                }
                //RECORRO TODA LA LISTA DE DISPOSITIVOS Y CREO LOS EVENT LISTENERS
                for (let disp of listaDis) {
                    if (disp.type == 1) {
                        //Listener persianas
                        let rangeDisp = this.myFramework.getElementById("rango_" + disp.id);
                        rangeDisp.addEventListener("change", this);
                    }
                    else {
                        //Listener on/off
                        let checkDisp = this.myFramework.getElementById("check_" + disp.id);
                        checkDisp.addEventListener("click", this); 
                    }
                    //LISTENERS DE BOTONES EDITAR Y BORRAR
                    let editar = this.myFramework.getElementById("edit_" + disp.id);
                    editar.addEventListener("click", this);
                    let borrar = this.myFramework.getElementById("delete_" + disp.id);
                    borrar.addEventListener("click", this);
                }
            }
            else {
                alert("error!!");
            }
        }
    };
    xhr.open("GET", "http://localhost:8000/devices", true);
    xhr.send();
}




public handleEvent(ev: Event) {
    let objetoClick: HTMLInputElement = <HTMLInputElement>ev.target;
    //console.log(objetoClick.id);
    const [tipo,id] = objetoClick.id.split("_");
    //console.log(tipo , id);
    // @ts-ignore
    //console.log(document.getElementById(`tipodispositivo_${id}`).value);
    let tipoDisp = document.getElementById(`tipodispositivo_${id}`).value;
    let state;
    if(tipoDisp == 0){ // tipo ON/OFF
        // @ts-ignore
        console.log("Checked? " ,document.getElementById(`check_${id}`).checked);
        // @ts-ignore
        state = document.getElementById(`check_${id}`).checked ? 1:0;
    }
    else{
        // @ts-ignore
        state = document.getElementById(`rango_${id}`).value;
    }
    //console.log(document.getElementById(`nombre_${id}`).innerHTML);
    const body = {
        "id": parseInt(id),
        "name": document.getElementById(`nombre_${id}`).innerHTML,
        "description": document.getElementById(`descripcion_${id}`).innerHTML,
        "state": parseInt(state) ,
        "type": parseInt(tipoDisp)
    }
    console.log(body);
    switch(tipo){
        case "delete":{
            this.deleteDisp(parseInt(id));
            break;
        }
        case "check":
        case "range":
        case "edit" :{
            this.updateDisp(body);
            break;
        }
        
    }
    this.actualizarDispositivos();
}

deleteDisp(id: number){
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                console.log(`Se borro el dispositivo id_${id}`);
            }
        }
    }
    xhr.open("DELETE", `http://localhost:8000/devices/${id}`, true);
    xhr.send(null);
}

updateDisp(body: any){
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                console.log(`Se actualizó el dispositivo id_${body.id}`);
            }
        }
    }
    xhr.open("POST", `http://localhost:8000/devices/${body.id}`, true);
    xhr.setRequestHeader("Content-type","application/json");
    xhr.send(JSON.stringify(body));
}





responsePost(status: number, response: string) {
    alert(response);
}
   
}
window.addEventListener("load", ()=> {
    let miObjMain: Main = new Main();
    miObjMain.main();
    let btnNvoDisp: HTMLElement = miObjMain.myFramework.getElementById("nuevoDisp");
    btnNvoDisp.addEventListener("click", miObjMain);
    let modal = miObjMain.myFramework.getElementById("modalNvoDisp");
    modal.addEventListener("click", miObjMain);    
});




