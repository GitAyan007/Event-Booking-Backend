const userResolver = require('./Res-User')
const eventResolver = require('./Res-Event')
const bookResolver = require('./Res-Booking')


// global collection of resolvers
// spreading each resolvers here

const rootResolver = {
    ...userResolver,
    ...eventResolver,
    ...bookResolver
}

module.exports = rootResolver;