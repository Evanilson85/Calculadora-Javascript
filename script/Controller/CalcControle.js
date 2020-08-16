class CalcController {

    constructor() {

        this._audio = new Audio("click.mp3")
        this._audioOnOff = false
        this._lastOperator = ""
        this._lastNumber = ""
        this._operation = [] // onde vai guardar os meus valores da calculadora 
        this._locale = "pt-br"
        this._displayCalcEL = document.querySelector("#display")
        this._DeteEl = document.querySelector("#data")
        this._horaEl = document.querySelector("#hora")


        this._currentDate
        this.initialize()
        this.initBtnEvents()
        this.initKeyBoard()
    }

    initialize() { // é para iniciar quando abrir a calculadora esse é o metado principal que vai ser inicializado

        this.setDisplayDateHora()

        setInterval(() => {

            this.setDisplayDateHora()

        }, 1000)
        this.lastNumberDisplay()
        this.pastefromClipboart()

        document.querySelectorAll(".btn-ac").forEach(btn => {

            btn.addEventListener("dblclick", e => {
                this.toggleAudio()
            })

        })

    }

    toggleAudio() { // Audio

        this._audioOnOff = !this._audioOnOff

    }

    playAudio() { //audio
        if (this._audioOnOff) {

            this._audio.currentTime = 0
            this._audio.play()
        }
    }

    //metados ou Funcoes

    initBtnEvents() {

        let buttons = document.querySelectorAll("#buttons > g, #parts > g")// quando eu coloco > ele vai pegar os filhos de buttons e parts

        buttons.forEach((btn, index) => {


            this.addEventListenerAll(btn, "click drag ", e => { // vai executar o metado do addEventListenerAll

                let textBtn = btn.className.baseVal.replace("btn-", "")

                this.execBtn(textBtn)

            })

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => { //mouseup mousedown

                btn.style.cursor = "pointer"

            })

        })
    }

    //addEventListener eu mesmo criei pq não é nativo 
    addEventListenerAll(element, events, fn) { // esses paramentro são do 1 btn , 2 click drag são os nome, 3 e

        events.split(" ").forEach(event => {  //split ele vai converter a minha string com os eventos click ,drag em array

            element.addEventListener(event, fn, false)

        })

    }

    execBtn(value) {

        this.playAudio()
        switch (value) {

            case "ac":
                this.clearAll()
                break;
            case "ce":
                this.clearEntry()
                break;
            case "soma":
                this.addOperator("+")
                break;
            case "subtracao":
                this.addOperator("-")
                break;
            case "divisao":
                this.addOperator("/")
                break;
            case "multiplicacao":
                this.addOperator("*")
                break;
            case "porcento":
                this.addOperator("%")
                break;
            case "igual":
                this.calc()
                break;
            case "ponto":
                this.addDot(".")
                break;

            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                this.addOperator(parseInt(value))// vai converter a os meus numeros string em number
                break;
            default:
                this.setError()
                break;


        }
    }

    addDot() {

        let lastOperation = this.getlastOperation()

        if (typeof lastOperation === "string" && lastOperation.split("").indexOf(".") > -1) return;

        if (this.isOperation(lastOperation) || !lastOperation) {

            this.pushOperation("0.")
        } else {
            this.setLastOperation(lastOperation.toString() + ".")
        }

        //atualizar o display
        this.lastNumberDisplay()

        //console.log(lastOperation)

    }

    initKeyBoard() {



        document.addEventListener("keyup", e => {

            this.playAudio()
            // console.log(e.key)

            switch (e.key) {

                case "Delete":
                    this.clearAll()
                    break;
                case "Backspace":
                    this.clearEntry()
                    break;
                case "+":
                case "-":
                case "/":
                case "*":
                case "%":
                    this.addOperator(e.key)
                    break;

                case "Enter":
                case "=":
                    this.calc()
                    break;
                case ".":
                case ",":
                    this.addDot(".")
                    break;

                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                    this.addOperator(parseInt(e.key))// vai converter a os meus numeros string em number
                    break;

                case "c":
                    if (e.ctrlKey) this.copyToClipBoard()
                    break
            }

        })



    }

    pastefromClipboart() {

        document.addEventListener("paste", e => {

            let text = e.clipboardData.getData("Text")

            this.displayCalc = parseFloat(text)

            console.log(text)
        })

    }

    copyToClipBoard() {

        let input = document.createElement("input")

        input.value = this.displayCalc

        document.body.appendChild(input)

        input.select()

        document.execCommand("Copy")

        input.remove()

    }




    setError() { // vai retornar o error na tela

        this.displayCalc = "Error"

    }
    clearAll() { // vai zerar o meu arraw ou minha calculadora

        this._operation = []
        this._lastNumber = ""
        this._lastOperator = ""
        this.lastNumberDisplay()//vai mostrar o resultado na tela

    }

    clearEntry() { // vai limpar o ultimo do meu arraw ou calculadora com pop
        this._operation.pop()
        this.lastNumberDisplay()//vai mostrar o resultado na tela

    }
    addOperator(value) {

        if (isNaN(this.getlastOperation())) {  //os isNaN vai perguntar se é um numero ou string

            if (this.isOperation(value)) {
                //trocar de operador
                this.setLastOperation(value)

            } else {

                this.pushOperation(value) //aqui ele vai adicionar no arraw com push

                this.lastNumberDisplay()
            }
            // string 
        } else {


            if (this.isOperation(value)) {

                this.pushOperation(value) //aqui ele vai adicionar no arraw com push

            } else {


                let newValue = this.getlastOperation().toString() + value.toString()
                //numero concatena

                this.setLastOperation(newValue) //aqui ele vai adicionar no arraw com push

                //atualizar o display
                this.lastNumberDisplay()

            }
        }

        //console.log(this._operation)
    }

    setLastOperation(value) {

        this._operation[this._operation.length - 1] = value


    }

    isOperation(value) {

        return (["+", "-", "%", "*", "/"].indexOf(value) > -1)// retorna se é true ou false
    }

    getlastOperation() { // vai pegar o meu ultimo conteudo do meu arraw

        return this._operation[this._operation.length - 1]

    }

    setDisplayDateHora() {

        this.deteEl = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        })
        this.horaEl = this.currentDate.toLocaleTimeString(this._locale)

    }

    pushOperation(value) {
        this._operation.push(value)



        if (this._operation.length > 3) {

            this.calc()

        }

    }

    calc() {

        let last = ""

        this._lastOperator = this.getLastItem()

        if (this._operation.length < 3) {

            let firstItem = this._operation[0]
            this._operation = [firstItem, this._lastOperator, this._lastNumber]
        }

        if (this._operation.length > 3) {

            last = this._operation.pop()
            this._lastNumber = this.getResult()
        } else if (this._operation.length == 3) {

            this._lastNumber = this.getResult(false)
        }

        // console.log("Operador", this._lastOperator);
        // console.log("number", this._lastNumber)

        let result = this.getResult()



        if (last == "%") {

            result = result / 100

            this._operation = [result]
        } else {

            this._operation = [result] // aqui vai criar um no arraw com as variaveis result e last

            if (last) this._operation.push(last)
        }


        this.lastNumberDisplay()//vai mostrar o resultado na tela

        //   console.log("este", this._operation)
    }


    getResult() {

        //  console.log("getResult", this._operation)
        try {
            return eval(this._operation.join("")) //! até aqui vai guardar o resultado nesse let e o eval soma mesmo em string e o join ele converte o array em string e remove as virgulas ele é o oposto do split que transforma string em arraw
        } catch (e) {
            setTimeout(() => {

                this.setError()

            }, 1)
        }


    }

    lastNumberDisplay() { //pegar o ultimo numero para colocar display

        let lastNumber = this.getLastItem(false)

        if (!lastNumber) lastNumber = 0

        this.displayCalc = lastNumber

    }

    getLastItem(isOperation = true) {

        let lastItem;

        for (let i = this._operation.length - 1; i >= 0; i--) {

            if (this.isOperation(this._operation[i]) == isOperation) {
                lastItem = this._operation[i];
                break;
            }

        }

        if (!lastItem) {


            lastItem = (isOperation) ? this._lastOperator : this._lastNumber;  //  ? se for verdade execulta isso : se não

        }
        return lastItem

    }

    get deteEl() {
        return this._DeteEl.innerHTML
    }

    set deteEl(value) {
        return this._DeteEl.innerHTML = value
    }

    get horaEl() {
        return this._horaEl.innerHTML
    }

    set horaEl(value) {
        return this._horaEl.innerHTML = value
    }


    get displayCalc() { // o que vai retornar na tela
        return this._displayCalcEL.innerHTML
    }

    set displayCalc(value) {

        if (value.toString().length > 10) {
            this.setError()
            return false
        }

        this._displayCalcEL.innerHTML = value
    }

    get currentDate() {
        return new Date()
    }

    set currentDate(value) {
        this._currentDate = value
    }

}