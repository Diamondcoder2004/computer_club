const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    host: '0.0.0.0',       // Доступ со всех сетевых интерфейсов
    port: 8080,            // Порт (можно изменить)
    hot: true,             // Горячая перезагрузка
    open: false,           // Не открывать браузер автоматически
    client: {
      webSocketURL: 'auto://0.0.0.0:0/ws'  // Для корректной работы HMR
    },
    allowedHosts: 'all'    // Разрешить все хосты
  }
})