// CAC-TAT.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() { // describe - define a suíte de testes
    beforeEach(() => { // antes de cada teste (antes de cada it) ele roda esse cy.visit
      cy.visit('./src/index.html')
    })

    // bloco it - define um caso de teste
    // it.only é usado caso nos queiramos que apenas esse caso de teste seja executado
    
    it('verifica o título da aplicação', function() { // verificando se o título é "Central de Atendimento ao Cliente TAT"
      cy.title().should('eq', "Central de Atendimento ao Cliente TAT") // .should('be.equal', ...)
    }),

    it('preenche os campos obrigatórios e envia o formulário', function() {
      cy.get('#firstName').type("Lavinia")
      cy.get('#lastName').type("Rocha")
      cy.get('#email').type("lalavisrocha@gmail.com")
      cy.get('#open-text-area').type("nada a declarar", { delay: 10 }) // defino o tempo de digitação que vai levar

      cy.get('.button').click()
      cy.get('.success').should('be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function() {
      cy.get('#firstName').type("Lavinia")
      cy.get('#lastName').type("Rocha")
      cy.get('#email').type("lalavisrocha.com")
      cy.get('#open-text-area').type("nada a declarar")

      cy.get('.button').click()
      cy.get('.error').should('be.visible')
    })

    it('campo telefone continua vazio quando campo não-numérico', function() {
      cy.get('#phone').type("lalalala")
        .should('have.value', '')
      
      // cy.get('#phone').type('jdhcajdkcb')
      // cy.get('#phone'), function (){
      //     const number = '#phone'.number()
      //     expect(number).not.to.include(String)
      // }
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function () {
      cy.get('#firstName').type("Lavinia")
      cy.get('#lastName').type("Rocha")
      cy.get('#email').type("lalavisrocha@gmail.com")
      cy.get('#open-text-area').type("nada a declarar")

      cy.get('#phone-checkbox').check()

      cy.get('.button').click()
      cy.get('.error').should('be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function () {
      cy.get('#firstName')
        .type("Lavinia")
        .should('have.value', 'Lavinia')
        .clear()
        .should('have.value', '')

      cy.get('#lastName')
        .type("Rocha")
        .should('have.value', 'Rocha')
        .clear()
        .should('have.value', '')

      cy.get('#email')
        .type("lalavisrocha@gmail.com")
        .should('have.value', 'lalavisrocha@gmail.com')
        .clear()
        .should('have.value', '')

      cy.get('#open-text-area')
        .type("nada a declarar")
        .should('have.value', 'nada a declarar')
        .clear()
        .should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function() {
      cy.contains('button', 'Enviar').click()
      cy.get('.error').should('be.visible')
    })

    it('envia o formulário com sucesso usando um comando customizado', function() {
      cy.fillMandatoryFieldsAndSubmit()
      cy.get('.success').should('be.visible')
    })

    it('seleciona um produto (YouTube) por seu texto', function() {
      cy.get('#product').select('YouTube')
        .should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function() {
      cy.get('#product').select('mentoria')
        .should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', function() {
      cy.get('#product').select(1)
        .should('have.value', 'blog')
    })

    it('marca o tipo de atendimento "Feedback"', function() {
      //cy.get('input[type="radio"][value='feedback']').check()
      cy.get('input[type="radio"]').check('feedback')
        .should('have.value', 'feedback')
    })

    it('marca cada tipo de atendimento', function() {
      // cy.get('input[type="radio"]').check('ajuda')
      //   .should('have.value', 'ajuda')

      // cy.get('input[type="radio"]').check('elogio')
      //   .should('have.value', 'elogio')

      // cy.get('input[type="radio"]').check('feedback')
      //   .should('have.value', 'feedback')

      cy.get('input[type="radio"]')
        .should('have.length', 3) // <- verifico que tem 3 opções de radio
        .each(function($radio) { // <- como se fosse um for, vai passar opção por opção do radio e fazer o que eu pedi
          cy.get($radio).check() // <- wrap "empacota" para conseguir mandar comandos do cypress
          cy.get($radio).should('be.checked')
        }) // mas eu consegui usar o get... para que serve o wrap de verdade então?
    })

    it('marca ambos checkboxes, depois desmarca o último', function() {
      // cy.get('input[type="checkbox"]').check('email')
      //   .should('be.checked')

      // cy.get('input[type="checkbox"]').check('phone')
      //   .should('be.checked')

      // cy.get('input[type="checkbox"]').last().uncheck()

      cy.get('input[type="checkbox"]')
        .check()
        .should('be.checked')
        .last()
        .uncheck()
        .should('not.be.checked')
    })

    it('seleciona um arquivo da pasta fixtures', function() {
      cy.get('input[type="file"]').selectFile('cypress/fixtures/example.json')
      cy.get('input[type="file"]')
        .should(function($input){
          console.log($input)
          expect($input[0].files[0].name).to.equal("example.json")
        })
    })

    it('seleciona um arquivo simulando drag-and-drop', function() {
      cy.get('input[type="file"]').selectFile('cypress/fixtures/example.json', { action: 'drag-drop'})
        .should(function($input){
          console.log($input)
          expect($input[0].files[0].name).to.equal("example.json")
        })
    })

    it('seleciona um arquivo utilizando uma fixture para qual foi dada um alias', function() {
      cy.fixture('example').as('sampleFile')
      cy.get('input[type="file"]')
        .selectFile('@sampleFile')
        .should(function($input){
          console.log($input)
          expect($input[0].files[0].name).to.equal("example")
        })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function() {
      cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', function() {
      cy.get('#privacy a').invoke('removeAttr', 'target').click()
    })

    Cypress._.times(5, () => {
      it('exibe mensagem por 3 segundos', function() {
        cy.clock() // congela o relógio do navegador
        cy.contains('button', 'Enviar').click()  // ação que dispara algo que exibe uma mensagem por três segundos
        cy.get('.error').should('be.visible') // verificação de que a mensagem está visível
        cy.tick(3000) // avança o relógio três segundos (em milissegundos). Avanço este tempo para não perdê-lo esperando.
        cy.get('.error').should('not.be.visible') // verificação de que a mensagem não está mais visível
      })
    })

    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke()', function() {
      cy.get('.success')
        .should('not.be.visible')
        .invoke('show')
        .should('be.visible')
        .and('contain', 'Mensagem enviada com sucesso.')
        .invoke('hide')
        .should('not.be.visible')
      cy.get('.error')
        .should('not.be.visible')
        .invoke('show')
        .should('be.visible')
        .and('contain', 'Valide os campos obrigatórios!')
        .invoke('hide')
        .should('not.be.visible')
    })

    it('preenche a area de texto usando o comando invoke', function() {
      const textoLongo = Cypress._.repeat("um texto gigante ", 10);
      cy.get('#open-text-area')
        .invoke('val', textoLongo) // nisso nós não estamos digitando no campo, é como se já estivessemos colando o texto inteiro de uma vez, o que faz ser mais rápido
        .should('have.value', textoLongo)
    })

    it('faz uma requisição HTTP', function() {
      cy.request({
        method: 'GET',
        url: 'https://cac-tat.s3.eu-central-1.amazonaws.com/index.html'
      }).then((response => {
        expect(response.status).to.equal(200);
        expect(response.statusText).to.equal('OK');
        expect(response.body).to.include("CAC TAT");
      }))
    })

    it.only('ache o gato', function() {
      cy.get('#cat')
        .invoke('show')
        .should('be.visible')

      cy.get('#title')
        .invoke('text', 'CAT TAT')
    })
  })
