const { ipcRenderer } = require('electron') // Módulo para comunicação com o processo principal do Electron

module.exports = async function users(page, waiters, storeName, cancelPassword, admPermissions) {
  try {
    
    // Acesso à página
    await page.goto('https://conta.saipos.com/#/app/store/users', {timeout: 0})

    // Cadastro de senha
    try {
      if (cancelPassword) {
        await timeOut(1000)
        await waitForAndClick(page, '#content > data > div > form > div > div.table-responsive.ng-scope > table > tbody > tr > td:nth-child(8) > button:nth-child(1)')
        await waitForAndType(page, '#myInput', '123')
        await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > form > div.modal-footer.p-t-0 > button.btn.btn-primary.m-b-0.waves-effect')
        await timeOut(1000)
      }
    } catch {
      ipcRenderer.send('show-alert', `Senha de cancelamento no usuário não cadastrada, revise após a execução do programa.`)
    }

    // Gerenciamento de permissões
    try {
      if (admPermissions) {
        await timeOut(1000)
        await waitForAndClick(page, '#content > data > div > form > div > div.table-responsive.ng-scope > table > tbody > tr > td:nth-child(8) > a')
        await waitForAndClick(page, '#content > data > div > form > div > div.container > div.row > div:nth-child(1) > div:nth-child(2) > h3 > div > label > input')
        await waitForAndClick(page, '#content > data > div > form > div > div.container > div.row > div:nth-child(3) > div:nth-child(2) > h3 > div > label > input')
        await waitForAndClick(page, '#content > data > div > form > div > div.container > div.pull-right.m-b-15 > button.btn.btn-primary.m-b-0.pull-right.waves-effect')
        await timeOut(1000)
      }
    } catch {
      ipcRenderer.send('show-alert', `Permissões de adm não cadastradas, revise após a execução do programa.`)
    }

    // Cadastro de garçons
    if (waiters > 0) {
      for (let i = 1; i <= waiters; i++) {
          await timeOut(1000)
          await waitForAndClick(page, '#content > data > div > form > div > div.lv-header-alt.clearfix.m-b-5.p-0.p-l-10 > button')
          await waitForAndType(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > form > div.modal-body.p-l-5.p-r-5.p-b-0 > div > div:nth-child(1) > div:nth-child(1) > div > div > input', `Garçom ${i}`)
          await waitForAndType(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > form > div.modal-body.p-l-5.p-r-5.p-b-0 > div > div:nth-child(1) > div:nth-child(2) > div > div > input', `atendente${i}@${storeName}.com`)
          await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > form > div.modal-body.p-l-5.p-r-5.p-b-0 > div > div.row.m-t-5.ng-scope > div > div > div > div > div > a')
          await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > form > div.modal-body.p-l-5.p-r-5.p-b-0 > div > div.row.m-t-5.ng-scope > div > div > div > div > div > div > ul > li:nth-child(5)')
          
          // Conferência ordem alfabética para lista de usuários de impressão
          if (storeName > "garçom") {
            await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > form > div.modal-body.p-l-5.p-r-5.p-b-0 > div > div:nth-child(3) > div > div > div > div > div > a > div')
            await waitForAndClick(page, `body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > form > div.modal-body.p-l-5.p-r-5.p-b-0 > div > div:nth-child(3) > div > div > div > div > div > div > ul > li:nth-child(${i + 2})`)
          } else {
            await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > form > div.modal-body.p-l-5.p-r-5.p-b-0 > div > div:nth-child(3) > div > div > div > div > div > a > div')
            await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > form > div.modal-body.p-l-5.p-r-5.p-b-0 > div > div:nth-child(3) > div > div > div > div > div > div > ul > li:nth-child(3)')
          }
          await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > form > div.modal-footer.p-t-0 > button.btn.btn-primary.m-b-0.waves-effect')
          await timeOut(3000)
      }

      await timeOut(1000)
    }

    // Tempo para Salvar
    await page.goto('https://conta.saipos.com/#/', {timeout: 0})
    await timeOut(2000)

  //Tratamento de erros
  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro dos USUÁRIOS', error)
    ipcRenderer.send('show-alert', 'Ocorreu um erro durante o cadastro de USUÁRIOS, revise após a execução do programa.')
    return  ["USUÁRIOS: ",{ stack: error.stack }]
  }
}