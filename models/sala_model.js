

class Sala_Model{
    
    #id;
    #sala
    #professor
    #turno
    #hrinicio
    #hrtermino

    get id(){
        return this.#id;
    }

    set id(value){
        this.#id = value;
    }

    get sala(){
        return this#sala;
    }

    set sala(value){
        this.#sala = value;
    }
    get professor(){
        return this#professor;
    }

    set professor(value){
        this.#professor = value;
    }
    get turno(){
        return this#turno;
    }

    set turno(value){
        this.#turno = value;
    }
    get hrinicio(){
        return this#hrinicio;
    }

    set hrinicio(value){
        this.#hrinicio = value;
    }
    get hrtermino(){
        return this#hrtermino;
    }

    set hrtermino(value){
        this.#hrtermino = value;
    }

    constructor(id, sala, professor, turno, hrinicio, hrtermino){
        this.#id = id;
        this.#sala = sala;
        this.#professor = professor;
        this.#turno = turno;
        this.#hrinicio = hrinicio;
        this.#hrtermino = hrtermino;
    }
}

module.exports = Sala_Model;