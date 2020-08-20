class DropBoxController {

    constructor(){

        this.btnSendFileEl = document.querySelector('#btn-send-file');
        this.inputFilesEl = document.querySelector('#files');
        this.snackModalEl = document.querySelector('#react-snackbar-root');
        this.progressBarEl = this.snackModalEl.querySelector(".mc-progress-bar-fg");
        this.nameFileEl = this.snackModalEl.querySelector(".filename");
        this.timeLeftEl = this.snackModalEl.querySelector(".timeleft");

        this.initEvents();

    }
    initEvents(){

        this.btnSendFileEl.addEventListener('click', event=>{

            this.inputFilesEl.click();

        });

        this.inputFilesEl.addEventListener('change', event=>{

            this.uploadTask(event.target.files);

            this.snackModalEl.style.display ='block';

        });

    }

    uploadTask(files){

        let promises = []; // subir um arquivo ou subir vários

        [...files].forEach(file=>{

            promises.push(new Promise((resolve, reject)=>{

                let ajax = new XMLHttpRequest();

                ajax.open('POST','/upload');

                ajax.onload = event => { //invocando o ajax assim que carregar 

                    try {
                        resolve(JSON.parse(ajax.responseText));
                    } catch (e){
                        reject(e);
                    }

                };
                ajax.onerror = event =>{ //Caso erro ao fazer upload

                    reject(event);

                };

                ajax.upload.onprogress = event => { //A cada byte enviado para o servidor, irá executar a função 

                    this.uploadProgress(event, file);
                   

                };

                let formData = new FormData ();

                formData.append('input-file', file); // append é para juntar

                ajax.send(formData); // usando a API form data para enviar arquivo

            }));

        });

        return Promise.all(promises);// Array de promessas

    }

    uploadProgress(event, file){

        let loaded = event.loaded;
        let total = event.total;

        let porcent = parseInt((loaded / total ) * 100);

        this.progressBarEl.style.width = `${porcent}%`;

        this.nameFileEl.innerHTML = file.name;
        this.timeLeftEl.innerHTML = '';

    }

}