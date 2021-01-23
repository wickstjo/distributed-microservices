const contracts = [
    'UserManager',
    'OracleManager',
    'ServiceManager',
    'TaskManager',
    'TokenManager'
]

module.exports = (deployer) => {
    contracts.forEach(path => {
        deployer.deploy(
            artifacts.require('./contracts/' + path + '.sol')
        )
    })
}