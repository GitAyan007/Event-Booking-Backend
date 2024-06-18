const {buildSchema} = require('graphql');

module.exports = buildSchema(` 
type Booking {
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
}

type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    creator: User!
}
type User {
    _id: ID!
    email: String!
    password: String
    createdEvents: [Event!]
}

type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
}

# it acts as a argument (This helps in reducing the size of arguments) using the keyword input
input EventInput {
    title: String! 
    description:String! 
    price:Float!
    date:String!
}

input UserInput{
    email:String!
    password:String!
}

type RootQuery { # here i can write as  many queries as i want 
    events: [Event!]!
    bookings: [Booking!]!
    login(email:String!, password:String!): AuthData!
}

type RootMutation {  # here i can write as  many mutation as i want 
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
    bookEvent(eventId: ID!): Booking!
    cancelEvent(bookingId: ID!): Event
}

# schema here is a key which need to be present 
schema {
    query: RootQuery  # here i am bundling all the queries under the Query key word
    mutation: RootMutation # same as above
}
`)