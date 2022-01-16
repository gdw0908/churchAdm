const target = 'http://127.0.0.1:3001';

module.exports = {
  devServer: {
    overlay: false,
    port: 8080,
    proxy: {
      '^/api': {
        target,
        changeOrigin: true
      },
      '^/upload': {
        target,
        changeOrigin: true,
      },
      '^/download': {
        target,
        changeOrigin: true,
      },
      '^/ckeditor': {
        target,
        changeOrigin: true,
      }
    }
  }
}  