const { gql } = require('apollo-server-express');

module.exports = gql`
  type Book {
    bookId: String!
    authors: [String]!
    title: String!
    description: String!
    image: String!
    link: String!
  }

  input BookInput {
    bookId: String!
    authors: [String]!
    title: String!
    description: String!
    image: String!
    link: String!
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    createUser(username: String!, email: String!, password: String!): Auth
    addBook(book: BookInput!): User
    removeBook(bookId: String!): User
  }
`;
