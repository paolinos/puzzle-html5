// fix watch files with WSL & windows
export default () => {

    return {
        server: {
            host: '0.0.0.0',
            watch: {
                usePolling: true
            }
        }
    }
}