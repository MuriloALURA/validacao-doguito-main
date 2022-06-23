export function valida(input) {
    const tipoDeInput = input.dataset.tipo

    if(validadores[tipoDeInput]){
        validadores[tipoDeInput](input)
    }
    if(input.validity.valid) {
        input.parentElement.classList.remove('input-container--invalido')
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = ''
    } else{
        input.parentElement.classList.add('input-container--invalido')
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = mostraMensagemDeErro(tipoDeInput, input)
    }
}

const tiposDeErro = [
    'valueMissing',
    'typeMismatch',
    'patternMismatch',
    'customError'
]

const mensagensDeErro = {
    nome:{
        valueMissing:'O campo do Nome não pode estar vazio'
    },
    email:{
        valueMissing:'O campo do Email não pode estar vazio',
        typeMismatch: 'O email digitado não é valido'
    },
    senha:{
        valueMissing:'O campo de Senha não pode estar vazio',
        patternMismatch: 'A senha deve conter entre 6 a 12 caracteres, deve conter pelo menos uma letra maiúscula, um número e não deve conter símbolos'
    },
    dataNascimento:{
        valueMissing:'O campo de Data não pode estar vazio',
        customError: 'Você deve ser maior de 18 anos para se cadastrar'
    },
    cpf: {
        valueMissing: 'O Campo do CPF não pode estar vazio',
        customError: 'O CPF digitado não é valido'
    },
    cep: {
        valueMissing: 'O campo de CEP não pode estar vazio',
        patternMismatch: 'O CEP digitado não é valido'
    }
}

const validadores = {
    dataNascimento: input => validaDataNascimento,
    cpf:input => validaCPF(input)
}

function mostraMensagemDeErro(tipoDeInput, input){
    let mensagem = ''
    tiposDeErro.foreach(erro =>{
        if(input.validty[erro]) {
            mensagem = mensagensDeErro[tipoDeInput][erro]
        }
    })
    return
}

function validaDataNascimento(input){
    const dataRecebida = newDate(input.value)
    let mensagem = ''

    if(!maiorQue18(dataRecebida)){
    mensagem = 'Você deve ser maior de 18 anos para se cadastrar.'
    }

    input.setCustomValidity(mensagem)
}

function maiorQue18(data){
    const dataAtual = new Date()
    const dataMais18 = new Date(data.getUTCFullYear() +18, data.getUTCMonth(), data.getUTCDate() )
    return dataMais18 <= dataAtual
}

function validaCPF(input){
    cpfFormatado = input.value.replace(/\D/g, '')
    let mensagem =''
    input.setCustomValidity(mensagem)

    if(!checaCPFRepetido(cpfFormatado) || checaEstruturaCPF(cpfFormatado)){
        mensagem = 'O CPF digitado não é valido'
    }
}

function checaCPFRepetido (cpf) {
    const valoresRepetidos = [
        '00000000000',
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999'
    ]
    let CpfValido = true;

    valoresRepetidos.forEach(valor =>{
        if(valor == cpf) {
            CpfValido = false
        }
        return CpfValido
    })
}

function checaEstruturaCPF(cpf){
    const multiplicador = 10
    return checaDigitoVerificador(cpf, multiplicador)
}

function checaDigitoVerificador(cpf, multiplicador){
    if(multiplicador >=12){
        return true
    }

    let multiplicadorInicial = multiplicador
    let soma = 0
    const CpfSemDigitos = cpf.substr(0, multiplicador -1).split('')
    const digitoVerificador = cpf.charAt(multiplicador -1)
    for (let contador = 0; multiplicadorInicial > 1; multiplicadorInicial--) {
        soma = soma + CpfSemDigitos[contador] * multiplicadorInicial
        contador++
    }

    if(digitoVerificador == confirmaDigito(soma)) {
        return checaDigitoVerificador(cpf, multiplicador +1)
    }
}

function confirmaDigito(soma){
    return 11 - (soma%11)
}